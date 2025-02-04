import React from 'react';
import { Button } from "@/components/ui/button";

const Backups = ({ }) => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Your Server Backups</h2>
                <div className="text-center py-12 border rounded">
                    <p className="text-gray-500 mb-4">No backups created yet</p>
                    <Button onClick={() => {}}>
                        Create a Backup
                    </Button>
                </div>
        </div>
    )
}

export default Backups