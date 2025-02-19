import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from "@/components/ui/progress"
import {LoaderCircle, Upload} from 'lucide-react';
import {KubeApiClient} from "@/lib/api.js";
import {useAuth} from "@/context/AuthContext.jsx";

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB in bytes
const ValheimWorldUpload = ({ onUploadComplete }) => {
    const {user} = useAuth()
    const [seedFile, setSeedFile] = useState(null);
    const [worldFile, setWorldFile] = useState(null);
    const [error, setError] = useState('');
    const [seedUploadProgress, setSeedUploadProgress] = useState(0);
    const [worldUploadProgress, setWorldUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const apiClient = new KubeApiClient(user)

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFileSize = (file) => {
        if (file.size > MAX_FILE_SIZE) {
            return `File size (${formatFileSize(file.size)}) exceeds the maximum limit of ${formatFileSize(MAX_FILE_SIZE)}`;
        }
        return null;
    };

    const handleFileChange = (event, fileType) => {
        const file = event.target.files[0];

        if (!file) return;

        // File extension validation
        if (fileType === 'seed' && !file.name.endsWith('.fwl')) {
            setError('Seed file must be a .fwl file');
            return;
        }

        if (fileType === 'world' && !file.name.endsWith('.db')) {
            setError('World file must be a .db file');
            return;
        }

        // Backups are hard to deal with because there would have to be additional logic on the backend which
        // parses and renames the backup file to the actual world name its being uploaded against.
        if (validateFileName(file.name)) {
            setError('You cannot use a backup as a new world.');
            return;
        }

        const sizeError = validateFileSize(file);
        if (sizeError) {
            setError(sizeError);
            event.target.value = ''; // Reset file input
            return;
        }

        setError('');
        if (fileType === 'seed') {
            setSeedFile(file);
        } else {
            setWorldFile(file);
        }
    };

    const getBaseFileName = (filename) => {
        return filename.split('.')[0];
    };

    const validateFileName = (filename) => {
        if (filename.includes('_backup_auto-')) {
            return 'Backup files are not allowed for world uploads';
        }
        return null;
    };

    const validateFileMatch = (file, otherFile) => {
        if (!file || !otherFile) return null;

        const fileName = getBaseFileName(file.name);
        const otherFileName = getBaseFileName(otherFile.name);

        if (fileName !== otherFileName) {
            return 'File names must match (excluding extensions)';
        }
        return null;
    };

    const handleUpload = async () => {
        if (!seedFile || !worldFile) {
            setError('Please select both seed and world files');
            return;
        }

        const sizeError = validateFileSize(seedFile) || validateFileSize(worldFile);
        const nameError = validateFileName(seedFile.name) || validateFileName(worldFile.name);
        const matchError = validateFileMatch(seedFile, worldFile);

        if (sizeError || nameError || matchError) {
            setError(sizeError || nameError || matchError);
            return;
        }

        setUploading(true);
        setError('');

        try {
            const body = [seedFile, worldFile].map(f => ({
                name: f.name,
                size: f.size,
                prefix: `valheim-backups-auto/${user.discordId}/${f.name}`
            }))

            const res = await apiClient.generatePresignedUrls(body)

            await Promise.all([
                fetch(res.urls[seedFile.name], {
                    method: 'PUT',
                    body: seedFile,
                    onUploadProgress: (progressEvent) => {
                        const progress = (progressEvent.loaded / progressEvent.total) * 100;
                        setSeedUploadProgress(progress);
                    },
                }),
                fetch(res.urls[worldFile.name], {
                    method: 'PUT',
                    body: worldFile,
                    onUploadProgress: (progressEvent) => {
                        const progress = (progressEvent.loaded / progressEvent.total) * 100;
                        setWorldUploadProgress(progress);
                    },
                })
            ])

            setSeedFile(null)
            setWorldFile(null)
            onUploadComplete({
                key: `valheim-backups-auto/${user.discordId}/${worldFile.name}`,
                fileSize: worldFile.size,
                installed: false,
                installing: false
            })
        } catch (err) {
            setError('Failed to upload files: ' + err.message);
        } finally {
            setUploading(false)
        }
    };

    return (
        <Card className="w-full max-w-2xl m-6">
            <CardHeader>
                <CardTitle>Upload Valheim World</CardTitle>
                <CardDescription>
                    Select your world seed (.fwl) and world data (.db) files
                    <br />
                    Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
                    <br />
                    <br />
                    Saves can generally be found in:
                    <br />
                    <code>C:\Users\YOUR-USER\AppData\LocalLow\IronGate\Valheim\worlds_local</code>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="seed-file" className="block text-sm font-medium">
                        Seed File (.fwl)
                    </label>
                    <input
                        id="seed-file"
                        type="file"
                        accept=".fwl"
                        onChange={(e) => handleFileChange(e, 'seed')}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {seedFile && (
                        <p className="text-sm text-green-600">
                            Selected: {seedFile.name} ({formatFileSize(seedFile.size)})
                        </p>
                    )}
                    {seedUploadProgress > 0 && (
                        <Progress value={seedUploadProgress} className="w-full" />
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="world-file" className="block text-sm font-medium">
                        World File (.db)
                    </label>
                    <input
                        id="world-file"
                        type="file"
                        accept=".db"
                        onChange={(e) => handleFileChange(e, 'world')}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {worldFile && (
                        <p className="text-sm text-green-600">
                            Selected: {worldFile.name} ({formatFileSize(worldFile.size)})
                        </p>
                    )}
                    {worldUploadProgress > 0 && (
                        <Progress value={worldUploadProgress} className="w-full" />
                    )}
                </div>


                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button
                    onClick={handleUpload}
                    disabled={!seedFile || !worldFile || uploading}
                    className="w-full"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? <>Uploading... <LoaderCircle className="animate-spin"/></> : 'Upload Files'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ValheimWorldUpload;