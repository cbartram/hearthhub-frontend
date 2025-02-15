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

const ServerDetailsCard = ({ serverData, id, onAction, onEdit }) => {
    const { server_ip, server_port, world_details, state, joinCode } = serverData;

    const [showDialog, setShowDialog] = useState(false)

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
        switch(state) {
            case "scheduling":
                return <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 p-3 text-md hover:bg-yellow-200"
                >
                    <span className="mx-2">Scheduling Server...</span>
                    <LoaderCircle className="animate-spin" />
                </Badge>
            case "loading":
                return  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 p-3 text-md hover:bg-blue-200"
                >
                    <span className="mx-2">Starting Up...</span>
                    <LoaderCircle className="animate-spin" />
                </Badge>
            case "running":
                return <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 p-3 text-md hover:bg-green-200"
                >
                    <span className="mx-2">Running</span>
                </Badge>
            case "stopped":
            case "terminated":
                return <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800 p-3 text-md hover:bg-red-200"
                >
                    <span className="mx-2">Stopped</span>
                </Badge>
            case "terminating":
                return <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800 p-3 text-md hover:bg-red-200"
                >
                    <span className="mx-2">Shutting Down... </span>
                    <LoaderCircle className="animate-spin" />
                </Badge>
            default:
                return <Badge
                    variant="secondary"
                    className="bg-gray-200 text-gray-800 p-3 text-md hover:bg-gray-300"
                >
                    <span className="mx-2">Unknown</span>
                </Badge>
        }
    }

    return (
        <>
            <Card className="w-full max-w-2xl" key={id}>
                <CardHeader>
                    <div className="flex justify-end items-center">
                        <CardTitle className="flex-grow text-2xl font-bold">
                            {world_details.name}
                        </CardTitle>
                        <Button className="mr-2 py-6 hover:border-1 hover:border-slate-900" disabled={state !== "stopped" && state !== "terminated"} onClick={() => onEdit(serverData)}><Edit /></Button>
                        {getBadge(state)}
                    </div>
                    <hr />
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Connection Details */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Network className="h-12 w-4" />
                            <span>Connection Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
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
                                        <div className="text-sm">
                                            <span className="font-medium">Join Code:
                                                <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-300 ml-2 p-1 px-2 text-sm">
                                                    {
                                                        joinCode === "" && state !== "starting" ?
                                                            <>
                                                                <LoaderCircle height={15} className="animate-spin" /> Loading...
                                                            </> : joinCode
                                                    }
                                                </Badge>
                                            </span>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>

                    {/* Hardware Resources */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Server className="h-12 w-4" />
                            <span>Server Hardware</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm">
                                <span className="font-medium">Memory:</span> {world_details.memory_requests} Gb
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">CPU:</span> {world_details.cpu_requests} cores
                            </div>
                        </div>
                    </div>

                    {/* World Settings */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe2 className="h-12 w-4" />
                            <span>World Settings</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
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
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Gamepad className="h-12 w-4" />
                            <span>Game Modifiers</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {world_details.modifiers.map(({ key, value }, i) => (
                                <Badge
                                    key={i}
                                    className={getModifierBadgeColor(key, value)}
                                >
                                    {key}: {value}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Backup Settings */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-12 w-4" />
                            <span>Backup & Save Settings</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
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


                        <div className="space-y-2">
                            <div className="flex items-center ap-2 text-sm text-muted-foreground">
                                <RotateCcw className="h-12 w-4" />
                                <span>Actions</span>
                            </div>
                            <div className="gap-2 flex flex-grow">
                                <Button disabled={state !== "terminated" && state !== "stopped"} className="bg-green-200 text-green-800 hover:bg-green-300 my-2 py-6 hover:outline-none hover:border-1 hover:border-green-200" onClick={() => onAction('start')}>
                                    <Play /> Start
                                </Button>
                                <Button disabled={state !== "running"} className="bg-blue-200 text-blue-800 hover:bg-blue-300 my-2 py-6 hover:outline-none hover:border-1 hover:border-blue-200" onClick={() => onAction('stop')}>
                                    <Pause /> Stop
                                </Button>
                                <Button disabled={state !== "terminated" && state !== "stopped"}
                                        className="bg-red-200 text-red-800 hover:bg-red-300 my-2 py-6 hover:outline-none hover:border-1 hover:border-red-200"
                                        onClick={() => setShowDialog(true)}>
                                    <Trash /> Delete
                                </Button>
                                <DangerDialogue
                                    showDialog={showDialog}
                                    setShowDialog={setShowDialog}
                                    onDestructiveAction={() => onAction('delete')}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default ServerDetailsCard;