import React, { useState, useEffect } from 'react';
import {useAuth} from '@/context/AuthContext.jsx'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import CreateServer from '@/components/CreateServer'
import ServersList from "@/components/ServersList.jsx";
import ModInstall from "@/components/ModInstall";
import Backups from "@/components/Backups";
import {K8S_BASE_URL} from "@/lib/constants.ts";

const Dashboard = () => {
    const {user, logout} = useAuth()
    const [activeView, setActiveView] = useState('servers');
    const [servers, setServers] = useState([
        {
            "server_ip": "71.77.136.117",
            "server_port": 2456,
            "world_details": {
                "name": "my-server",
                "world": "midgard",
                "port": "2456",
                "password": "password1234",
                "enable_crossplay": true,
                "public": false,
                "instance_id": "",
                "modifiers": [
                    {
                        "key": "combat",
                        "value": "easy"
                    },
                    {
                        "key": "deathpenalty",
                        "value": "veryeasy"
                    },
                    {
                        "key": "resources",
                        "value": "muchmore"
                    },
                    {
                        "key": "portals",
                        "value": "casual"
                    }
                ],
                "save_interval_seconds": 1800,
                "backup_count": 3,
                "initial_backup_seconds": 7200,
                "backup_interval_seconds": 43200
            },
            "mod_pvc_name": "valheim-pvc",
            "deployment_name": "valheim",
            "state": "running"
        }
    ])
    // Sample mod data
    const sampleMods = [
        { id: 1, name: 'Better Archery', downloads: '50K+', installed: false },
        { id: 2, name: 'Valheim Plus', downloads: '1M+', installed: true },
        { id: 3, name: 'Epic Loot', downloads: '100K+', installed: false },
        { id: 4, name: 'Plant Everything', downloads: '75K+', installed: false }
    ];
    const [mods, setMods] = useState(sampleMods);

    const handleModToggle = (modId) => {
        setMods(mods.map(mod =>
            mod.id === modId ? { ...mod, installed: !mod.installed } : mod
        ));
    };

    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

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

        const headers = new Headers();
        headers.append("Authorization", `Basic ${btoa(user.discordId + ":" + user.credentials.refresh_token)}`)
        headers.append("Content-Type", "application/json");

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

        fetch(`${K8S_BASE_URL}/api/v1/server/create`, {
            method: "POST",
            headers,
            body,
            redirect: "follow"
        }).then((response) => response.json())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

        setServers([...servers, server])
    }

    const renderViews = () => {
        const serverList = <ServersList servers={servers} onServerCreateButtonClick={() => setActiveView('create-server')} />
        switch (activeView) {
            case "create-server":
                return <CreateServer onServerCreate={(s) => handleCreateServer(s)} />
            case "servers":
                return serverList
            case "mods":
                return <ModInstall mods={mods} handleModToggle={() => console.log("toggling")} />
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