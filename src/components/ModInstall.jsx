import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {Search, Download, LoaderCircle} from 'lucide-react';
import {Badge} from "@/components/ui/badge";



const ModInstall = ({mods, handleModToggle}) => {

    const getBadgeClass = (mod) => {
        if(mod.installing) {
            return "bg-blue-200 my-2 text-blue-800 text-md hover:bg-blue-300"
        }

        if(mod.installed) {
            return "bg-green-100 my-2 text-green-800 text-md hover:bg-green-200"
        }

        // Not yet installed.
        return "bg-red-100 my-2 text-red-800 text-md hover:bg-red-200"
    }

    const getBadgeName = (mod) => {
        if(mod.installing) {
            return "Installing"
        }

        if(mod.installed) {
            return "Installed"
        }

        return "Not Installed"
    }

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
                    {mods.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-medium">{m.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={getBadgeClass(m)}
                                    >
                                        {getBadgeName(m) === "Installing" ? <div className="flex item-center justify-between"><span className="px-2">Installing</span> <LoaderCircle className="animate-spin" /></div> : getBadgeName(m)}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-500">
                                    <Download className="inline h-4 w-4 mr-1"/>
                                    {m.size}
                                </p>
                            </div>
                            <Switch
                                checked={m.installed}
                                onCheckedChange={() => handleModToggle(m.id)}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default ModInstall