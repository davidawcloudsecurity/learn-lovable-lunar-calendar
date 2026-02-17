import { useEffect, useState, useRef } from 'react';
import { getDaySignature, getPatternsByBranch, analyzeSignature, SignatureEntry } from '@/lib/signature-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bell, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { loadProfile, getProfileBranches } from '@/lib/bazi-profile';
import { calculateRiskLevel, RiskLevel } from '@/lib/bazi-calculator';

interface Prediction {
    branch: string;
    topTag: string;
    totalLogs: number;
    relevantSigs: string[];
    isToday: boolean;
    riskLevel: RiskLevel;
    riskReason: string;
}

export function NotificationManager() {
    const { toast } = useToast();
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [dismissed, setDismissed] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );
    
    // Swipe/drag gesture state
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const checkPatterns = () => {
            const results: Prediction[] = [];
            const profile = loadProfile();
            const userBranches = getProfileBranches(profile);

            // Check Today
            const today = new Date();
            const todaySig = getDaySignature(today);
            const todayBranch = todaySig.slice(-1);
            const todayMatches = getPatternsByBranch(todayBranch);

            console.log('Notification Check - Today:', todaySig, 'Branch:', todayBranch, 'Matches:', todayMatches.length);

            if (todayMatches.length > 0) {
                const analysis = analyzeSignature(todayMatches.flatMap(m => m.entries));
                if (analysis) {
                    const riskInfo = userBranches.length > 0
                        ? calculateRiskLevel(todayBranch, userBranches)
                        : { level: 'high' as RiskLevel, emoji: '🔴', reason: 'No profile' };
                    
                    results.push({
                        branch: todayBranch,
                        topTag: analysis.topTag,
                        totalLogs: analysis.totalLogs,
                        relevantSigs: todayMatches.map(m => m.signature),
                        isToday: true,
                        riskLevel: riskInfo.level,
                        riskReason: riskInfo.reason
                    });
                }
            }

            // Check Tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowSig = getDaySignature(tomorrow);
            const tomorrowBranch = tomorrowSig.slice(-1);
            const tomorrowMatches = getPatternsByBranch(tomorrowBranch);

            console.log('Notification Check - Tomorrow:', tomorrowSig, 'Branch:', tomorrowBranch, 'Matches:', tomorrowMatches.length);

            if (tomorrowMatches.length > 0) {
                const analysis = analyzeSignature(tomorrowMatches.flatMap(m => m.entries));
                if (analysis) {
                    const riskInfo = userBranches.length > 0
                        ? calculateRiskLevel(tomorrowBranch, userBranches)
                        : { level: 'medium' as RiskLevel, emoji: '🟡', reason: 'No profile' };
                    
                    results.push({
                        branch: tomorrowBranch,
                        topTag: analysis.topTag,
                        totalLogs: analysis.totalLogs,
                        relevantSigs: tomorrowMatches.map(m => m.signature),
                        isToday: false,
                        riskLevel: riskInfo.level,
                        riskReason: riskInfo.reason
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

    // Determine colors based on risk level
    const getColors = (level: RiskLevel) => {
        switch (level) {
            case 'low':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    icon: 'text-green-600',
                    title: 'text-green-800',
                    desc: 'text-green-700',
                    hover: 'hover:bg-green-100',
                    button: 'text-green-400 hover:text-green-600'
                };
            case 'medium':
                return {
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    icon: 'text-amber-600',
                    title: 'text-amber-800',
                    desc: 'text-amber-700',
                    hover: 'hover:bg-amber-100',
                    button: 'text-amber-400 hover:text-amber-600'
                };
            case 'high':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    icon: 'text-red-600',
                    title: 'text-red-800',
                    desc: 'text-red-700',
                    hover: 'hover:bg-red-100',
                    button: 'text-red-400 hover:text-red-600'
                };
        }
    };

    const colors = getColors(activePrediction.riskLevel);

    // Touch gesture handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const deltaX = e.touches[0].clientX - touchStartX.current;
        const deltaY = e.touches[0].clientY - touchStartY.current;
        
        // Only track horizontal swipes (ignore vertical scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setSwipeOffset(deltaX);
        }
    };

    const handleTouchEnd = () => {
        const threshold = 100; // pixels to trigger dismiss
        
        if (Math.abs(swipeOffset) > threshold) {
            setDismissed(true);
        }
        
        setSwipeOffset(0);
    };

    // Mouse drag handlers (for desktop)
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        touchStartX.current = e.clientX;
        touchStartY.current = e.clientY;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - touchStartX.current;
        const deltaY = e.clientY - touchStartY.current;
        
        // Only track horizontal drags
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setSwipeOffset(deltaX);
        }
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        
        const threshold = 100;
        
        if (Math.abs(swipeOffset) > threshold) {
            setDismissed(true);
        }
        
        setSwipeOffset(0);
        setIsDragging(false);
    };

    return (
        <div 
            className="fixed bottom-4 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 transition-transform cursor-grab active:cursor-grabbing"
            style={{
                transform: `translateX(${swipeOffset}px)`,
                opacity: Math.max(0.5, 1 - Math.abs(swipeOffset) / 300),
                userSelect: 'none'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <Alert className={`shadow-lg border-2 ${colors.bg} ${colors.border}`}>
                <AlertTriangle className={`h-4 w-4 ${colors.icon}`} />
                <div className="flex-1">
                    <AlertTitle className={`${colors.title} flex items-center gap-2`}>
                        {activePrediction.isToday ? "TODAY'S Pattern Warning" : "Tomorrow's Pattern Warning"}
                        {permission !== 'granted' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-6 w-6 ${colors.icon} ${colors.hover}`}
                                onClick={requestPermission}
                                title="Enable browser notifications"
                            >
                                <Bell className="h-3 w-3" />
                            </Button>
                        )}
                    </AlertTitle>
                    <AlertDescription className={`${colors.desc} text-sm`}>
                        {activePrediction.isToday ? 'Today' : 'Tomorrow'} is a <span className="font-bold underline">{activePrediction.branch}</span> day ({activePrediction.riskReason}).
                        You've logged <span className="font-medium text-amber-900">{activePrediction.topTag}</span> most often on this branch.
                    </AlertDescription>
                </div>
            </Alert>
        </div>
    );
}
