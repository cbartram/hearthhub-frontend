import React, { useState, useEffect } from 'react';
import {useAuth} from '@/context/AuthContext.jsx'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import CreateServer from '@/components/CreateServer'
import ServersList from "@/components/ServersList.jsx";
import ModInstall from "@/components/ModInstall";
import {KubeApiClient, HearthHubApiClient} from "@/lib/api.js";
import {formatBytes} from "@/lib/utils.ts";
import BackupsList from "@/BackupsList";

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [server, mods] = await Promise.all([
                    kubeApi.getServer()
                        .then(server => !server.hasOwnProperty('message') ? server : null)
                        .catch(err => {
                            console.error('failed to load servers: ', err);
                            return null;
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
                            return [];
                        }),

                    hearthhubApi.listFiles("backups").then(res => {
                        const backups = []
                        const replicas = []
                        const backupKeys = {}
                        for(const file of res.files) {
                            backupKeys[file.key] = ""
                        }

                        for(const file of res.files) {
                            let ext = file.key.slice(file.key.lastIndexOf(".") + 1, file.key.length)
                            let base = file.key.slice(0, file.key.lastIndexOf("."))
                            if(file.key.includes("_backup_auto-") && ext === "db") {
                                if(backupKeys.hasOwnProperty(`${base}.fwl`)) {
                                    replicas.push(file)
                                } else {
                                    console.log(`replica: ${file.key} does not have corresponding .fwl`)
                                }
                            } else if(file.key.includes("_backup_auto-") && ext === "fwl") {
                                if(backupKeys.hasOwnProperty(`${base}.db`)) {
                                    replicas.push(file)
                                } else {
                                    console.log(`replica: ${file.key} does not have corresponding .db file`)
                                }
                            } else {
                                backups.push(file)
                            }
                        }

                        setPrimaryBackups(backups)
                        setReplicaBackups(replicas)
                    }).catch(err => console.error("error fetching backups: ", err))
                ]);

                if (server) {
                    setServers([...servers, server]);
                }

                if (mods.length > 0) {
                    setMods([...mods]);
                }
            } catch (err) {
                console.error("Error fetching data: ", err);
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
        });

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [servers, mods]);

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

    const handleCreateServer = (server) => {
        setActiveView('servers')
        const specificKeys = ['combat', 'deathpenalty', 'resources', 'raids', 'portals'];
        const modifiers = [];

        for (const key of specificKeys) {
            if (server[key] !== 'standard') {
                modifiers.push({ key, value: server[key] });
            }
        }

        const body = {
            "name": server.name,
            "world": server.world,
            "password": server.password,
            "public": server.isPublic,
            "enable_crossplay": server.isCrossplay,
            "modifiers": modifiers,
            "save_interval_seconds": server.saveIntervalSeconds,
            "backup_count": server.backupCount,
            "initial_backup_seconds": server.initialBackupSeconds,
            "backup_interval_seconds": server.backupIntervalSeconds
        };

        kubeApi.createServer(body).then((server) => setServers([...servers,  {...server, state: 'scheduling'}])).catch(err => {
            console.error("api request to create server failed: ", err)
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
        })
    };

    const handleServerAction = (server, action) => {
        switch(action) {
            case 'start':
                kubeApi.scaleServer(1).then(() => {
                    updateServerState('scheduling', server.deployment_name)
                }).catch(err => {
                    console.error("failed to scale server: ", err)
                })
                return
            case 'stop':
                kubeApi.scaleServer(0).then(() => {
                    updateServerState('terminating', server.deployment_name)
                }).catch(err => {
                    console.error("failed to scale server: ", err)
                })
                return
            case 'delete':
                kubeApi.deleteServer().then(res => {
                    setServers([
                        ...servers.filter(s => !res.resources.includes(s.deployment_name))
                    ])
                }).catch(err => {
                    console.error('failed to delete server: ', err)
                })
                return
            default:
                console.error("unknown action: ", action)
        }
    }

    const renderViews = () => {
        const serverList = <ServersList
            onAction={(server, state) => handleServerAction(server, state)}
            loading={serversLoading}
            servers={servers}
            onServerCreateButtonClick={() => setActiveView('create-server')}
        />
        switch (activeView) {
            case "create-server":
                return <CreateServer onServerCreate={(s) => handleCreateServer(s)} />
            case "servers":
                return serverList
            case "mods":
                return <ModInstall
                    mods={mods}
                    handleModToggle={(id) => handleModToggle(id)}
                />
            case "backups":
                return <BackupsList primaryBackups={primaryBackups} replicaBackups={replicaBackups} />
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
                    {renderViews()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;