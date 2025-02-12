import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatabaseBackup, Download, Globe2, LoaderCircle, Trash} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

// @ts-ignore
import DangerDialogue from '@/components/DangerDialogue.jsx'

type Backup = {
    key: string;
    fileSize: number;
    installing: boolean;
    installed: boolean;
};

type Server = {
    server_ip: string;
    server_port: number;
    deployment_name: string;
    mod_pvc_name: string;
    state: string;
    world_details: WorldDetails
}

type Modifier = {
    key: string;
    value: string;
}

type WorldDetails = {
    name: string;
    world: string;
    port: string;
    password: string;
    enable_crossplay: boolean;
    public: boolean;
    instance_id: string;
    modifiers: Modifier[]
    save_interval_seconds: number;
    backup_count: number;
    initial_backup_seconds: number;
    backup_interval_seconds: number;
}


type BackupListProps = {
    primaryBackups: Backup[];
    replicaBackups: Backup[];
    onBackupAction: Function;
    onBackupRestore: Function;
    servers: Server[];
};

const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    const sizeInKB = (sizeInBytes / 1024).toFixed(1);
    return `${sizeInKB} KB`;
};

const extractTimestamp = (key: string): string | null => {
    const match = key.match(/_backup_auto-(\d{14})\./);
    return match ? formatTimestamp(match[1]) : null;
};

const formatTimestamp = (timestamp: string): string => {
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const hours = timestamp.slice(8, 10);
    const minutes = timestamp.slice(10, 12);

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const renderBadge = (backup: Backup) => {
    if(backup.installed) {
        return <Badge className="bg-green-200 text-green-800 hover:bg-green-300 ml-2">Installed</Badge>
    }

    return <Badge className="bg-red-200 text-red-800 hover:bg-red-300 ml-2">Not Installed</Badge>
}

const renderButtons = (backup: Backup, onBackupAction: Function) => {
    if(backup.installing && !backup.installed) {
        return <Button className="bg-blue-200 text-blue-800 hover:bg-blue-300 hover:border-1 hover:border-blue-200" disabled>
            Installing...
            <LoaderCircle className="ml-2 animate-spin" />
        </Button>
    } else if(backup.installing && backup.installed) {
        return <Button className="bg-blue-200 text-blue-800 hover:bg-blue-300 hover:border-1 hover:border-blue-200" disabled>
            Uninstalling...
            <LoaderCircle className="ml-2 animate-spin" />
        </Button>
    }

    if(!backup.installing && !backup.installed) {
        return <Button className="bg-green-200 text-green-800 hover:bg-green-300 hover:border-green-200 hover:border-1 hover:outline-none" onClick={() => onBackupAction('install', backup)}>
            <Download />
            Install
        </Button>
    }

    return <Button className="bg-red-200 text-red-800 hover:bg-red-300 hover:border-red-200 hover:border-1 hover:outline-none" onClick={() => onBackupAction('uninstall', backup)}>
        <Trash />
        Uninstall
    </Button>
}


const BackupList: React.FC<BackupListProps> = ({primaryBackups, replicaBackups, servers, onBackupAction, onBackupRestore}) => {
    const [activeTab, setActiveTab] = useState<'primary' | 'replica'>('primary');

    const getRestoreButton = (backup: Backup) => {
        if(backup.installing) {
            return <Button className="bg-blue-200 text-blue-800 hover:bg-blue-300" disabled>
                Installing...
                <LoaderCircle className="ml-2 animate-spin" />
            </Button>
        }

        // @ts-ignore
        let backupName = backup.key.split("/").pop().slice(0, backup.key.split("/").pop().indexOf("_backup_auto-"))

        // Finds the server where the running worlds = the backup for that world. This ensures other worlds backups can't be
        // installed onto the wrong server. i.e. server with world: midgard can't restore from backup: not-midgard-world_backup_auto
        const filteredServers = servers.filter(s => s.world_details.world === backupName)

        if(filteredServers.length > 0) {
            const server = filteredServers[0]
            return <Button className="bg-green-100 text-green-800 hover:bg-green-200 text-md hover:border-1 hover:border-green-100 hover:outline-none" onClick={() => onBackupRestore(server, backup)}>Restore Backup</Button>
        }

        return <Button disabled className="bg-gray-300 text-gray-900 hover:bg-gray-400 hover:border-1 hover:border-gray-400 hover:outline-none text-md">No Server</Button>
    }

    const renderCurrentWorld = (backup: Backup) => {
        // @ts-ignore
        let backupName = backup.key.split("/").pop().slice(0, backup.key.split("/").pop().length - 3)
        const filteredServer = servers.filter(s => s.world_details.world === backupName)
        if(filteredServer.length > 0) {
            const server = filteredServer[0]
            switch(server.state) {
                case "running":
                    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-md">
                        Running
                    </Badge>
                case "terminated":
                    return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-md">
                        Stopped
                    </Badge>
            }
        }

        return <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-400 text-md">No Server</Badge>
    }

    return (
        <Card className="m-6">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">Valheim Worlds</CardTitle>
                    <div>
                        <Button
                            variant={activeTab === 'primary' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('primary')}
                            className="mr-2 border-0 focus:outline-none focus:border-none"
                        >
                            <Globe2 className="mr-2 h-4 w-4" /> Worlds
                        </Button>
                        <Button
                            variant={activeTab === 'replica' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('replica')}
                            className="border-0 focus:outline-none focus:border-none"
                        >
                            <DatabaseBackup className="mr-2 h-4 w-4" /> World Backups
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {activeTab === 'primary' && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>World File</TableHead>
                                <TableHead>Server State</TableHead>
                                <TableHead className="text-right">Size</TableHead>
                                <TableHead className="text-right">Install Backup</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {primaryBackups.map((backup) => (
                                <TableRow key={backup.key}>
                                    <TableCell className="font-medium">
                                        {backup.key.split('/').pop()}
                                        {renderBadge(backup)}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            renderCurrentWorld(backup)
                                        }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatFileSize(backup.fileSize)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {
                                            renderButtons(backup, onBackupAction)
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {activeTab === 'replica' && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Backup File</TableHead>
                                <TableHead>Install</TableHead>
                                <TableHead>Timestamp</TableHead>
                                <TableHead className="text-right">Size</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {replicaBackups.map((backup) => (
                                <TableRow key={backup.key}>
                                    <TableCell className="font-medium">
                                        {backup.key.split('/').pop()}
                                        <Badge variant="outline" className="ml-2">Replica</Badge>
                                    </TableCell>
                                    <TableCell>
                                        { getRestoreButton(backup) }
                                    </TableCell>
                                    <TableCell>
                                        {extractTimestamp(backup.key) || 'Unknown'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatFileSize(backup.fileSize)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default BackupList
