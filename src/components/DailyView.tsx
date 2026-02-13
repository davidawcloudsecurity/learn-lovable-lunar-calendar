import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLunarDate, getSolarTerm, loadNotes, getNotesForDate } from '@/lib/chinese-calendar';
import NoteDialog from './NoteDialog';

interface DailyViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DailyView = ({ selectedDate, onDateChange }: DailyViewProps) => {
  const [noteDate, setNoteDate] = useState<string | null>(null);
  const [noteLabel, setNoteLabel] = useState('');
  const [notes, setNotes] = useState(loadNotes());

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Reload notes when dialog closes
  useEffect(() => {
    if (!noteDate) setNotes(loadNotes());
  }, [noteDate]);

  // Calculate calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => onDateChange(new Date(year, month - 1, 1));
  const nextMonth = () => onDateChange(new Date(year, month + 1, 1));

  const openNote = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const d = new Date(year, month, day);
    const lunar = getLunarDate(d);
    setNoteLabel(`${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${lunar.monthName}${lunar.dayName}`);
    setNoteDate(dateStr);
  };

  return (
    <div className="p-4 fade-in">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-serif text-lg font-bold">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-xs font-medium text-muted-foreground py-1">{w}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;

          const d = new Date(year, month, day);
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const lunar = getLunarDate(d);
          const solarTerm = getSolarTerm(month + 1, day);
          const isToday = dateStr === todayStr;
          const hasNotes = getNotesForDate(notes, dateStr).length > 0;

          return (
            <button
              key={i}
              onClick={() => openNote(day)}
              className={`day-cell min-h-[3.5rem] flex flex-col items-center justify-center ${
                isToday ? 'day-cell-today' : ''
              }`}
            >
              <span className="text-sm font-medium">{day}</span>
              <span className={`text-[10px] leading-tight ${solarTerm ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {solarTerm ? solarTerm.name : lunar.dayName}
              </span>
              {hasNotes && <span className="w-1 h-1 rounded-full bg-vermillion mt-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Note dialog */}
      {noteDate && (
        <NoteDialog
          open={!!noteDate}
          onClose={() => setNoteDate(null)}
          date={noteDate}
          dateLabel={noteLabel}
        />
      )}
    </div>
  );
};

export default DailyView;
