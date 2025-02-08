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

const Dashboard = () => {
    const {user, logout} = useAuth()
    const kubeApi = new KubeApiClient(user);
    const hearthhubApi = new HearthHubApiClient(user)

    const [activeView, setActiveView] = useState('servers');
    const [serversLoading, setServersLoading] = useState(true)
    const [servers, setServers] = useState([])
    const [mods, setMods] = useState([]);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

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

                   return {
                       id: i,
                       name: filename,
                       size: formatBytes(file.fileSize),
                       installed: false,
                       installing: false,
                   }
               })
               console.log('loaded user defined mods: ', m)
               setMods([...mods, ...m])
           }
       }).catch(err => {
           console.error("failed to list mods: ", err)
       })

    }, [])

    useEffect(() => {
        // TODO something about hearthhub.duckdns.org is causing issues here.
        const ws = new WebSocket(`http://71.77.136.117/ws?id=${user.discordId}`);

        ws.addEventListener('open', () => {
            console.log('websockets connected');
        });

        ws.addEventListener('message', (event) => {
            const message = event.data;
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log('received message:', message);
        });

        ws.addEventListener('error', (event) => {
            console.error('websocket error:', event);
        });

        ws.addEventListener('close', () => {
            console.log('websocket disconnected');
        });

        setSocket(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const handleCreateServer = (server) => {
        setActiveView('servers')
        const specificKeys = ['combat', 'deathpenalty', 'resources', 'raids', 'portals'];
        const modifiers = [];

        for (const key of specificKeys) {
            if (server[key] !== 'standard') {
                modifiers.push({ key, value: server[key] });
            }
        }

        const body = JSON.stringify({
            "name": server.name,
            "world": server.world,
            "password": server.password,
            "public": server.isPublic,
            "enable_crossplay": server.isCrossplay,
            "modifiers": modifiers,
            "save_interval_seconds": server.save_interval_seconds,
            "backup_count": server.backupCount,
            "initial_backup_seconds": server.initialBackupSeconds,
            "backup_interval_seconds": server.backupIntervalSeconds
        });

        apiClient.createServer(body).then((server) => setServers([...servers, server])).catch(err => {
            console.error("api request to create server failed: ", err)
        })
    }

    // TODO Make API request to install the mod or uninstall the mod and update state till
    // the websocket notifies the operation completed!
    const handleModToggle = (modId) => {
        setMods(mods.map(mod =>
            mod.id === modId ? { ...mod, installed: !mod.installed } : mod
        ));

    };

    const renderViews = () => {
        const serverList = <ServersList loading={serversLoading} servers={servers} onServerCreateButtonClick={() => setActiveView('create-server')} />
        switch (activeView) {
            case "create-server":
                return <CreateServer onServerCreate={(s) => handleCreateServer(s)} />
            case "servers":
                return serverList
            case "mods":
                console.log("mods: ", mods)
                return <ModInstall mods={mods} handleModToggle={(id) => handleModToggle(id)} />
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