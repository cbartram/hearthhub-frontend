import React, { useState, useEffect } from 'react';
import {useAuth} from '@/context/AuthContext.jsx'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import CreateServer from '@/components/CreateServer'
import ServersList from "@/components/ServersList.jsx";
import ModInstall from "@/components/ModInstall";
import {KubeApiClient, HearthHubApiClient} from "@/lib/api.js";
import {formatBytes} from "@/lib/utils.ts";
import BackupsList from "@/components/BackupsList";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";

const DEFAULT_MODS = ["ValheimPlus", "ValheimPlus_Grant", "DisplayBepInExInfo", "BetterArchery", "BetterUI", "PlantEverything", "EquipmentAndQuickSlots"]

const Dashboard = () => {
    const {user, logout} = useAuth()
    const kubeApi = new KubeApiClient(user);
    const hearthhubApi = new HearthHubApiClient(user)

    const [activeView, setActiveView] = useState('servers');
    const [serversLoading, setServersLoading] = useState(true)
    const [servers, setServers] = useState([])
    const [mods, setMods] = useState([]);
    const [primaryBackups, setPrimaryBackups] = useState([])
    const [replicaBackups, setReplicaBackups] = useState([])
    const [editedServer, setEditedServer] = useState({})
    const [errorDialogue, setErrorDialogue] = useState({
        visible: false,
        title: '',
        message: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [server, mods] = await Promise.all([
                    kubeApi.getServer()
                        .then(server => !server.hasOwnProperty('message') ? server : null)
                        .catch(err => {
                            console.error('failed to load servers: ', err);
                            setErrorDialogue({
                                visible: true,
                                title: 'Error retrieving servers',
                                message: 'Failed to retrieve servers. Details: ' + err.message
                            })
                            return []
                        }),

                    hearthhubApi.listFiles("mods")
                        .then(res => {
                            if (res.hasOwnProperty("files")) {
                                return res.files.map((file, i) => {
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

                                    for (const userInstalledMod of user.installedMods) {
                                        if (userInstalledMod.name.slice(0, -4) === filename) {
                                            remappedMod.installed = userInstalledMod.installed
                                        }
                                    }

                                    return remappedMod;
                                });
                            }
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

                    hearthhubApi.listFiles("backups").then(res => {
                        const backups = []
                        const replicas = []
                        const backupKeys = {}
                        for(const file of res.files) {
                            backupKeys[file.key] = ""
                        }

                        // Note: we only push .db files, .fwl files are stored and synced along with db's on the backend
                        // however, as to not confuse users and avoid any file name issues when merging user state in cognito
                        // we only present .db files for install to users.
                        for(const file of res.files) {
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
                            for (const userBackup of user.installedBackups) {
                                let shortName = b.key.slice(b.key.lastIndexOf("/") + 1, b.key.length)
                                if (userBackup.name === shortName) {
                                    return {
                                        ...b,
                                        installing: false,
                                        installed: userBackup.installed
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
                            for (const userBackup of user.installedBackups) {
                                let shortName = b.key.slice(b.key.lastIndexOf("/") + 1, b.key.length)
                                if (userBackup.name === shortName) {
                                    return {
                                        ...b,
                                        installing: false,
                                        installed: userBackup.installed
                                    }
                                }
                            }

                            return {
                                ...b,
                                installing: false,
                                installed: false
                            }
                        }))
                    }).catch(err => {
                        console.error("error fetching backups: ", err)
                        setErrorDialogue({
                            visible: true,
                            title: 'Error retrieving backups',
                            message: 'Failed to retrieve backup files. Details: ' + err.message
                        })
                    })
                ]);

                if (server) {
                    setServers([server]);
                }

                if (mods.length > 0) {
                    setMods([...mods]);
                }
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

    useEffect(() => {
        // TODO something about hearthhub.duckdns.org is causing issues here.
        const ws = new WebSocket(`http://71.77.136.117/ws?id=${user.discordId}`);

        ws.addEventListener('message', (event) => {
            const message = JSON.parse(event.data)
            console.log('received ws message:', message);
            const content = JSON.parse(message.content)

            switch(message.type) {
                case "PostStart":
                    updateServerState('loading', content.containerName)
                    break
                case "ContainerReady":
                    if(content.containerType === "server") {
                        updateServerState('running', content.containerName)
                    }
                    break
                case "PreStop":
                    if(content.containerType === "file-install") {
                        setMods([
                            ...mods.map(m => {
                                // We don't have a way to tie the mod state in react to the k8s job
                                // which installed the mod so clicking to install 3 mods at once when 1
                                // websocket event comes in all 3 mods will have their state updated at once.
                                if(m.installing) {
                                    return {
                                        ...m,
                                        installing: false,
                                        installed: content.operation === "write"
                                    }
                                }
                                return m
                            })
                        ])

                        setPrimaryBackups([
                            ...primaryBackups.map(b => {
                                if(b.installing) {
                                    return {
                                        ...b,
                                        installing: false,
                                        installed: content.operation === "write"
                                    }
                                }
                                return b
                            })
                        ])

                        setReplicaBackups([
                            ...replicaBackups.map(r => {
                                if(r.installing) {
                                    return {
                                        ...r,
                                        installing: false
                                    }
                                }
                                return r
                            })
                        ])
                    } else if (content.containerType === "server") {
                        updateServerState('stopped', content.containerName)
                    }
                    break
                default:
                    console.log(`unknown message type: ${message.type} content = ${message.content}`)
            }
        });

        ws.addEventListener('error', (event) => {
            console.error('websocket error:', event);
            setErrorDialogue({
                visible: true,
                title: 'Error receiving event',
                message: `Failed to receive websocket event. Details: ${event}`
            })
        });

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [servers, mods, primaryBackups]);

    const updateServerState = (state, containerName) => {
        setServers([
            ...servers.map(s => {
                if(s.deployment_name === containerName) {
                    return {
                        ...s,
                        state
                    }
                }
                return s
            })
        ])
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

    const renderViews = () => {
        const serverList = <ServersList
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
                return <CreateServer onServerCreate={(s) => handleCreateServer(s)} existingWorlds={primaryBackups} />
            case "servers":
                return serverList
            case "mods":
                return <ModInstall
                    mods={mods}
                    handleModToggle={(id) => handleModToggle(id)}
                />
            case "backups":
                return <BackupsList
                    primaryBackups={primaryBackups}
                    replicaBackups={replicaBackups}
                    servers={servers}
                    onBackupRestore={(server, backup) => handleRestoreBackup(server, backup)}
                    onBackupAction={(action, backup) => handleBackupAction(action, backup)}
                />
            default:
                return serverList
        }
    }

    return (
        <div>
            <Navbar onLogout={logout} userId={user.discordId} avatarId={user.avatarId}/>
            <div className="flex h-screen">
                <Sidebar activeView={activeView} onViewChange={(v) => setActiveView(v)} />
                <div className="flex-1 p-6 min-w-24">
                    {
                        errorDialogue.visible && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>{errorDialogue.title}</AlertTitle>
                                <AlertDescription>
                                    {errorDialogue.message}
                                </AlertDescription>
                            </Alert>
                        )
                    }
                    {renderViews()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;