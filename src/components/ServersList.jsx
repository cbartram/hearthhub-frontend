import React from 'react';
import { Button } from "@/components/ui/button";
import ServerDetailsCard from "@/components/ServerDetailsCard.jsx";


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
                        <ServerDetailsCard key={server.name} serverData={server} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServersList
