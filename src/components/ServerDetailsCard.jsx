import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {Shield, Users, Server, Clock, LoaderCircle, RotateCcw, Play, Pause, Trash} from 'lucide-react';
import {Button} from "@/components/ui/button";

const ServerDetailsCard = ({ serverData, id }) => {
    const { server_ip, server_port, world_details, state } = serverData;

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
                    className="bg-yellow-100 text-yellow-800 p-3 text-md"
                >
                    <span className="mx-2">Scheduling Server...</span>
                    <LoaderCircle className="animate-spin" />
                </Badge>
            case "loading":
                return  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 p-3 text-md"
                >
                    <span className="mx-2">Starting Up...</span>
                    <LoaderCircle className="animate-spin" />
                </Badge>
            case "running":
                return <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 p-3 text-md"
                >
                    <span className="mx-2">Running</span>
                </Badge>
            case "stopped":
            case "terminated":
                return <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800 p-3 text-md"
                >
                    <span className="mx-2">Stopped</span>
                </Badge>
            default:
                return <Badge
                    variant="secondary"
                    className="bg-gray-200 text-gray-800 p-3 text-md"
                >
                    <span className="mx-2">Unknown</span>
                </Badge>
        }
    }

    const renderActionButtons = () => {
        switch (state) {
            case "terminated":
            case "stopped": // -> show start button
                return <Button className="bg-green-200 text-green-800 hover:bg-green-300 my-2 py-6">
                    <Play /> Start
                </Button>
            case "running": // -> show stop button
                return
            case "loading": // -> show disabled start button
                return
            default:
                // show restart button
        }
    }

    return (
        <Card className="w-full max-w-2xl" key={id}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold">
                        {world_details.name}
                    </CardTitle>
                    {getBadge(state)}
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Connection Details */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Server className="h-4 w-4" />
                        <span>Connection Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">
                            <span className="font-medium">IP:</span> {server_ip}
                        </div>
                        <div className="text-sm">
                            <span className="font-medium">Port:</span> {server_port}
                        </div>
                    </div>
                </div>

                {/* World Settings */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
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
                        <Shield className="h-4 w-4" />
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
                        <Clock className="h-4 w-4" />
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
                            <RotateCcw className="h-4 w-4" />
                            <span>Actions</span>
                        </div>
                        <div className="gap-2 flex flex-grow">
                            <Button disabled={state !== "terminated" && state !== "stopped"} className="bg-green-200 text-green-800 hover:bg-green-300 my-2 py-6">
                                <Play /> Start
                            </Button>
                            <Button disabled={state !== "running"} className="bg-blue-200 text-blue-800 hover:bg-blue-300 my-2 py-6">
                                <Pause /> Stop
                            </Button>
                            <Button disabled={state !== "terminated" && state !== "stopped"} className="bg-red-200 text-red-800 hover:bg-red-300 my-2 py-6">
                                <Trash /> Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ServerDetailsCard;