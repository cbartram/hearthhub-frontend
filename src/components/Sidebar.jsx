import React from 'react';
import {
    Home,
    PlusCircle,
    Puzzle,
    Globe2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import HearthHubLogo from "@/assets/hearthhub_logo.png";

const Sidebar = ({ activeView, onViewChange }) => {
    const navItems = [
        {
            icon: <Home />,
            label: 'Servers',
            view: 'servers'
        },
        {
            icon: <PlusCircle />,
            label: 'Create Server',
            view: 'create-server'
        },
        {
            icon: <Puzzle />,
            label: 'Mods',
            view: 'mods'
        },
        {
            icon: <Globe2 />,
            label: 'Worlds',
            view: 'backups'
        }
    ];

    return (
        <div className="w-80 bg-gray-200 text-secondary-foreground border-r p-4 h-screen flex flex-col">
            <div className="flex items-center mb-8">
        <span className="w-24 h-24 rounded-full">
            <img src={HearthHubLogo} alt="hearthub-logo" width={100} height={100} />
        </span>
                <h1 className="font-bold text-2xl align-middle">HearthHub</h1>
            </div>
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <Button
                        key={item.view}
                        variant={activeView === item.view ? "default" : "ghost"}
                        className={activeView === item.view ? "w-full justify-start bg-slate-400 text-gray-800 hover:bg-slate-600 border-0 focus:outline-none focus:border-none" : "w-full justify-start bg-gray-200"}
                        onClick={() => onViewChange(item.view)}
                    >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </Button>
                ))}
            </nav>
            <div className="mt-auto text-center pb-4">
                <span>v0.0.1</span>
            </div>
        </div>
    );
};

export default Sidebar