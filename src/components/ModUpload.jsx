import {useAuth} from "@/context/AuthContext.jsx";
import React, {useState} from "react";
import {KubeApiClient} from "@/lib/api";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {LoaderCircle, Upload} from "lucide-react";

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB in bytes


const ModUpload = ({ onUploadComplete }) => {
    const {user} = useAuth()
    const [modFile, setModFile] = useState(null);
    const [error, setError] = useState('');
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.name.endsWith('.zip')) {
            setError('Mod file must be a .zip file');
            return;
        }

        const sizeError = validateFileSize(file);
        if (sizeError) {
            setError(sizeError);
            event.target.value = ''; // Reset file input
            return;
        }

        setError('');
        setModFile(file)
    };

    const handleUpload = async () => {
        if (!modFile) {
            setError('Please select a mod zip to upload');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const res = await apiClient.generatePresignedUrls([{
                name: modFile.name,
                size: modFile.size,
                prefix: `mods/${user.discordId}/${modFile.name}`
            }])

            await fetch(res.urls[modFile.name], {
                method: 'PUT',
                body: modFile
            })

            setModFile(null)
            onUploadComplete({
                id: modFile.name + "_" + modFile.size,
                name: modFile.name.slice(0, -4),
                size: formatFileSize(modFile.size),
                default: false,
                installed: false,
                installing: false
            })
        } catch (err) {
            setError('Failed to upload mod file: ' + err.message);
        } finally {
            setUploading(false)
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Upload Valheim Mod</CardTitle>
                <CardDescription>
                    Select your Valheim mod zip file.
                    <br />
                    Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
                    <br />
                    <br />
                    Mod files must have the dll, configuration, or any required files for the mod in the root of the zip.
                    I.e: Highlight the mod files  > "Compress To" > "Zip File"
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="mod-file" className="block text-sm font-medium">
                        Mod File (.zip)
                    </label>
                    <input
                        id="mod-file"
                        type="file"
                        accept=".zip"
                        onChange={(e) => handleFileChange(e)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {modFile && (
                        <p className="text-sm text-green-600">
                            Selected: {modFile.name} ({formatFileSize(modFile.size)})
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
                    disabled={!modFile || uploading}
                    className="w-full"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? <>Uploading... <LoaderCircle className="animate-spin"/></> : 'Upload Files'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ModUpload;