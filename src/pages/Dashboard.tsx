// @ts-ignore
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Search, Download, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar.tsx'

const Dashboard = () => {
    // @ts-ignore
    const [activeTab, setActiveTab] = useState('mods');
    const [worldForm, setWorldForm] = useState({
        name: '',
        seed: '',
        password: '',
        crossplayEnabled: false
    });

    // Sample mod data
    const sampleMods = [
        { id: 1, name: 'Better Archery', downloads: '50K+', installed: false },
        { id: 2, name: 'Valheim Plus', downloads: '1M+', installed: true },
        { id: 3, name: 'Epic Loot', downloads: '100K+', installed: false },
        { id: 4, name: 'Plant Everything', downloads: '75K+', installed: false }
    ];

    const [mods, setMods] = useState(sampleMods);

    const handleModToggle = (modId: number) => {
        setMods(mods.map(mod =>
            mod.id === modId ? { ...mod, installed: !mod.installed } : mod
        ));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Navbar onLogout={() => {}} />
            <Tabs defaultValue="mods" className="space-y-6">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="mods">Mod Manager</TabsTrigger>
                    <TabsTrigger value="worlds">World Creator</TabsTrigger>
                </TabsList>

                <TabsContent value="mods" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mod Manager</CardTitle>
                            <CardDescription>Browse and manage your Valheim mods</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative mb-4">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input placeholder="Search mods..." className="pl-8" />
                            </div>
                            <div className="space-y-2">
                                {mods.map(mod => (
                                    <div key={mod.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-medium">{mod.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                <Download className="inline h-4 w-4 mr-1" />
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
                </TabsContent>

                <TabsContent value="worlds">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New World</CardTitle>
                            <CardDescription>Configure your new Valheim world</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="World Name"
                                        value={worldForm.name}
                                        onChange={(e) => setWorldForm({ ...worldForm, name: e.target.value })}
                                    />
                                    <Input
                                        placeholder="World Seed (optional)"
                                        value={worldForm.seed}
                                        onChange={(e) => setWorldForm({ ...worldForm, seed: e.target.value })}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="World Password (optional)"
                                        value={worldForm.password}
                                        onChange={(e) => setWorldForm({ ...worldForm, password: e.target.value })}
                                    />
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Enable Crossplay</label>
                                        <Switch
                                            checked={worldForm.crossplayEnabled}
                                            onCheckedChange={(checked) => setWorldForm({ ...worldForm, crossplayEnabled: checked })}
                                        />
                                    </div>
                                </div>
                                <Button className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create World
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Dashboard;