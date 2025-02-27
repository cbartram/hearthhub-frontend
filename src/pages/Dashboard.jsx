import React, { useState, useEffect, useCallback } from 'react';
import {useAuth} from '@/context/AuthContext.jsx'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import CreateServer from '@/components/CreateServer'
import ServersList from "@/components/ServersList.jsx";
import ModInstall from "@/components/ModInstall";
import {KubeApiClient} from "@/lib/api.js";
import {formatBytes} from "@/lib/utils.ts";
import BackupsList from "@/components/BackupsList";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {AlertCircle, Menu} from "lucide-react";
import {isProd, K8S_BASE_URL} from "@/lib/constants";
import ConfigViewer from "@/components/ConfigViewer.jsx";

const DEFAULT_MODS = ["ValheimPlus", "ValheimPlus_Grant", "DisplayBepInExInfo", "BetterArchery", "BetterUI", "PlantEverything", "EquipmentAndQuickSlots"]


/**
 * Custom hook which maintains state around the windows size so Dashboard can adapt accordingly when the window size changes.
 * @returns {{width: number, height: number}}
 */
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}



const Dashboard = () => {
    const {user, logout} = useAuth()
    const kubeApi = new KubeApiClient(user);
    const { width } = useWindowSize();
    const [resourceMetrics, setResourceMetrics] = useState([])
    // TODO Set cpu and mem limit on the user's account rather than from the server
    // this will let us add plans which increase cpu/mem limit for servers
    const [cpuLimit, setCpuLimit] = useState(user.subscriptionLimits.cpuLimit)
    const [memLimit, setMemLimit] = useState(user.subscriptionLimits.memoryLimit)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState('servers');
    const [serversLoading, setServersLoading] = useState(true)
    const [logs, setLogs] = useState([])
    const [servers, setServers] = useState([])
    const [mods, setMods] = useState([]);
    const [primaryBackups, setPrimaryBackups] = useState([])
    const [replicaBackups, setReplicaBackups] = useState([])
    const [configs, setConfigs] = useState([])
    const [editedServer, setEditedServer] = useState({})
    const [errorDialogue, setErrorDialogue] = useState({
        visible: false,
        title: '',
        message: '',
    })

    const stringToIntTruncated = (str) => {
        const num = parseFloat(str);
        if (isNaN(num)) {
            return NaN; // Handle cases where the string is not a valid number
        }
        const truncatedNum = Math.trunc(num * 100) / 100;
        return truncatedNum;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    kubeApi.getServers()
                        .then(s => {
                            setServers([
                                ...s.servers.map(serv => ({
                                    ...serv,
                                    // Insert temp join code while we wait for the actual to come through ws
                                    joinCode: ""
                                }))
                            ])
                        })
                        .catch(err => {
                            console.error('failed to load servers: ', err);
                            setErrorDialogue({
                                visible: true,
                                title: 'Error retrieving servers',
                                message: 'Failed to retrieve servers. Details: ' + err.message
                            })
                            return []
                        }),
                    kubeApi.listFiles()
                        .then(res => {
                            const backups = []
                            const replicas = []
                            const backupKeys = {}

                            setConfigs([
                                ...res.configs.map(config => {
                                    const name = config.key.split("/")[config.key.split("/").length - 1]
                                    for(const installedConfigFile in user.installedConfig) {
                                        if(name === installedConfigFile) {
                                            return {
                                                name,
                                                content: '',
                                                key: config.key,
                                                size: config.fileSize,
                                                updated: false,
                                                installed: true,
                                                installing: false,
                                            }
                                        }
                                    }

                                    return {
                                        name,
                                        content: '',
                                        key: config.key,
                                        size: config.fileSize,
                                        updated: false,
                                        installed: false,
                                        installing: false,
                                    }
                                })
                            ])

                            // Re-map mods
                            setMods([
                                ...res.mods.map((file, i) => {
                                    const parts = file.key.split('/');
                                    let filename = parts[parts.length - 1];
                                    filename = filename.slice(0, -4);

                                    const remappedMod = {
                                        id: i,
                                        name: filename,
                                        size: formatBytes(file.fileSize),
                                        default: DEFAULT_MODS.includes(filename),
                                        installed: false,
                                        installing: false,
                                    }

                                    // Incorporate cognito data from when a user installed a mod (previously) so that
                                    // we can mark the mod as installed already.
                                    for (const key in user.installedMods) {
                                        if (key.slice(0, -4) === filename) {
                                            remappedMod.installed = user.installedMods[key]
                                        }
                                    }

                                    return remappedMod;
                                })
                            ])

                            // Re-map backups
                            for(const file of res.backups) {
                                backupKeys[file.key] = ""
                            }

                            // Note: we only push .db files, .fwl files are stored and synced along with db's on the backend
                            // however, as to not confuse users and avoid any file name issues when merging user state in cognito
                            // we only present .db files for install to users.
                            for(const file of res.backups) {
                                let ext = file.key.slice(file.key.lastIndexOf(".") + 1, file.key.length)
                                let base = file.key.slice(0, file.key.lastIndexOf("."))
                                if(file.key.includes("_backup_auto-") && ext === "db") {
                                    if(backupKeys.hasOwnProperty(`${base}.fwl`)) {
                                        replicas.push(file)
                                    } else {
                                        console.log(`replica: ${file.key} does not have corresponding .fwl`)
                                    }
                                } else if(ext === "db") {
                                    backups.push(file)
                                }
                            }


                            // Check each backup install status from cognito, if there is a match between the s3
                            // files and cognito then take the install status of cognito. If no match is found
                            // the backup has never been installed on the pvc.
                            setPrimaryBackups(backups.map(b => {
                                for (const key in user.installedBackups) {
                                    let shortName = b.key.slice(b.key.lastIndexOf("/") + 1, b.key.length)
                                    if (key === shortName) {
                                        return {
                                            ...b,
                                            installing: false,
                                            installed: user.installedBackups[key]
                                        }
                                    }
                                }

                                return {
                                    ...b,
                                    installing: false,
                                    installed: false
                                }
                            }))

                            setReplicaBackups(replicas.map(b => {
                                for (const key in user.installedBackups) {
                                    let shortName = b.key.slice(b.key.lastIndexOf("/") + 1, b.key.length)
                                    if (key === shortName) {
                                        return {
                                            ...b,
                                            installing: false,
                                            installed: user.installedBackups[key]
                                        }
                                    }
                                }

                                return {
                                    ...b,
                                    installing: false,
                                    installed: false
                                }
                            }))

                            return [];
                        })
                        .catch(err => {
                            console.error("failed to list mods: ", err);
                            setErrorDialogue({
                                visible: true,
                                title: 'Error retrieving Mods',
                                message: 'Failed to retrieve mods. Details: ' + err.message
                            })
                            return [];
                        }),
                ]);
            } catch (err) {
                console.error("Error fetching data: ", err);
                setErrorDialogue({
                    visible: true,
                    title: 'Error fetching data',
                    message: 'Failed to retrieve general data. Details: ' + err.message
                })
            } finally {
                setServersLoading(false);
            }
        };

        fetchData();
    }, [])

    // Memoized WebSocket message handler
    const handleWebSocketMessage = useCallback((event) => {
        const message = JSON.parse(event.data);
        const content = JSON.parse(message.content);

        if(message.type !== "Metrics") {
            console.log('ws message:', message)
        }
        switch (message.type) {
            case "Logs":
                setLogs(prevLogs => [...prevLogs, ...content.logs])
                break;
            case "JoinCode":
                setServers(prevServers =>
                    prevServers.map(serv => {
                        if(serv.deployment_name === content.containerName) {
                            return {
                                ...serv,
                                joinCode: content.joinCode
                            }
                        }
                        return serv
                    })
                );
                break;
            case "Metrics":
                setResourceMetrics((prevMetrics) =>
                    [
                        ...prevMetrics,
                        {
                            cpu: stringToIntTruncated(content.cpuUtilization),
                            memory: stringToIntTruncated(content.memoryUtilization),
                            time: new Date().toLocaleTimeString(),
                        },
                    ].slice(-20)
                );
                break;
            case "PostStart":
                updateServerState('loading', content.containerName);
                break;
            case "ContainerReady":
                if (content.containerType === "server") {
                    updateServerState('running', content.containerName);
                }
                break;
            case "PreStop":
                if (content.containerType === "file-install") {
                    setMods((prevMods) =>
                        prevMods.map((m) =>
                            m.installing
                                ? { ...m, installing: false, installed: content.operation === "write" }
                                : m
                        )
                    );

                    setConfigs(prevConfigs => prevConfigs.map(c => c.installing ? {...c, installing: false, installed: content.operation === "write" } : c))

                    setPrimaryBackups((prevBackups) =>
                        prevBackups.map((b) =>
                            b.installing
                                ? { ...b, installing: false, installed: content.operation === "write" }
                                : b
                        )
                    );

                    setReplicaBackups((prevReplicas) =>
                        prevReplicas.map((r) =>
                            r.installing ? { ...r, installing: false } : r
                        )
                    );
                } else if (content.containerType === "server") {
                    updateServerState('stopped', content.containerName);
                }
                break;
            default:
                console.log(`unknown message type: ${message.type} content = ${message.content}`);
        }
    }, []);

    // WebSocket setup
    useEffect(() => {
        const ws = new WebSocket(`${isProd() ? K8S_BASE_URL : "http://localhost:8080"}/api/v1/ws?id=${user.discordId}`);

        // To use the local ws-server instead of the local hearthhub-kube-server websockets uncomment
        // const ws = new WebSocket("ws://localhost:8888")

        ws.addEventListener('message', handleWebSocketMessage);
        ws.addEventListener('error', (event) => {
            console.error('websocket error:', event);
            setErrorDialogue({
                visible: true,
                title: 'Error receiving event',
                message: `Failed to receive websocket event. Details: ${event}`,
            });
        });

        return () => {
            if (ws) {
                console.log('closing ws');
                ws.close();
            }
        };
    }, [handleWebSocketMessage, user.discordId]);

    useEffect(() => {
        if (width >= 1024 && !isSidebarOpen) {
            setIsSidebarOpen(true)
        } else {
            setIsSidebarOpen(false)
        }
    }, [width]);

    const updateServerState = (state, containerName) => {
        setServers(prevServers =>
            prevServers.map(serv => {
                if(serv.deployment_name === containerName) {
                    return {
                        ...serv,
                        state
                    }
                }
                return serv
            })
        );
    }

    /**
     * Creates a new billing session to direct users towards using the customer id.
     * @param customerId String stripe customer id
     * @returns {Promise<void>}
     */
    const createBillingSession = async (customerId) => {
        try {
            const res = await kubeApi.createBillingSession(null, customerId)
            window.location.href = res.url
        } catch (e) {
            console.log('error creating stripe billing session: ', e)
        }
    }

    /**
     * Converts a list of modifiers (needed to send a request to the server) into an object; required to prepopulate
     * form fields on the UI.
     * @param modifiers
     */
    const modifierToObject = (modifiers) => {
        const obj = {}
        for(const modifier of modifiers) {
            obj[modifier.key] = modifier.value
        }
        return obj
    }

    /**
     * Converts an object with given modifier keys into a list of modifiers for the server to consume.
     * @param server
     */
    const objToModifier = (server) => {
        const specificKeys = ['combat', 'deathpenalty', 'resources', 'raids', 'portals'];
        const modifiers = [];

        for (const key of specificKeys) {
            if (server[key] !== 'standard') {
                modifiers.push({ key, value: server[key] });
            }
        }
        return modifiers
    }

    const handleEditServer = (server) => {
        setActiveView('servers')
        const body = {
            "name": server.name,
            "world": server.world,
            "password": server.password,
            "public": server.isPublic,
            "enable_crossplay": server.isCrossplay,
            "modifiers": objToModifier(server),
            "save_interval_seconds": server.saveIntervalSeconds,
            "backup_count": server.backupCount,
            "initial_backup_seconds": server.initialBackupSeconds,
            "backup_interval_seconds": server.backupIntervalSeconds
        };

        setServersLoading(true)
        kubeApi.patchServer(body).then((server) => {
            setServers([
                ...servers.map(s => {
                    if(s.deployment_name === server.deployment_name) {
                        return {
                            ...s,
                            ...server
                        }
                    }
                    return s
                })
            ])
        }).catch(err => {
            console.error("api request to edit server failed: ", err)
            setErrorDialogue({
                visible: true,
                title: 'Error editing server',
                message: 'Failed to edit server. Details: ' + err.message
            })
        }).finally(() => {
            setServersLoading(false)
        })
    }

    const handleCreateServer = (server) => {
        setActiveView('servers')
        const body = {
            "name": server.name,
            "world": server.world,
            "password": server.password,
            "memory_request": server.memoryRequest,
            "cpu_request": server.cpuRequest,
            "public": server.isPublic,
            "enable_crossplay": server.isCrossplay,
            "modifiers": objToModifier(server),
            "save_interval_seconds": server.saveIntervalSeconds,
            "backup_count": server.backupCount,
            "initial_backup_seconds": server.initialBackupSeconds,
            "backup_interval_seconds": server.backupIntervalSeconds
        };

        setServersLoading(true)
        kubeApi.createServer(body).then((server) => setServers([...servers,  {...server, state: 'scheduling'}])).catch(err => {
            console.error("api request to create server failed: ", err)
            setErrorDialogue({
                visible: true,
                title: 'Error creating server',
                message: 'Failed to create server. Details: ' + err.message
            })
        }).finally(() => {
            setServersLoading(false)
        })
    }

    const handleRestoreBackup = (server, backup) => {
        // Important: This takes the world_backup_auto-{date}.db file from S3, and overwrites the
        // world.db file on the pvc. The next time the server starts for this world it will use the backed up world.
        // It will no longer be possible to retrieve the original world.db file.
        setReplicaBackups([
            ...replicaBackups.map(r => {
                if(r.key === backup.key) {
                    return {
                        ...r,
                        installing: true
                    }
                }
                return r
            })
        ])
        kubeApi.installFile({
            archive: false,
            prefix: backup.key,
            destination: `/root/.config/unity3d/IronGate/Valheim/worlds_local/${server.world_details.world}.db`,
            operation: "copy"
        }).then(res => {
            console.log('restore backup res: ', res)
        }).catch(err => {
            console.error('failed to restore backup: ', err)
            setErrorDialogue({
                visible: true,
                title: 'Error Restoring Backup',
                message: 'Failed to restore backup. Details: ' + err.message
            })
        })
    }

    const handleModToggle = (modId) => {
        const mod = mods.filter(m => m.id === modId)[0]
        const newMods = mods.map(m =>
            m.id === modId ? { ...m, installing: true } : m
        )
        setMods([...newMods]);

        const op = !mod.installed ? "write" : "delete"

        // Prefix in S3 will differ between default mods and user uploaded mods
        const prefix = mod.default ? `mods/general/${mod.name}.zip` : `mods/${user.discordId}/${mod.name}.zip`
        kubeApi.installFile({
            prefix,
            destination: "/valheim/BepInEx/plugins",
            is_archive: true,
            operation: op
        }).then(res => {
            console.log('install mod response: ', res)
        }).catch(err => {
            console.error("failed to install mod: ", err)
            setErrorDialogue({
                visible: true,
                title: 'Error Installing Mod',
                message: 'Failed to install mod. Details: ' + err.message
            })
        })
    };

    const handleServerAction = (server, action) => {
        switch(action) {
            case 'start':
                kubeApi.scaleServer(1).then(() => {
                    updateServerState('scheduling', server.deployment_name)
                }).catch(err => {
                    console.error("failed to scale server: ", err)
                    setErrorDialogue({
                        visible: true,
                        title: 'Error Starting Server',
                        message: 'Failed to start server. Details: ' + err.message
                    })
                })
                return
            case 'stop':
                updateServerState('terminating', server.deployment_name)
                kubeApi.scaleServer(0).catch(err => {
                    console.error("failed to scale server: ", err)
                    setErrorDialogue({
                        visible: true,
                        title: 'Error Stopping Server',
                        message: 'Failed to stop server. Details: ' + err.message
                    })
                })
                return
            case 'delete':
                kubeApi.deleteServer().then(res => {
                    setServers([
                        ...servers.filter(s => !res.resources.includes(s.deployment_name))
                    ])

                    // Ensures no installable worlds or backups show up as options after a user successfully
                    // deletes their server.
                    setPrimaryBackups([
                        ...primaryBackups.map(b => ({ ...b, installed: false, installing: false }))
                    ])
                    setReplicaBackups([
                        ...replicaBackups.map(r => ({...r, installed: false, installing: false }))
                    ])
                }).catch(err => {
                    console.error('failed to delete server: ', err)
                    setErrorDialogue({
                        visible: true,
                        title: 'Error Deleting Server',
                        message: 'Failed to delete server. Details: ' + err.message
                    })
                })
                return
            default:
                console.error("unknown action: ", action)
        }
    }

    const handleBackupAction = (action, backup) => {
        switch (action) {
            case 'install':
                setPrimaryBackups([
                    ...primaryBackups.map(b => b.key === backup.key ? { ...b, installing: true }:b)
                ])
                break
            case 'uninstall':
                setPrimaryBackups([
                    ...primaryBackups.map(b => b.key === backup.key ? { ...b, installing: true }:b)
                ])
                break
            default:
                console.error("unknown backup action: ", action)
        }

        const op = !backup.installed ? "write" : "delete"
        kubeApi.installFile({
            prefix: backup.key,
            destination: "/root/.config/unity3d/IronGate/Valheim/worlds_local",
            is_archive: false,
            operation: op
        }).then(res => {
            console.log('install backup response: ', res)
        }).catch(err => {
            console.error("failed to install backup: ", err)
        })
    }

    const handleConfigFileInstall = async (file) => {
        setConfigs([
            ...configs.map(c => {
                if(c.key === file.key) {
                    return {
                        ...c,
                        installing: true,
                    }
                }
                return c
            })
        ])

        try {
           await kubeApi.installFile({
                archive: false,
                prefix: file.key,
                destination: `/valheim/BepInEx/config`,
                operation: "write"
            })
        } catch (err) {
            setErrorDialogue({
                visible: true,
                title: 'Error Installing Config File',
                message: 'Failed to install config file. Details: ' + err.message
            });
        }
    }

    const renderViews = () => {
        const serverList = <ServersList
            logs={logs}
            metrics={resourceMetrics}
            onAction={(server, state) => handleServerAction(server, state)}
            loading={serversLoading}
            servers={servers}
            onServerCreateButtonClick={() => setActiveView('create-server')}
            onEdit={(s) => {
                setEditedServer(s.world_details)
                setActiveView('edit-server')
            }}
        />
        switch (activeView) {
            case "edit-server":
                return <CreateServer
                    cpuLimit={cpuLimit}
                    memoryLimit={memLimit}
                    onServerCreate={(data) => handleEditServer(data)}
                    existingWorlds={primaryBackups}
                    formValues={{
                        ...editedServer,
                        saveIntervalSeconds: editedServer.save_interval_seconds,
                        initialBackupSeconds: editedServer.initial_backup_seconds,
                        backupIntervalSeconds: editedServer.backup_interval_seconds,
                        backupCount: editedServer.backup_count,
                        isCrossplay: editedServer.enable_crossplay,
                        isPublic: editedServer.public,
                        ...modifierToObject(editedServer.modifiers)
                    }}
                />
            case "create-server":
                return <CreateServer
                    cpuLimit={cpuLimit}
                    memoryLimit={memLimit}
                    onServerCreate={(s) => handleCreateServer(s)}
                    existingWorlds={primaryBackups}
                />
            case "servers":
                return serverList
            case "mods":
                return <ModInstall
                    mods={mods}
                    handleModToggle={(id) => handleModToggle(id)}
                    onUploadComplete={(file) => setMods([...mods, file])}
                />
            case "backups":
                return <BackupsList
                    primaryBackups={primaryBackups}
                    replicaBackups={replicaBackups}
                    servers={servers}
                    onBackupRestore={(server, backup) => handleRestoreBackup(server, backup)}
                    onBackupAction={(action, backup) => handleBackupAction(action, backup)}
                    onUploadComplete={(file) => setPrimaryBackups([...primaryBackups, file])}
                />
            case "configuration":
                return <ConfigViewer
                    configs={configs}
                    onUploadComplete={(file) => {
                        const existingConfig = configs.find(config => config.name === file.name);

                        if (existingConfig) {
                            const updatedConfigs = configs.map(config =>
                                config.name === file.name
                                    ? { ...config, updated: true }
                                    : config
                            );
                            setConfigs(updatedConfigs);
                        } else {
                            setConfigs([...configs, file]);
                        }
                    }}
                    onConfigFileInstall={(file) => handleConfigFileInstall(file)}
                />
            default:
                return serverList
        }
    }

    return (
        <div className="relative min-h-screen flex">
            <div className="lg:hidden fixed top-0 left-0 z-30 m-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <Menu className="h-4 w-4" />
                </Button>
            </div>

            <div className={`
                fixed lg:static 
                inset-y-0 left-0 
                z-20 
                transform lg:transform-none
                transition-transform duration-200 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0
            `}>
                <Sidebar
                    activeView={activeView}
                    onViewChange={(v) => {
                        setActiveView(v);
                        setIsSidebarOpen(false);
                    }}
                />
            </div>

            <main className="flex-1 w-full min-w-0 lg:ml-0">  {/* Added w-full */}
                <div className="pl-16 lg:pl-0">
                    <Navbar
                        onLogout={logout}
                        onBillingSession={() => createBillingSession(user.customerId)}
                        userId={user.discordId}
                        avatarId={user.avatarId}
                    />
                </div>

                {errorDialogue.visible && (
                    <Alert variant="destructive" className="mx-4 mt-16 lg:m-6 max-w-3xl">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{errorDialogue.title}</AlertTitle>
                        <AlertDescription>
                            {errorDialogue.message}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="p-4 lg:p-6">
                    {renderViews()}
                </div>
            </main>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 lg:hidden z-10"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;