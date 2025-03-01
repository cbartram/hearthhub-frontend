import React from 'react';
import {
    Home,
    PlusCircle,
    Puzzle,
    Globe2,
    Cog
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import HearthHubLogo from "@/assets/hearthhub_logo.png";
import { Skeleton } from "@/components/ui/skeleton";

const Sidebar = ({ activeView, onViewChange, skeleton }) => {
    const navItems = [
        {
            icon: <Home size={18} />,
            label: 'Servers',
            view: 'servers'
        },
        {
            icon: <PlusCircle size={18} />,
            label: 'Create Server',
            view: 'create-server'
        },
        {
            icon: <Puzzle size={18} />,
            label: 'Mods',
            view: 'mods'
        },
        {
            icon: <Globe2 size={18} />,
            label: 'Worlds',
            view: 'backups'
        },
        {
            icon: <Cog size={18} />,
            label: 'Configuration',
            view: 'configuration'
        }
    ];

    if(skeleton) {
        return (
            <div className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col">
                <div className="p-6">
                    <Skeleton className="h-8 w-32 mb-8" />
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                </div>
                <div className="mt-auto p-6">
                    <Skeleton className="h-4 w-16 mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-64 bg-white h-screen flex flex-col shadow-sm">
            <div className="p-6 mt-16 lg:mt-0">
                <div className="flex items-center mb-8">
                    <div className="w-10 h-10 flex items-center justify-center mr-3 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg shadow-md">
                        <img src={HearthHubLogo} alt="HearthHub" className="w-8 h-8" />
                    </div>
                    <h1 className="font-semibold text-lg text-gray-800">HearthHub</h1>
                </div>

                <div className="space-y-1">
                    {navItems.map((item) => (
                        <Button
                            key={item.view}
                            variant="ghost"
                            className={`bg-white w-full justify-start rounded-lg py-2 px-3 transition-all duration-200 outline-none border-0 focus:outline-none focus:ring-0 ${
                                activeView === item.view
                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-100 bg-white"
                            }`}
                            onClick={() => onViewChange(item.view)}
                        >
                            <span className={`${activeView === item.view ? "text-blue-600" : "text-gray-400"}`}>
                                {item.icon}
                            </span>
                            <span className="ml-3 text-sm">{item.label}</span>
                        </Button>
                    ))}
                </div>
            </div>

            <div className="mt-auto border-t border-gray-100 p-4">
                <span className="text-xs text-gray-400 flex justify-center">v0.0.1</span>
            </div>
        </div>
    );
};

export default Sidebar;