import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CalendarNote, loadNotes, saveNotes, getNotesForDate } from '@/lib/chinese-calendar';
import { Trash2, Plus } from 'lucide-react';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  date: string; // YYYY-MM-DD
  dateLabel: string;
}

const NoteDialog = ({ open, onClose, date, dateLabel }: NoteDialogProps) => {
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [dateNotes, setDateNotes] = useState<CalendarNote[]>([]);
  const [newText, setNewText] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newReminder, setNewReminder] = useState(false);

  // Load notes when dialog opens
  useEffect(() => {
    if (open) {
      const allNotes = loadNotes();
      setNotes(allNotes);
      setDateNotes(getNotesForDate(allNotes, date));
      setNewText('');
      setNewTime('');
      setNewReminder(false);
    }
  }, [open, date]);

  const addNote = () => {
    if (!newText.trim()) return;
    const note: CalendarNote = {
      id: Date.now().toString(),
      date,
      time: newTime || undefined,
      text: newText.trim(),
      reminder: newReminder,
      createdAt: Date.now(),
    };
    const updated = [...notes, note];
    saveNotes(updated);
    setNotes(updated);
    setDateNotes(getNotesForDate(updated, date));
    setNewText('');
    setNewTime('');
    setNewReminder(false);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
    setNotes(updated);
    setDateNotes(getNotesForDate(updated, date));
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">📝 {dateLabel}</DialogTitle>
        </DialogHeader>

        {/* Existing notes */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {dateNotes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No notes yet for this date</p>
          )}
          {dateNotes.map(note => (
            <div key={note.id} className="flex items-start gap-2 bg-muted rounded-lg p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm">{note.text}</p>
                <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                  {note.time && <span>⏰ {note.time}</span>}
                  {note.reminder && <span className="text-vermillion">🔔 Reminder</span>}
                </div>
              </div>
              <button onClick={() => deleteNote(note.id)} className="text-muted-foreground hover:text-destructive p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new note */}
        <div className="border-t border-border pt-3 space-y-3">
          <Textarea
            placeholder="Write a note or memo..."
            value={newText}
            onChange={e => setNewText(e.target.value)}
            className="resize-none"
            rows={2}
          />
          <div className="flex items-center gap-3">
            <Input
              type="time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className="w-32"
              placeholder="Time"
            />
            <div className="flex items-center gap-2 flex-1">
              <Switch checked={newReminder} onCheckedChange={setNewReminder} />
              <span className="text-xs text-muted-foreground">Reminder</span>
            </div>
            <Button onClick={addNote} size="sm" disabled={!newText.trim()}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
