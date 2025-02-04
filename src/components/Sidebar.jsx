import React from 'react';
import {
    Home,
    PlusCircle,
    HardDrive,
    Puzzle
} from 'lucide-react';
import { Button } from "@/components/ui/button";

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
            icon: <HardDrive />,
            label: 'Backups',
            view: 'backups'
        }
    ];

    return (
        <div className="w-64 bg-gray-200 text-secondary-foreground border-r p-4">
            <h1 className="text-2xl font-bold mb-8">Navigation</h1>
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <Button
                        key={item.view}
                        variant={activeView === item.view ? "default" : "ghost"}
                        className={activeView === item.view ? "w-full justify-start" : "w-full justify-start bg-gray-200"}
                        onClick={() => onViewChange(item.view)}
                    >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </Button>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar