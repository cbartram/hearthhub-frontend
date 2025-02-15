import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {ChevronDown, AlertCircle, EyeOff, Eye} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Slider} from "@/components/ui/slider";

const CreateServer = ({ onServerCreate, existingWorlds, formValues, cpuLimit, memoryLimit }) => {
    const [cpu, setCpu] = React.useState([1]);
    const [memory, setMemory] = React.useState([1]);

    const [formData, setFormData] = useState({
        name: '',
        world: '',
        password: '',
        isCrossplay: false,
        isPublic: false,

        // Modifiers
        combat: 'standard',
        deathpenalty: 'standard',
        resources: 'standard',
        raids: 'standard',
        portals: 'standard',

        // Advanced
        saveIntervalSeconds: 1800,
        backupCount: 3,
        initialBackupSeconds: 7200,
        backupIntervalSeconds: 43200,
    });

    const [errorData, setErrorData] = useState({})
    const [worldSelect, setWorldSelect] = useState('new')
    const [viewPass, setViewPass] = useState(false)

    useEffect(() => {
        if (formValues) {
            setFormData(prev => ({
                ...prev,
                ...formValues,
            }));
        }
    }, [formValues]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const err = {}

        if(formData.password.length < 4) {
            err['password'] = 'Your server password cannot be less than 4 characters.'
        }

        formData.world = formData.world.replaceAll(" ", "-")
        formData.name = formData.name.replaceAll(" ", "-")

        if(Object.keys(err).length > 0) {
            setErrorData({...errorData, ...err})
        } else {
            onServerCreate({...formData, memoryRequest: memory[0], cpuRequest: cpu[0] })
        }
    };

    const sanitizeWorldName = (name) => {
        return name.slice(name.lastIndexOf("/") + 1, name.length - 3)
    }

    const cpuMarks = Array.from({ length: cpuLimit }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}`
    }));

    const memoryMarks = Array.from({ length: memoryLimit }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}`
    }));

    return (
        <div className="p-0">
            <Card className="w-full max-w-2xl m-6">
                <CardHeader>
                    <CardTitle>Configure your Valheim Server</CardTitle>
                    <CardDescription>Configure your dedicated Valheim server settings</CardDescription>
                </CardHeader>
                <CardContent>
                    {
                        Object.keys(errorData).length > 0 ?
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {
                                        Object.keys(errorData).map(key => {
                                            return <li key={key}>{errorData[key]}</li>
                                        })
                                    }
                                </ul>
                            </AlertDescription>
                        </Alert> : <></>
                    }

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
                                <Label>Select an Option</Label>
                                <RadioGroup defaultValue="comfortable">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem className={worldSelect === "new" ? 'bg-black' : 'bg-gray-100'} value="new" id="r1" onClick={() => setWorldSelect('new')} />
                                        <Label htmlFor="r1">New World</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem className={worldSelect === "existing" ? '' : 'bg-gray-100'} value="existing" id="r2"  onClick={() => setWorldSelect('existing')} />
                                        <Label htmlFor="r2">Existing World</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {
                                worldSelect === 'new' ? <>
                                    <Label>World Name</Label>
                                    <Input
                                        value={formData.world}
                                        onChange={(e) => setFormData({...formData, world: e.target.value})}
                                        placeholder="Midgard Realm"
                                        required
                                    />
                                </> : <>
                                    <Label>Select Existing World</Label>
                                    <Select
                                        value={formData.world}
                                        onValueChange={(value) => setFormData({...formData, world: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Existing World" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                existingWorlds.length === 0 ? <SelectItem value="no-world">No Existing Worlds Found</SelectItem> :
                                                existingWorlds.map((w, i) => (
                                                    <SelectItem value={sanitizeWorldName(w.key)} key={`${sanitizeWorldName(w.key)}_${i}`} disabled={!w.installed}>{sanitizeWorldName(w.key)}{!w.installed && " (Not Installed)"}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </>
                            }
                        </div>

                        <div className="space-y-2">
                            <Label>Password</Label>
                            <div className="flex justify-items-center">
                                <Input
                                    type={viewPass ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="Server access password"
                                    required
                                />
                                <Button variant="ghost" type="button" className="bg-transparent ml-2" onClick={() => setViewPass(prev => !prev)}>
                                    {viewPass ? <EyeOff /> : <Eye />}
                                </Button>
                            </div>
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
                            <div className="flex justify-between items-center">
                                <Label htmlFor="cpu">CPU Cores</Label>
                                <span className="text-sm font-medium">{cpu[0]} cores</span>
                            </div>
                            <Slider
                                id="cpu"
                                min={1}
                                max={cpuLimit}
                                step={1}
                                value={cpu}
                                onValueChange={setCpu}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                {cpuMarks.map((mark) => (
                                    <span key={mark.value} className="flex flex-col items-center">
                |
                <span>{mark.label}</span>
              </span>
                                ))}
                            </div>
                        </div>


                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="memory">Memory (GB)</Label>
                                <span className="text-sm font-medium">{memory[0]} GB</span>
                            </div>
                            <Slider
                                id="memory"
                                min={1}
                                max={memoryLimit}
                                step={1}
                                value={memory}
                                onValueChange={setMemory}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                {memoryMarks.map((mark) => (
                                    <span key={mark.value} className="flex flex-col items-center">
                |
                <span>{mark.label}</span>
              </span>
                                ))}
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
                                        value={formData.combat}
                                        onValueChange={(value) => setFormData({...formData, combat: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Combat Difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="veryeasy">Very Easy</SelectItem>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="standard">Standard</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                            <SelectItem value="veryhard">Very Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Label>Death Penalty</Label>
                                    <Select
                                        value={formData.deathpenalty}
                                        onValueChange={(value) => setFormData({...formData, deathpenalty: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Death Penalty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="casual">Casual</SelectItem>
                                            <SelectItem value="veryeasy">Very Easy</SelectItem>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="standard">Standard</SelectItem>
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
                                            <SelectItem value="muchless">Much Less (0.25x)</SelectItem>
                                            <SelectItem value="less">Less (0.5x)</SelectItem>
                                            <SelectItem value="standard">Standard (1x)</SelectItem>
                                            <SelectItem value="more">More (1.5x)</SelectItem>
                                            <SelectItem value="muchmore">Much More (2x)</SelectItem>
                                            <SelectItem value="most">Most (3x)</SelectItem>
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
                                            <SelectItem value="standard">Standard</SelectItem>
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
                                            <SelectItem value="standard">Standard</SelectItem>
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
                                        min={300}
                                        max={86400}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Backup Count</Label>
                                    <Input
                                        value={formData.backupCount}
                                        type="number"
                                        onChange={(e) => setFormData({...formData, backupCount: Number(e.target.value) })}
                                        placeholder="3"
                                        min={1}
                                        max={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Initial Backup (seconds)</Label>
                                    <Input
                                        value={formData.initialBackupSeconds}
                                        type="number"
                                        onChange={(e) => setFormData({...formData, initialBackupSeconds: Number(e.target.value) })}
                                        placeholder="7200"
                                        min={300}
                                        max={86400}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Backup Interval (seconds)</Label>
                                    <Input
                                        value={formData.backupIntervalSeconds}
                                        type="number"
                                        onChange={(e) => setFormData({...formData, backupIntervalSeconds: Number(e.target.value) })}
                                        placeholder="43200"
                                        min={14400}
                                        max={86400}
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <Button type="submit" className="w-full">{formValues ? 'Save Server' : 'Create Server'}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateServer