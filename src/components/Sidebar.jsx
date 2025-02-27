import React from 'react';
import {
    Home,
    PlusCircle,
    Puzzle,
    Globe2, Cog
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import HearthHubLogo from "@/assets/hearthhub_logo.png";
import {Skeleton} from "@/components/ui/skeleton";

const Sidebar = ({ activeView, onViewChange, skeleton }) => {
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
        },
        {
            icon: <Cog />,
            label: 'Configuration',
            view: 'configuration'
        }
    ];

    if(skeleton) {
        return <div className="w-80 bg-gray-300 text-secondary-foreground border-r p-4 h-screen flex flex-col drop-shadow-md border-0">
            <div className="flex items-center mb-8">
            </div>
            <nav className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </nav>
            <nav className="space-y-2 mt-4">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </nav>
            <div className="mt-auto text-center pb-4">
                <span>v0.0.1</span>
            </div>
        </div>
    }

    return (
        <div className="w-80 bg-gray-300 text-secondary-foreground border-r p-4 h-screen flex flex-col drop-shadow-md border-0">
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
                        className={activeView === item.view ? "w-full justify-start bg-primary text-white hover:bg-primary border-0 focus:outline-none focus:border-none" : "w-full justify-start bg-gray-300 hover:border-1 hover:border-gray-200"}
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