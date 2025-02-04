import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
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

const CreateServer = ({ onServerCreate }) => {
    const [formData, setFormData] = useState({
        name: '',
        world: '',
        password: '',
        isCrossplay: false,
        isPublic: false,

        // Modifiers
        difficulty: '',
        deathPenalty: '',
        resources: '',
        raids: '',
        portals: '',

        // Advanced
        saveIntervalSeconds: 1800,
        backupCount: 3,
        initialBackupSeconds: 7200,
        backupIntervalSeconds: 43200,
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        onServerCreate({ ...formData })
    };

    return (
        <div className="p-0">
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
                                    placeholder="My Viking Server"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>World Name</Label>
                                <Input
                                    value={formData.world}
                                    onChange={(e) => setFormData({...formData, world: e.target.value})}
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

                        <Collapsible className="w-full">
                            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 bg-gray-200">
                                <span className="text-primary font-semibold">Optional Modifiers</span>
                                <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <hr className="my-2" />
                                <div className="space-y-2">
                                    <Label>Combat Difficulty</Label>
                                    <Select
                                        value={formData.difficulty}
                                        onValueChange={(value) => setFormData({...formData, difficulty: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="veryeasy">Very Easy</SelectItem>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                            <SelectItem value="veryhard">Very Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Label>Death Penalty</Label>
                                    <Select
                                        value={formData.deathPenalty}
                                        onValueChange={(value) => setFormData({...formData, deathPenalty: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Death Penalty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="casual">Casual</SelectItem>
                                            <SelectItem value="veryeasy">Very Easy</SelectItem>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                            <SelectItem value="hardcore">Hardcore</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Label>Resources</Label>
                                    <Select
                                        value={formData.resources}
                                        onValueChange={(value) => setFormData({...formData, resources: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Resources" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="muchless">Much Less</SelectItem>
                                            <SelectItem value="less">Less</SelectItem>
                                            <SelectItem value="more">More</SelectItem>
                                            <SelectItem value="muchmore">Much More</SelectItem>
                                            <SelectItem value="most">Most</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Label>Raids</Label>
                                    <Select
                                        value={formData.raids}
                                        onValueChange={(value) => setFormData({...formData, raids: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Raid Frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            <SelectItem value="muchless">Much Less</SelectItem>
                                            <SelectItem value="less">Less</SelectItem>
                                            <SelectItem value="more">More</SelectItem>
                                            <SelectItem value="muchmore">Much More</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Label>Portals</Label>
                                    <Select
                                        value={formData.portals}
                                        onValueChange={(value) => setFormData({...formData, portals: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Portal Functionality" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="casual">Casual</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                            <SelectItem value="veryhard">Very Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <Collapsible className="w-full">
                            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 bg-gray-200">
                                <span className="text-primary font-semibold">Advanced</span>
                                <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <hr className="my-2" />
                                <div className="space-y-2">
                                    <Label>Save Interval (seconds)</Label>
                                    <Input
                                        value={formData.saveIntervalSeconds}
                                        type="number"
                                        onChange={(e) => setFormData({...formData, saveIntervalSeconds: Number(e.target.value) })}
                                        placeholder="7200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Backup Count</Label>
                                    <Input
                                        value={formData.backupCount}
                                        type="number"
                                        onChange={(e) => setFormData({...formData, backupCount: Number(e.target.value) })}
                                        placeholder="3"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Initial Backup (seconds)</Label>
                                    <Input
                                        value={formData.initialBackupSeconds}
                                        type="number"
                                        onChange={(e) => setFormData({...formData, initialBackupSeconds: Number(e.target.value) })}
                                        placeholder="7200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Backup Interval (seconds)</Label>
                                    <Input
                                        value={formData.backupIntervalSeconds}
                                        type="number"
                                        onChange={(e) => setFormData({...formData, backupIntervalSeconds: Number(e.target.value) })}
                                        placeholder="43200"
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <Button type="submit" className="w-full">Create Server</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateServer