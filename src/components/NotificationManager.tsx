import { useEffect, useState } from 'react';
import { getDaySignature, getPatternsByBranch, analyzeSignature, SignatureEntry } from '@/lib/signature-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bell, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Prediction {
    branch: string;
    topTag: string;
    totalLogs: number;
    relevantSigs: string[];
    isToday: boolean;
}

export function NotificationManager() {
    const { toast } = useToast();
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [dismissed, setDismissed] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    useEffect(() => {
        const checkPatterns = () => {
            const results: Prediction[] = [];

            // Check Today
            const today = new Date();
            const todaySig = getDaySignature(today);
            const todayBranch = todaySig.slice(-1);
            const todayMatches = getPatternsByBranch(todayBranch);

            if (todayMatches.length > 0) {
                const analysis = analyzeSignature(todayMatches.flatMap(m => m.entries));
                if (analysis) {
                    results.push({
                        branch: todayBranch,
                        topTag: analysis.topTag,
                        totalLogs: analysis.totalLogs,
                        relevantSigs: todayMatches.map(m => m.signature),
                        isToday: true
                    });
                }
            }

            // Check Tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowSig = getDaySignature(tomorrow);
            const tomorrowBranch = tomorrowSig.slice(-1);
            const tomorrowMatches = getPatternsByBranch(tomorrowBranch);

            if (tomorrowMatches.length > 0) {
                const analysis = analyzeSignature(tomorrowMatches.flatMap(m => m.entries));
                if (analysis) {
                    results.push({
                        branch: tomorrowBranch,
                        topTag: analysis.topTag,
                        totalLogs: analysis.totalLogs,
                        relevantSigs: tomorrowMatches.map(m => m.signature),
                        isToday: false
                    });
                }
            }

            setPredictions(results);
        };

        checkPatterns();
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
            new Notification("Lunar Calendar", {
                body: "Reminders are now active!",
                icon: "/favicon.ico"
            });
        }
    };

    useEffect(() => {
        if (predictions.length > 0 && !dismissed && permission === 'granted') {
            const todayStr = new Date().toISOString().slice(0, 10);
            const lastNotified = localStorage.getItem('last-notified-date');

            // Only trigger native notifications if we haven't today
            if (lastNotified !== todayStr) {
                predictions.forEach(p => {
                    new Notification(p.isToday ? "Mindfulness Alert - TODAY" : "Mindfulness Alert - TOMORROW", {
                        body: `${p.isToday ? 'Today' : 'Tomorrow'} is a ${p.branch} day. You have ${p.totalLogs} past logs for this branch (Top: ${p.topTag}). Stay mindful!`,
                        icon: "/favicon.ico"
                    });
                });
                localStorage.setItem('last-notified-date', todayStr);
            }
        }
    }, [predictions, permission, dismissed]);

    if (predictions.length === 0 || dismissed) return null;

    // Show Today's prediction first if available
    const activePrediction = predictions.find(p => p.isToday) || predictions[0];

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
            <Alert className={`shadow-lg border-2 ${activePrediction.isToday ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                <AlertTriangle className={`h-4 w-4 ${activePrediction.isToday ? 'text-red-600' : 'text-amber-600'}`} />
                <div className="flex-1">
                    <AlertTitle className={`${activePrediction.isToday ? 'text-red-800' : 'text-amber-800'} flex items-center gap-2`}>
                        {activePrediction.isToday ? "TODAY'S Pattern Warning" : "Tomorrow's Pattern Warning"}
                        {permission !== 'granted' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-6 w-6 ${activePrediction.isToday ? 'text-red-600 hover:bg-red-100' : 'text-amber-600 hover:bg-amber-100'}`}
                                onClick={requestPermission}
                                title="Enable browser notifications"
                            >
                                <Bell className="h-3 w-3" />
                            </Button>
                        )}
                    </AlertTitle>
                    <AlertDescription className={`${activePrediction.isToday ? 'text-red-700' : 'text-amber-700'} text-sm`}>
                        {activePrediction.isToday ? 'Today' : 'Tomorrow'} is a <span className="font-bold underline">{activePrediction.branch}</span> day.
                        You've logged <span className="font-medium text-amber-900">{activePrediction.topTag}</span> most often on this branch.
                    </AlertDescription>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className={`ml-4 p-1 ${activePrediction.isToday ? 'text-red-400 hover:text-red-600' : 'text-amber-400 hover:text-amber-600'}`}
                >
                    <X className="h-4 w-4" />
                </button>
            </Alert>
        </div>
    );
}
