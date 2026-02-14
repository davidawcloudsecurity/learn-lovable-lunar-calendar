import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import {
  MISTAKE_TAGS,
  MistakeTag,
  SignatureEntry,
  getSignatureEntries,
  addSignatureEntry,
  deleteSignatureEntry,
  analyzeSignature,
} from '@/lib/signature-store';

interface SignatureDialogProps {
  open: boolean;
  onClose: () => void;
  signature: string; // e.g. "戊午"
  dateLabel: string;
  dateStr: string; // YYYY-MM-DD for logging
}

const SignatureDialog = ({ open, onClose, signature, dateLabel, dateStr }: SignatureDialogProps) => {
  const [entries, setEntries] = useState<SignatureEntry[]>([]);
  const [selectedTag, setSelectedTag] = useState<MistakeTag | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (open) {
      setEntries(getSignatureEntries(signature));
      setSelectedTag(null);
      setNoteText('');
      setShowHistory(false);
    }
  }, [open, signature]);

  const analysis = useMemo(() => analyzeSignature(entries), [entries]);

  const handleLog = () => {
    if (!selectedTag) return;
    addSignatureEntry(signature, selectedTag, noteText, dateStr);
    setEntries(getSignatureEntries(signature));
    setSelectedTag(null);
    setNoteText('');
  };

  const handleDelete = (id: string) => {
    deleteSignatureEntry(signature, id);
    setEntries(getSignatureEntries(signature));
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2">
            <span className="text-2xl">{signature}</span>
            <span className="text-sm font-normal text-muted-foreground">Day Signature</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">{dateLabel}</p>
        </DialogHeader>

        {/* Warning Panel */}
        {analysis && analysis.totalLogs > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>⚠ Pattern Warning — {signature}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-background/60 rounded p-2">
                <div className="text-muted-foreground">Past logs</div>
                <div className="text-lg font-bold text-foreground">{analysis.totalLogs}</div>
              </div>
              <div className="bg-background/60 rounded p-2">
                <div className="text-muted-foreground">Top pattern</div>
                <div className="text-sm font-semibold text-foreground">{analysis.topTag}</div>
              </div>
            </div>

            {/* Last 3 entries */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Recent entries on this signature:</div>
              {analysis.lastThree.map(e => (
                <div key={e.id} className="text-xs bg-background/60 rounded px-2 py-1.5 flex justify-between items-start">
                  <div>
                    <span className="font-medium">{e.tag}</span>
                    {e.text && <span className="text-muted-foreground"> — {e.text}</span>}
                  </div>
                  <span className="text-muted-foreground shrink-0 ml-2">{e.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full history toggle */}
        {entries.length > 3 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showHistory ? 'Hide' : 'Show'} all {entries.length} entries
          </button>
        )}

        {showHistory && (
          <div className="max-h-32 overflow-y-auto space-y-1">
            {[...entries].sort((a, b) => b.createdAt - a.createdAt).map(e => (
              <div key={e.id} className="flex items-start gap-2 bg-muted rounded px-2 py-1.5 text-xs">
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{e.tag}</span>
                  {e.text && <span className="text-muted-foreground"> — {e.text}</span>}
                  <span className="text-muted-foreground ml-1">({e.date})</span>
                </div>
                <button onClick={() => handleDelete(e.id)} className="text-muted-foreground hover:text-destructive p-0.5 shrink-0">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Log new entry */}
        <div className="border-t border-border pt-3 space-y-3">
          <div className="text-xs font-medium text-muted-foreground">Log behavior pattern:</div>
          <div className="flex flex-wrap gap-1.5">
            {MISTAKE_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors
                  ${selectedTag === tag
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted border-border hover:border-primary/50 text-foreground'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {selectedTag && (
            <>
              <Textarea
                placeholder="Optional note..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                className="resize-none text-sm"
                rows={2}
              />
              <Button onClick={handleLog} size="sm" className="w-full">
                Log to {signature}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
