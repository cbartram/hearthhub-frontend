import React, { useState, useEffect } from 'react';
import {useAuth} from '@/context/AuthContext.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {Search, Download, Plus} from 'lucide-react';
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import CreateServer from '@/components/CreateServer'
import ServersList from "@/components/ServersList.jsx";
import ModInstall from "@/components/ModInstall";
import Backups from "@/components/Backups";

const Dashboard = () => {
    const {user, logout} = useAuth()

    const [activeView, setActiveView] = useState('servers');
    const [servers, setServers] = useState([
        {
            id: "foo",
            name: "RuneWraiths Server",
            worldName: "RuneWraiths World 3",
            isRunning: true,
            isPublic: true,
            isCrossplay: true,
            difficulty: "hard"
        },
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

    const renderViews = () => {
        const serverList = <ServersList servers={servers} onServerCreateButtonClick={() => setActiveView('create-server')} />
        switch (activeView) {
            case "create-server":
                return <CreateServer />
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