import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const CreateServer = () => {
    const [formData, setFormData] = useState({
        name: '',
        worldName: '',
        password: '',
        isCrossplay: false,
        isPublic: false,
        difficulty: 'normal',
        resourceMultiplier: 1,
        enemyDifficulty: 'normal'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newServer = {
            id: Date.now().toString(),
            ...formData,
            isRunning: false
        };
        setServers([...servers, newServer]);
    };

    return (
        <div className="p-2">
            <h2 className="text-2xl font-bold mb-6">Create a Server</h2>
            <div className="text-center p-12 border rounded">
                <Card className="w-full max-w-2xl mx-auto mt-8">
                    <CardHeader>
                        <CardTitle>Create New Valheim Server</CardTitle>
                        <CardDescription>Configure your dedicated Valheim server settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Server Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="My Epic Viking Server"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>World Name</Label>
                                    <Input
                                        value={formData.worldName}
                                        onChange={(e) => setFormData({...formData, worldName: e.target.value})}
                                        placeholder="Midgard Realm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="Server access password"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={formData.isCrossplay}
                                        onCheckedChange={(checked) => setFormData({...formData, isCrossplay: checked})}
                                    />
                                    <Label>Enable Crossplay</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={formData.isPublic}
                                        onCheckedChange={(checked) => setFormData({...formData, isPublic: checked})}
                                    />
                                    <Label>Public Server</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select
                                    value={formData.difficulty}
                                    onValueChange={(value) => setFormData({...formData, difficulty: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="peaceful">Peaceful</SelectItem>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Create Server</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateServer