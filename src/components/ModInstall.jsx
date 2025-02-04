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



const ModInstall = ({mods, handleModToggle}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mod Manager</CardTitle>
                <CardDescription>Browse and manage your Valheim mods</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative mb-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500"/>
                    <Input placeholder="Search mods..." className="pl-8"/>
                </div>
                <div className="space-y-2">
                    {mods.map(mod => (
                        <div key={mod.id}
                             className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-medium">{mod.name}</h3>
                                <p className="text-sm text-gray-500">
                                    <Download className="inline h-4 w-4 mr-1"/>
                                    {mod.downloads} downloads
                                </p>
                            </div>
                            <Switch
                                checked={mod.installed}
                                onCheckedChange={() => handleModToggle(mod.id)}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default ModInstall