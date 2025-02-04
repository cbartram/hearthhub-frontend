import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


const ServersList = ({ servers, onServerCreateButtonClick }) => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Your Valheim Servers</h2>
            {servers.length === 0 ? (
                <div className="text-center py-12 border rounded">
                    <p className="text-gray-500 mb-4">No servers created yet</p>
                    <Button onClick={() => onServerCreateButtonClick()}>
                        Create First Server
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {servers.map(server => (
                        <Card key={server.id}>
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <CardTitle>{server.name}</CardTitle>
                                    <CardDescription>World: {server.worldName}</CardDescription>
                                    <div className="flex space-x-2 mt-2">
                                        <Badge
                                            variant={server.isRunning ? "secondary" : "destructive"}
                                            className="bg-green-400"
                                        >
                                            {server.isRunning ? 'Running' : 'Stopped'}
                                        </Badge>
                                        {server.isCrossplay && (
                                            <Badge variant="secondary">Crossplay</Badge>
                                        )}
                                        {server.isPublic && (
                                            <Badge variant="secondary">Public</Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline">Details</Button>
                                    <Button>
                                        {server.isRunning ? 'Stop' : 'Start'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServersList
