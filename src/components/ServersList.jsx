import React from 'react';
import { Button } from "@/components/ui/button";
import ServerDetailsCard from "@/components/ServerDetailsCard.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import ResourceMetrics from "@/components/ResourceMetrics";


export const renderSkeleton = () => {
    return (
        <div>
            <Card className="w-full max-w-2xl m-6">
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
                        <div className="grid grid-cols-2 gap-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-28" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


const ServersList = ({ servers, loading, onServerCreateButtonClick, onAction, onEdit, metrics }) => {
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
                        <ServerDetailsCard
                            id={`${server.deployment_name}_${i}`}
                            serverData={server}
                            onEdit={(server) => onEdit(server)}
                            onAction={(state) => onAction(server, state)}
                        />
                    ))}
                    <ResourceMetrics data={metrics} />
                </div>
            )}
        </div>
    );
};

export default ServersList
