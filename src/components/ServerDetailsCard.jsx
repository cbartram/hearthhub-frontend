import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Server, Clock } from 'lucide-react';

const ServerDetailsCard = ({ serverData, key }) => {
    const { server_ip, server_port, world_details, state } = serverData;

    const getModifierBadgeColor = (value) => {
        switch(value) {
            case 'easy':
            case 'veryeasy':
            case 'muchmore':
            case 'casual':
                return 'bg-green-500';
            case 'hard':
            case 'veryhard':
                return 'bg-red-500';
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <Card className="w-full max-w-2xl" key={key}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold">
                        {world_details.name}
                    </CardTitle>
                    <Badge
                        variant="secondary"
                        className={state === 'running' ? 'bg-green-100 text-green-800 p-3 text-md' : 'bg-yellow-100 p-3 text-yellow-800'}
                    >
                        {state}
                    </Badge>
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
                        {world_details.modifiers.map(({ key, value }) => (
                            <Badge
                                key={key}
                                className={getModifierBadgeColor(value)}
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
                </div>
            </CardContent>
        </Card>
    );
};

export default ServerDetailsCard;