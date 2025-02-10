import React from 'react';
import { Button } from "@/components/ui/button";
import ServerDetailsCard from "@/components/ServerDetailsCard.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Clock, Server, Shield, Users} from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';


const ServersList = ({ servers, loading, onServerCreateButtonClick, onAction }) => {

    const renderSkeleton = () => {
        return (
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold">
                            <Skeleton className="h-6 w-40" />
                        </CardTitle>
                        <Skeleton className="h-6 w-20" />
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Server className="h-4 w-4" />
                            <span>Connection Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>World Settings</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4" />
                            <span>Game Modifiers</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-28" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Backup & Save Settings</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };


    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Your Valheim Servers</h2>
            {servers.length === 0 && !loading ? (
                <div className="text-center py-12 border rounded">
                    <p className="text-gray-500 mb-4">No servers created yet</p>
                    <Button onClick={() => onServerCreateButtonClick()}>
                        Create First Server
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {loading ? renderSkeleton() : servers.map((server, i) => (
                        <ServerDetailsCard id={`${server.deployment_name}_${i}`} serverData={server} onAction={(state) => onAction(server, state)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServersList
