import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {Search, Download, LoaderCircle} from 'lucide-react';
import {Badge} from "@/components/ui/badge";
import ModUpload from "@/components/ModUpload";


const ModInstall = ({mods, handleModToggle, onUploadComplete }) => {
    const [shownMods, setShownMods] = useState(mods)

    const onSearch = (val) => {
        if(val.length === 0) {
            setShownMods(mods)
            return
        }

        setShownMods(mods.filter(m => m.name.toLowerCase().includes(val.toLowerCase())))
    }

    useEffect(() => {
        setShownMods(mods)
    }, [mods])

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
        <div className="w-full max-w-2xl m-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Mod Manager</CardTitle>
                    <CardDescription>Browse and manage your Valheim mods</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative mb-4">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500"/>
                        <Input placeholder="Search mods..." className="pl-8" onChange={(e) => onSearch(e.target.value)} />
                    </div>
                    <div className="space-y-2 max-h-[705px] overflow-y-scroll no-scrollbar">
                        {shownMods.map(m => (
                            <div key={`${m.name}_${m.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    {/* TODO it would be nice to have images for the mods in the future */}
                                    <h3 className="text-lg">{m.name}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge
                                            variant="secondary"
                                            className={getBadgeClass(m)}
                                        >
                                            {getBadgeName(m) === "Installing" ? <div className="flex item-center justify-between"><span className="px-2">{m.installed ? 'Uninstalling' : 'Installing'}</span> <LoaderCircle className="animate-spin" /></div> : getBadgeName(m)}
                                        </Badge>
                                        {
                                            m.default ? <Badge className="bg-green-100 my-2 text-green-800 text-md hover:bg-green-200">Default Mod</Badge> : <Badge variant="secondary" className="bg-yellow-100 my-2 text-yellow-800 text-md hover:bg-yellow-200">Custom Mod</Badge>
                                        }
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
            <ModUpload onUploadComplete={(f) => onUploadComplete(f)} />
        </div>
    )
}

export default ModInstall