import React, { useState, useEffect } from 'react';
import {useAuth} from '@/context/AuthContext.jsx'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import CreateServer from '@/components/CreateServer'
import ServersList from "@/components/ServersList.jsx";
import ModInstall from "@/components/ModInstall";
import Backups from "@/components/Backups";
import {KubeApiClient, HearthHubApiClient} from "@/lib/api.js";
import {formatBytes} from "@/lib/utils.ts";

const DEFAULT_MODS = ["ValheimPlus", "ValheimPlus_Grant", "DisplayBepInExInfo", "BetterArchery", "BetterUI", "PlantEverything", "EquipmentAndQuickSlots"]

const Dashboard = () => {
    const {user, logout} = useAuth()
    const kubeApi = new KubeApiClient(user);
    const hearthhubApi = new HearthHubApiClient(user)

    const [activeView, setActiveView] = useState('servers');
    const [serversLoading, setServersLoading] = useState(true)
    const [servers, setServers] = useState([])
    const [mods, setMods] = useState([]);

    useEffect(() => {
       kubeApi.getServer().then(server => {
           if(!server.hasOwnProperty('message')) {
               setServers([...servers, server])
           }
       }).catch((err) => {
           console.error('failed to load servers: ', err)
       }).finally(() => {
           setServersLoading(false)
       })

       hearthhubApi.listFiles("mods").then(res => {
           if(res.hasOwnProperty("files")) {
               const m = res.files.map((file, i) => {
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

                   for (const userInstalledMod in user.installedMods) {
                       if(userInstalledMod.name === filename) {
                           remappedMod.installed = true
                       }
                   }

                   return remappedMod
               })
               setMods([...m])
           }
       }).catch(err => {
           console.error("failed to list mods: ", err)
       })
    }, [])

    useEffect(() => {
        // TODO something about hearthhub.duckdns.org is causing issues here.
        const ws = new WebSocket(`http://71.77.136.117/ws?id=${user.discordId}`);

        ws.addEventListener('message', (event) => {
            console.log("Servers within websocket handler: ", servers)

            const message = JSON.parse(event.data)
            console.log('received ws message:', message);
            const content = JSON.parse(message.content)

            switch(message.type) {
                case "PostStart":
                    // Update the servers state to "loading"
                    updateServerState('loading', content.containerName)
                    break
                case "ContainerReady":
                    if(content.containerType === "server") {
                        // Update the servers state to "running"
                        updateServerState('running', content.containerName)
                    }
                    break
                case "PreStop":
                    if(content.containerType === "file-install") {
                        setMods([...mods.map(m => {
                            if(m.installing) {
                                return {
                                    ...m,
                                    installing: false,
                                    installed: content.operation
                                }
                            }
                            return m
                        })])
                    } else if (content.containerType === "server") {
                        // Update the servers state to "stopped"
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
    }, [servers]);

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

    // TODO Make API request to install the mod or uninstall the mod and update state till
    // the websocket notifies the operation completed!
    const handleModToggle = (modId) => {
        const mod = mods.filter(m => m.id === modId)[0]
        const newMods = mods.map(m =>
            m.id === modId ? { ...m, installing: true } : m
        )
        setMods([...newMods]);

        // Prefix in S3 will differ between default mods and user uploaded mods
        const prefix = mod.default ? `mods/default/${mod.name}.zip` : `mods/${user.discordId}/${mod.name}.zip`
        kubeApi.installFile({
            prefix,
            destination: "/valheim/BepInEx/plugins",
            is_archive: true,
            operation: "write"
        }).then(res => {
            console.log('install mod response: ', res)
        }).catch(err => {
            console.error("failed to install mod: ", err)
        })
    };

    const renderViews = () => {
        const serverList = <ServersList loading={serversLoading} servers={servers} onServerCreateButtonClick={() => setActiveView('create-server')} />
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
                return <Backups />
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