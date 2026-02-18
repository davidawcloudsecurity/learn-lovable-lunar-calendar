import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import HorseMascot from './HorseMascot';

interface BeginnerBannerProps {
  onStartTour?: () => void;
}

export function BeginnerBanner({ onStartTour }: BeginnerBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('beginnerBannerDismissed');
    
    // Show banner if not dismissed (always show, not dependent on onboarding)
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('beginnerBannerDismissed', 'true');
    setVisible(false);
  };

  const handleStartTour = () => {
    handleDismiss();
    onStartTour?.();
  };

  if (!visible) return null;

  return (
    <div className="mx-2 mt-2 mb-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-background/50 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="flex gap-3 items-start pr-6">
        <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white">
          <HorseMascot />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">New to BaZi? Here's the Quick Version</h3>
          </div>
          
          <p className="text-xs text-muted-foreground leading-relaxed">
            🟢 <span className="font-medium">Green days</span> = Great for important decisions
            <br />
            🔴 <span className="font-medium">Red days</span> = Wait on big commitments
            <br />
            📝 <span className="font-medium">Tap any day</span> to log what happened
          </p>

          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="default"
              onClick={handleStartTour}
              className="h-7 text-xs"
            >
              Take 2-Min Tour
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="h-7 text-xs"
            >
              Got It
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
