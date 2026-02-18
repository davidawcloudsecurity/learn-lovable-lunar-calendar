import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface HourlyDialogProps {
  open: boolean;
  onClose: () => void;
  dateLabel: string;
  dateStr: string; // YYYY-MM-DD
}

const HourlyDialog = ({ open, onClose, dateLabel, dateStr }: HourlyDialogProps) => {
  // TODO: Implement hourly view with hour pillars and details
  
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            Hourly Details
          </DialogTitle>
          <p className="text-xs text-muted-foreground">{dateLabel}</p>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Hourly view for {dateStr} - Coming soon!
          </p>
          
          {/* Placeholder for 24 hours / 12 two-hour periods */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Array.from({ length: 12 }, (_, i) => {
              const startHour = i * 2;
              const endHour = startHour + 2;
              return (
                <div key={i} className="border border-border rounded p-2">
                  <div className="font-medium">{startHour}:00 - {endHour}:00</div>
                  <div className="text-muted-foreground">Hour pillar info</div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HourlyDialog;
