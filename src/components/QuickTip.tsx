import { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';
import HorseMascot from './HorseMascot';

interface QuickTipProps {
  tipKey: string;
  title: string;
  message: string;
  delay?: number;
}

export function QuickTip({ tipKey, title, message, delay = 3000 }: QuickTipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(`tip_${tipKey}_dismissed`);
    
    if (!dismissed) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [tipKey, delay]);

  const handleDismiss = () => {
    localStorage.setItem(`tip_${tipKey}_dismissed`, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 max-w-sm mx-4 bg-primary text-primary-foreground rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-5 z-50">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-primary-foreground/20 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-3 items-start pr-6">
        <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white">
          <HorseMascot small />
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <h3 className="font-bold text-sm">{title}</h3>
          </div>
          
          <p className="text-xs leading-relaxed opacity-90">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
