import { useEffect, useState } from 'react';
import { getTomorrowBranch, getPatternsByBranch, analyzeSignature, SignatureEntry } from '@/lib/signature-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bell, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function NotificationManager() {
    const { toast } = useToast();
    const [prediction, setPrediction] = useState<{
        branch: string;
        topTag: string;
        totalLogs: number;
        relevantSigs: string[];
    } | null>(null);
    const [dismissed, setDismissed] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    useEffect(() => {
        const tomorrowBranch = getTomorrowBranch();
        const matches = getPatternsByBranch(tomorrowBranch);

        if (matches.length > 0) {
            // Aggregate all entries for this branch to find the top pattern
            const allEntries: SignatureEntry[] = matches.flatMap(m => m.entries);
            const analysis = analyzeSignature(allEntries);

            if (analysis) {
                setPrediction({
                    branch: tomorrowBranch,
                    topTag: analysis.topTag,
                    totalLogs: analysis.totalLogs,
                    relevantSigs: matches.map(m => m.signature),
                });
            }
        }
    }, []);

    const requestPermission = async () => {
        if (typeof Notification === 'undefined') return;
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
            toast({
                title: "Notifications Enabled",
                description: "You will now receive pattern reminders even when the app is in the background.",
            });
            // Test notification
            new Notification("Lunar Calendar", {
                body: "Reminders are now active!",
                icon: "/favicon.ico"
            });
        }
    };

    useEffect(() => {
        if (prediction && !dismissed && permission === 'granted') {
            // Trigger native notification
            new Notification("Mindfulness Alert", {
                body: `Tomorrow is a ${prediction.branch} day. You have ${prediction.totalLogs} past logs for this branch (Top: ${prediction.topTag}). Stay mindful!`,
                icon: "/favicon.ico"
            });
        }
    }, [prediction, permission, dismissed]);

    if (!prediction || dismissed) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
            <Alert className="bg-amber-50 border-amber-200 shadow-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <div className="flex-1">
                    <AlertTitle className="text-amber-800 flex items-center gap-2">
                        Tomorrow's Pattern Warning
                        {permission !== 'granted' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-amber-600 hover:bg-amber-100"
                                onClick={requestPermission}
                                title="Enable browser notifications"
                            >
                                <Bell className="h-3 w-3" />
                            </Button>
                        )}
                    </AlertTitle>
                    <AlertDescription className="text-amber-700 text-sm">
                        Tomorrow is a <span className="font-bold underline">{prediction.branch}</span> day.
                        You've logged <span className="font-medium text-amber-900">{prediction.topTag}</span> most often on this branch.
                    </AlertDescription>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="ml-4 text-amber-400 hover:text-amber-600 p-1"
                >
                    <X className="h-4 w-4" />
                </button>
            </Alert>
        </div>
    );
}
