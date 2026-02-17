import { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { exportAppStoreJson, importAppStoreJson } from '@/lib/signature-store';
import { useToast } from "@/hooks/use-toast";

interface DataManagementDialogProps {
    open: boolean;
    onClose: () => void;
}

export function DataManagementDialog({ open, onClose }: DataManagementDialogProps) {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Reset state when the dialog is opened
    useEffect(() => {
        if (open) {
            setImportStatus('idle');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [open]);

    const handleExport = () => {
        const json = exportAppStoreJson();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `lunar-calendar-backup-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Export Successful",
            description: "Your data has been downloaded as a JSON file.",
        });
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const success = importAppStoreJson(content);

            if (success) {
                setImportStatus('success');
                toast({
                    title: "Import Successful",
                    description: "Your data has been restored. The page will reload.",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setImportStatus('error');
                toast({
                    variant: "destructive",
                    title: "Import Failed",
                    description: "The file is invalid or corrupted.",
                });
            }
        };

        reader.onerror = (e) => {
            console.error('FileReader error:', e);
            setImportStatus('error');
            toast({
                variant: "destructive",
                title: "File Read Error",
                description: "An error occurred while reading the file.",
            });
        };

        reader.onabort = () => {
            console.warn('FileReader aborted');
            setImportStatus('error');
            toast({
                variant: "destructive",
                title: "Read Aborted",
                description: "The file reading process was canceled.",
            });
        };

        reader.readAsText(file);

        // Reset input
        if (event.target) {
            event.target.value = '';
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Data Management</DialogTitle>
                    <DialogDescription>
                        Backup or restore your BaZi profile and behavioral logs.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Backup</h4>
                        <p className="text-xs text-muted-foreground">
                            Download all your local data as a JSON file for safekeeping.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleExport}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                        </Button>
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                        <h4 className="text-sm font-medium">Restore</h4>
                        <p className="text-xs text-muted-foreground text-red-500">
                            Warning: Importing will overwrite all current local data.
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            className="hidden"
                        />
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleImportClick}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Import Data
                        </Button>

                        {importStatus === 'success' && (
                            <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Success! Reloading...</span>
                            </div>
                        )}
                        {importStatus === 'error' && (
                            <div className="flex items-center gap-2 text-xs text-red-600 mt-2">
                                <AlertCircle className="h-3 w-3" />
                                <span>Invalid backup file.</span>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
