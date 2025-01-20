import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Package, LogOut } from 'lucide-react';


const Navbar = ({ onLogout, userId, avatarId }) => (
    <div className="bg-slate-800 text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <span className="font-bold text-xl">Valheim Manager</span>
                <nav className="flex space-x-4">
                    <Button variant="ghost" className="text-white hover:text-slate-200">
                        <Home className="h-4 w-4 mr-2" />
                        Home
                    </Button>
                    <Button variant="ghost" className="text-white hover:text-slate-200">
                        <Package className="h-4 w-4 mr-2" />
                        Mods
                    </Button>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                    <img alt="user profile avatar" src={`https://cdn.discordapp.com/avatars/${userId}/${avatarId}?size=48`} className="w-8 h-8 rounded-full" />
                </div>
                <Button variant="ghost" className="text-white hover:text-slate-200" onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    </div>
);

export default Navbar