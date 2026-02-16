import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Trash2, AlertTriangle, ChevronDown, ChevronUp, Settings, Plus, X } from 'lucide-react';
import {
  MistakeTag,
  SignatureEntry,
  getSignatureEntries,
  addSignatureEntry,
  deleteSignatureEntry,
  analyzeSignature,
  loadCustomTags,
  addCustomTag,
  deleteCustomTag,
  loadSignatureStore,
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
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<MistakeTag | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  useEffect(() => {
    if (open) {
      setEntries(getSignatureEntries(signature));
      setAvailableTags(loadCustomTags());
      setSelectedTag(null);
      setNoteText('');
      setShowHistory(false);
      setIsManageMode(false);
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

  const handleAddTag = () => {
    if (addCustomTag(newTagInput)) {
      setAvailableTags(loadCustomTags());
      setNewTagInput('');
    }
  };

  const handleDeleteTag = (tag: string) => {
    // Check for usage before deleting
    const allSignatures = loadSignatureStore();
    let usageCount = 0;

    Object.values(allSignatures).forEach(sigData => {
      sigData.entries.forEach(entry => {
        if (entry.tag === tag) {
          usageCount++;
        }
      });
    });

    if (usageCount > 0) {
      const confirmed = window.confirm(
        `The tag "${tag}" is currently used in ${usageCount} entries. Are you sure you want to delete it? This will leave existing entries with an unknown tag.`
      );
      if (!confirmed) return;
    }

    deleteCustomTag(tag);
    setAvailableTags(loadCustomTags());
    if (selectedTag === tag) setSelectedTag(null);
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2">
            <span className="text-3xl">{signature}</span>
            <span className="text-base font-normal text-muted-foreground">Day Signature</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{dateLabel}</p>
        </DialogHeader>

        {/* Warning Panel */}
        {analysis && analysis.totalLogs > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>⚠ Pattern Warning — {signature}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-background/60 rounded p-2">
                <div className="text-muted-foreground">Past logs</div>
                <div className="text-xl font-bold text-foreground">{analysis.totalLogs}</div>
              </div>
              <div className="bg-background/60 rounded p-2">
                <div className="text-muted-foreground">Top pattern</div>
                <div className="text-base font-semibold text-foreground">{analysis.topTag}</div>
              </div>
            </div>

            {/* Last 3 entries */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Recent entries on this signature:</div>
              {analysis.lastThree.map(e => (
                <div key={e.id} className="text-sm bg-background/60 rounded px-2 py-1.5 flex justify-between items-start">
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
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Log behavior pattern:</div>
            <button
              onClick={() => setIsManageMode(!isManageMode)}
              className={`p-1 rounded-md transition-colors ${isManageMode ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
              title="Manage Pattern Tags"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {isManageMode && (
            <div className="flex gap-2">
              <Input
                placeholder="New pattern tag..."
                value={newTagInput}
                onChange={e => setNewTagInput(
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')           // spaces to hyphens
                    .replace(/[^a-z0-9-]/g, '')     // remove special chars (optional)
                    .replace(/-+/g, '-')            // multiple hyphens to single
                    .replace(/^-|-$/g, '')          // remove leading/trailing hyphens
                )}                
                className="h-9 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button size="sm" onClick={handleAddTag} className="h-9">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {availableTags.map(tag => (
              <div key={tag} className="relative group">
                <button
                  onClick={() => !isManageMode && setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-sm px-2.5 py-1.5 rounded-full border transition-colors
                    ${selectedTag === tag
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted border-border hover:border-primary/50 text-foreground'
                    } ${isManageMode ? 'cursor-default pr-7' : ''}`}
                >
                  {tag}
                </button>
                {isManageMode && (
                  <button
                    onClick={() => handleDeleteTag(tag)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {!isManageMode && selectedTag && (
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
