import React, {useState} from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    Server,
    Clock,
    LoaderCircle,
    RotateCcw,
    Play,
    Pause,
    Trash,
    Edit,
    Globe2, Network, Gamepad,
} from 'lucide-react';
import {Button} from "@/components/ui/button";
import DangerDialogue from "@/components/DangerDialogue";

const ServerDetailsCard = ({ serverData, onAction, onEdit }) => {
    const { server_ip, server_port, world_details, state, joinCode } = serverData;
    const [showDialog, setShowDialog] = useState(false);

    const getModifierBadgeColor = (key, value) => {
        if(key === "raids") {
            switch (value) {
                case 'none':
                case 'muchless':
                case 'less':
                    return 'bg-green-500 hover:bg-green-700';
                case 'more':
                case 'muchmore':
                    return 'bg-red-500 hover:bg-red-700';
                default:
                    return 'bg-blue-500 hover:bg-blue-700';
            }
        }

        switch(value) {
            case 'easy':
            case 'veryeasy':
            case 'muchmore':
            case 'casual':
                return 'bg-green-500 hover:bg-green-700';
            case 'hard':
            case 'veryhard':
                return 'bg-red-500 hover:bg-red-700';
            default:
                return 'bg-blue-500 hover:bg-blue-700';
        }
    };

    const getBadge = (state) => {
        const baseClasses = "flex items-center justify-center w-full sm:w-auto p-3 text-md";
        switch(state) {
            case "scheduling":
                return <Badge variant="secondary" className={`${baseClasses} bg-yellow-100 text-yellow-800 hover:bg-yellow-200`}>
                    <span className="mx-2">Scheduling Server...</span>
                    <LoaderCircle className="animate-spin" />
                </Badge>
            case "loading":
                return <Badge variant="secondary" className={`${baseClasses} bg-blue-100 text-blue-800 hover:bg-blue-200`}>
                    <span className="mx-2">Starting Up...</span>
                    <LoaderCircle className="animate-spin" />
                </Badge>
            case "running":
                return <Badge variant="secondary" className={`${baseClasses} bg-green-100 text-green-800 hover:bg-green-200`}>
                    <span className="mx-2">Running</span>
                </Badge>
            case "stopped":
            case "terminated":
                return <Badge variant="secondary" className={`${baseClasses} bg-red-100 text-red-800 hover:bg-red-200`}>
                    <span className="mx-2">Stopped</span>
                </Badge>
            case "terminating":
                return <Badge variant="secondary" className={`${baseClasses} bg-red-100 text-red-800 hover:bg-red-200`}>
                    <span className="mx-2">Shutting Down... </span>
                    <LoaderCircle className="animate-spin" />
                </Badge>
            default:
                return <Badge variant="secondary" className={`${baseClasses} bg-gray-200 text-gray-800 hover:bg-gray-300`}>
                    <span className="mx-2">Unknown</span>
                </Badge>
        }
    }

    return (
        <>
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <CardTitle className="text-xl sm:text-2xl font-bold">
                            {world_details.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 sm:ml-auto">
                            <Button
                                className="mr-2 py-4 sm:py-6 hover:border-1 hover:border-slate-900"
                                disabled={state !== "stopped" && state !== "terminated"}
                                onClick={() => onEdit(serverData)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            {getBadge(state)}
                        </div>
                    </div>
                    <hr />
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Connection Details */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Network className="h-4 w-4" />
                            <span>Connection Details</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {
                                (state === "terminated" || state === "stopped" || state === "scheduling") ? (
                                    <span className="text-lg">
                                        No Server
                                    </span>
                                ) : (
                                    <>
                                        <div className="text-sm">
                                            <span className="font-medium">IP:</span> {server_ip}
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium">Port:</span> {server_port}
                                        </div>
                                        <div className="text-sm col-span-1 sm:col-span-2">
                                            <span className="font-medium">Join Code:</span>
                                            <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-300 ml-2 p-1 px-2 text-sm">
                                                {
                                                    joinCode === "" && state !== "starting" ?
                                                        <>
                                                            <LoaderCircle height={15} className="animate-spin" /> Loading...
                                                        </> : joinCode
                                                }
                                            </Badge>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>

                    {/* Hardware Resources */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Server className="h-4 w-4" />
                            <span>Server Hardware</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="text-sm">
                                <span className="font-medium">Memory:</span> {world_details.memory_requests} Gb
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">CPU:</span> {world_details.cpu_requests} cores
                            </div>
                        </div>
                    </div>

                    {/* World Settings */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe2 className="h-4 w-4" />
                            <span>World Settings</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="text-sm">
                                <span className="font-medium">World:</span> {world_details.world}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Password Protected:</span> {world_details.password ? 'Yes' : 'No'}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Crossplay:</span> {world_details.enable_crossplay ? 'Enabled' : 'Disabled'}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Public:</span> {world_details.public ? 'Yes' : 'No'}
                            </div>
                        </div>
                    </div>

                    {/* Game Modifiers */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Gamepad className="h-4 w-4" />
                            <span>Game Modifiers</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {world_details.modifiers.map(({ key, value }, i) => (
                                <Badge
                                    key={i}
                                    className={`${getModifierBadgeColor(key, value)} text-sm`}
                                >
                                    {key}: {value}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Backup Settings */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Backup & Save Settings</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="text-sm">
                                <span className="font-medium">Save Interval:</span> {world_details.save_interval_seconds / 60} minutes
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Backup Count:</span> {world_details.backup_count}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Initial Backup:</span> {world_details.initial_backup_seconds / 3600} hours
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Backup Interval:</span> {world_details.backup_interval_seconds / 3600} hours
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <RotateCcw className="h-4 w-4" />
                                <span>Actions</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                    disabled={state !== "terminated" && state !== "stopped"}
                                    className="bg-green-200 text-green-800 hover:bg-green-300 py-6 hover:border-1 hover:border-green-200 w-full sm:w-auto"
                                    onClick={() => onAction('start')}
                                >
                                    <Play className="mr-2" /> Start
                                </Button>
                                <Button
                                    disabled={state !== "running"}
                                    className="bg-blue-200 text-blue-800 hover:bg-blue-300 py-6 hover:border-1 hover:border-blue-200 w-full sm:w-auto"
                                    onClick={() => onAction('stop')}
                                >
                                    <Pause className="mr-2" /> Stop
                                </Button>
                                <Button
                                    disabled={state !== "running"}
                                    className="bg-red-200 text-red-800 hover:bg-red-300 py-6 hover:border-1 hover:border-red-200 w-full sm:w-auto"
                                    onClick={() => setShowDialog(true)}
                                >
                                    <Trash className="mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DangerDialogue
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                onDestructiveAction={() => onAction('delete')}
            />
        </>
    );
};

export default ServerDetailsCard;