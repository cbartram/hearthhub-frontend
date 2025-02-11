import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import {Skeleton} from "@/components/ui/skeleton";


const Navbar = ({ onLogout, userId, avatarId, skeleton }) => {

    if(skeleton) {
        return (
            <div className="bg-slate-700 text-white p-4 bg-gradient-to-r from-slate-700 to-slate-800 opacity-95 drop-shadow-lg">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <nav className="flex space-x-4">

                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                            <Skeleton className="h-12 w-12 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-[50px]" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-slate-700 text-white p-4 bg-gradient-to-r from-slate-700 to-slate-800 opacity-95 drop-shadow-lg">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <nav className="flex space-x-4">

                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                        <img alt="user profile avatar"
                             src={`https://cdn.discordapp.com/avatars/${userId}/${avatarId}?size=56`}
                             className="w-10 h-10 rounded-full border-2 border-gray-800"/>
                    </div>
                    <Button className="text-white hover:text-slate-200 hover:border-1 hover:border-slate-900"
                            onClick={onLogout}>
                        <LogOut className="h-4 w-4 mr-2"/>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Navbar