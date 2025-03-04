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

const CreateServer = ({ onServerCreate, existingWorlds, formValues, cpuLimit, memoryLimit, backupLimit, worldLimit }) => {
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
    const modifierData = [
        {
            name: 'combat',
            nameFormatted: "Combat",
            values: ["veryeasy", "easy", "standard", "hard", "veryhard"],
            valuesFormatted: ["Very Easy", "Easy", "Standard", "Hard", "Very Hard"]
        },
        {
            name: 'deathpenalty',
            nameFormatted: "Death Penalty",
            values: ["casual", "veryeasy", "easy", "standard", "hard", "hardcore"],
            valuesFormatted: ["Casual", "Very Easy", "Easy", "Standard", "Hard", "Hard Core"]
        },
        {
            name: 'resources',
            nameFormatted: "Resources",
            values: ["muchless", "less", "standard", "more", "muchmore", "most"],
            valuesFormatted: ["Much Less 0.25x", "Less 0.5x", "Standard 1x", "More 2x", "Much More 2.5x", "Most 3x"]
        },
        {
            name: 'raids',
            nameFormatted: "Raids",
            values: ["none", "muchless", "less", "standard", "more", "muchmore"],
            valuesFormatted: ["None", "Much Less", "Less", "Standard", "More", "Much More"]
        },
        {
            name: 'portals',
            nameFormatted: "Portals",
            values: ["casual", "standard", "hard", "veryhard"],
            valuesFormatted: ["Casual", "Standard", "Hard", "Very Hard"]
        }
    ]

    useEffect(() => {
        if(existingWorlds.length + 1 > worldLimit) {
            setErrorData({
                ...errorData,
                "world_limit": `Your plan allows for a maximum of ${worldLimit} worlds. Please remove a world or select an existing world for your server.`
            })
        }
    }, []);

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
        <div className="p-2 sm:p-4 md:p-6">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-xl sm:text-2xl">Configure your Valheim Server</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Configure your dedicated Valheim server settings</CardDescription>
                </CardHeader>
                <CardContent>
                    {Object.keys(errorData).length > 0 && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc pl-4">
                                    {Object.keys(errorData).map(key => (
                                        <li key={key} className="text-sm">{errorData[key]}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Server Name and World Selection - Stack on mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Server Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="My Viking Server"
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Select an Option</Label>
                                <RadioGroup defaultValue="comfortable" className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem className={worldSelect === "new" ? 'bg-black' : 'bg-gray-100'} value="new" id="r1" onClick={() => setWorldSelect('new')} />
                                        <Label htmlFor="r1" className="text-sm">New World</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem className={worldSelect === "existing" ? '' : 'bg-gray-100'} value="existing" id="r2" onClick={() => setWorldSelect('existing')} />
                                        <Label htmlFor="r2" className="text-sm">Existing World</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* World Selection */}
                        <div className="space-y-2">
                            {worldSelect === 'new' ? (
                                <>
                                    <Label className="text-sm font-medium">World Name</Label>
                                    <Input
                                        value={formData.world}
                                        onChange={(e) => setFormData({...formData, world: e.target.value})}
                                        placeholder="Midgard Realm"
                                        required
                                        className="w-full"
                                    />
                                </>
                            ) : (
                                <>
                                    <Label className="text-sm font-medium">Select Existing World</Label>
                                    <Select
                                        value={formData.world}
                                        onValueChange={(value) => setFormData({...formData, world: value})}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Existing World" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {existingWorlds.length === 0 ? (
                                                <SelectItem value="no-world">No Existing Worlds Found</SelectItem>
                                            ) : (
                                                existingWorlds.map((w, i) => (
                                                    <SelectItem
                                                        value={sanitizeWorldName(w.key)}
                                                        key={`${sanitizeWorldName(w.key)}_${i}`}
                                                        disabled={!w.installed}
                                                    >
                                                        {sanitizeWorldName(w.key)}{!w.installed && " (Not Installed)"}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Password</Label>
                            <div className="flex justify-items-center">
                                <Input
                                    type={viewPass ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="Server access password"
                                    required
                                    className="w-full"
                                />
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="bg-transparent ml-2"
                                    onClick={() => setViewPass(prev => !prev)}
                                >
                                    {viewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Switches - Stack on mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={formData.isCrossplay}
                                    onCheckedChange={(checked) => setFormData({...formData, isCrossplay: checked})}
                                />
                                <Label className="text-sm">Enable Crossplay</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={formData.isPublic}
                                    onCheckedChange={(checked) => setFormData({...formData, isPublic: checked})}
                                />
                                <Label className="text-sm">Public Server</Label>
                            </div>
                        </div>

                        {/* Sliders with better mobile spacing */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="cpu" className="text-sm font-medium">CPU Cores</Label>
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
                                <div className="flex justify-between text-xs text-muted-foreground px-2">
                                    {cpuMarks.map((mark) => (
                                        <span key={mark.value} className="flex flex-col items-center">
                      <span>|</span>
                      <span>{mark.label}</span>
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="memory" className="text-sm font-medium">Memory (GB)</Label>
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
                                <div className="flex justify-between text-xs text-muted-foreground px-2">
                                    {memoryMarks.map((mark) => (
                                        <span key={mark.value} className="flex flex-col items-center">
                      <span>|</span>
                      <span>{mark.label}</span>
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Collapsible sections with better mobile spacing */}
                        <Collapsible className="w-full">
                            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-gray-100 rounded-lg">
                                <span className="text-primary font-semibold text-sm">Optional Modifiers</span>
                                <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-4 space-y-4">
                                {/* Optional Modifiers content with consistent spacing */}
                                <div className="space-y-4">
                                    {modifierData.map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <Label className="text-sm font-medium capitalize">{field.nameFormatted}</Label>
                                            <Select
                                                value={formData[field.name]}
                                                onValueChange={(value) => setFormData({...formData, [field.name]: value})}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={`Select ${field.nameFormatted}`} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        field.values.map((v, i) => (
                                                            <SelectItem value={v}>{field.valuesFormatted[i]}</SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Advanced section with consistent mobile styling */}
                        <Collapsible className="w-full">
                            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-gray-100 rounded-lg">
                                <span className="text-primary font-semibold text-sm">Advanced</span>
                                <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-4 space-y-4">
                                {/* Advanced settings with consistent spacing */}
                                {[
                                    { label: 'Save Interval (seconds)', key: 'saveIntervalSeconds', min: 300, max: 86400 },
                                    { label: 'Backup Count', key: 'backupCount', min: 1, max: backupLimit },
                                    { label: 'Initial Backup (seconds)', key: 'initialBackupSeconds', min: 300, max: 86400 },
                                    { label: 'Backup Interval (seconds)', key: 'backupIntervalSeconds', min: 14400, max: 86400 }
                                ].map((setting) => (
                                    <div key={setting.key} className="space-y-2">
                                        <Label className="text-sm font-medium">{setting.label}</Label>
                                        <Input
                                            value={formData[setting.key]}
                                            type="number"
                                            onChange={(e) => setFormData({...formData, [setting.key]: Number(e.target.value)})}
                                            placeholder={setting.key === 'backupCount' ? '3' : '7200'}
                                            min={setting.min}
                                            max={setting.max}
                                            className="w-full"
                                        />
                                    </div>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>

                        <Button type="submit" className="w-full" disabled={Object.keys(errorData).length > 0}>
                            {formValues ? 'Save Server' : 'Create Server'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateServer