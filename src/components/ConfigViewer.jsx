import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {LoaderCircle, Upload} from 'lucide-react';
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useAuth} from "@/context/AuthContext.jsx";
import {KubeApiClient} from "@/lib/api.js";

const MAX_FILE_SIZE = 30 * 1024 * 1024

const ConfigViewer = ({ configs, onUploadComplete, onConfigFileInstall }) => {
    const {user} = useAuth()
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [configFile, setConfigFile] = useState(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const apiClient = new KubeApiClient(user)

    const validateFileSize = (file) => {
        if (file.size > MAX_FILE_SIZE) {
            return `File size (${formatFileSize(file.size)}) exceeds the maximum limit of ${formatFileSize(MAX_FILE_SIZE)}`;
        }
        return null;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.name.endsWith('.cfg') && !file.name.endsWith(".yaml") && !file.name.endsWith(".json")) {
            setError('Config file must be a .cfg, .yaml, or .json file');
            return;
        }

        const sizeError = validateFileSize(file);
        if (sizeError) {
            setError(sizeError);
            event.target.value = ''; // Reset file input
            return;
        }

        setError('');
        setConfigFile(file)
    };

    const handleUpload = async () => {
        if (!configFile) {
            setError('Please select a config file to upload');
            return;
        }

        setUploading(true);
        setError('');
        const key = `config/${user.discordId}/${configFile.name}`

        try {
            const res = await apiClient.generatePresignedUrls([{
                name: configFile.name,
                size: configFile.size,
                prefix: key
            }])

            await fetch(res.urls[configFile.name], {
                method: 'PUT',
                body: configFile
            })

            setConfigFile(null)
            onUploadComplete({
                key,
                name: configFile.name,
                content: 'TODO',
                size: configFile.size,
                installed: false,
                installing: false
            })
        } catch (err) {
            setError('Failed to upload mod file: ' + err.message);
        } finally {
            setUploading(false)
        }
    };

    const formatFileSize = (bytes) => {
        const mb = bytes / (1024);
        return `${mb.toFixed(2)} KB`;
    };

    const renderBadge = (config) => {
        if (config.installed) {
            return <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200 text-md">Installed</Badge>;
        }
        return <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-200 text-md">Not Installed</Badge>
    };

    const getButton = (configFile) => {
        if(configFile.installing) {
            return <Button className="bg-blue-200 text-blue-800 hover:bg-blue-300" disabled>
                Installing...
                <LoaderCircle className="ml-2 animate-spin" />
            </Button>
        }

        if(!configFile.installed) {
            return <Button
                className="bg-green-100 text-green-800 hover:bg-green-200 text-md hover:border-1 hover:border-green-100 hover:outline-none" onClick={() => onConfigFileInstall(configFile)}>Install File</Button>
        }

        return <Button disabled className="bg-gray-300 text-gray-900 hover:bg-gray-400 hover:border-1 hover:border-gray-400 hover:outline-none text-md">Installed</Button>
    }

    return (
        <div className="space-y-4">
            <Card className="m-6">
                <CardHeader>
                    <CardTitle>Mod Configurations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mod File Name</TableHead>
                                <TableHead>Install State</TableHead>
                                <TableHead className="text-right">Size</TableHead>
                                <TableHead className="text-right">Install File</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {configs.map((config) => (
                                <TableRow
                                    key={config.key}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => setSelectedConfig(config)}
                                >
                                    <TableCell className="font-medium">
                                        {config.name.split('/').pop()}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {renderBadge(config)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatFileSize(config.size)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {getButton(config)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="m-6 max-w-96">
                <CardHeader>
                    <CardTitle>Upload Valheim Configuration</CardTitle>
                    <CardDescription>
                        Select your Valheim config file.
                        <br />
                        Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
                        <br />
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="config-file" className="block text-sm font-medium">
                            Config File (.cfg, .json, .yaml)
                        </label>
                        <input
                            id="config-file"
                            type="file"
                            accept=".json,.yaml,.cfg"
                            onChange={(e) => handleFileChange(e)}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                        {configFile && (
                            <p className="text-sm text-green-600">
                                Selected: {configFile.name} ({formatFileSize(configFile.size)})
                            </p>
                        )}
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        onClick={handleUpload}
                        disabled={!configFile || uploading}
                        className="w-full"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? <>Uploading... <LoaderCircle className="animate-spin"/></> : 'Upload Files'}
                    </Button>
                </CardContent>
            </Card>

            {selectedConfig && (
                <Card className="m-6">
                    <CardHeader>
                        <CardTitle>Configuration Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 font-mono text-sm">
                          {selectedConfig.content}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ConfigViewer;