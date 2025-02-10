import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {Copy, DatabaseBackup, Download, Trash} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

type Backup = {
    key: string;
    fileSize: number;
    installing: boolean;
    installed: boolean;
};


type BackupListProps = {
    primaryBackups: Backup[];
    replicaBackups: Backup[];
    onBackupAction: Function
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

const BackupList: React.FC<BackupListProps> = ({primaryBackups, replicaBackups, onBackupAction}) => {
    const [activeTab, setActiveTab] = useState<'primary' | 'replica'>('primary');

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Valheim Backups</CardTitle>
                    <div>
                        <Button
                            variant={activeTab === 'primary' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('primary')}
                            className="mr-2"
                        >
                            <DatabaseBackup className="mr-2 h-4 w-4" /> Primary
                        </Button>
                        <Button
                            variant={activeTab === 'replica' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('replica')}
                        >
                            <Copy className="mr-2 h-4 w-4" /> Replicas
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {activeTab === 'primary' && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Backup File</TableHead>
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
                                    <TableCell className="text-right">
                                        {formatFileSize(backup.fileSize)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {
                                            backup.installed ?
                                                <Button className="bg-red-200 text-red-800 hover:bg-red-300" onClick={() => onBackupAction('uninstall', backup)}>
                                                    <Trash />
                                                    Uninstall
                                                </Button> :
                                                <Button className="bg-green-200 text-green-800 hover:bg-green-300" onClick={() => onBackupAction('install', backup)}>
                                                    <Download />
                                                    Install
                                                </Button>
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