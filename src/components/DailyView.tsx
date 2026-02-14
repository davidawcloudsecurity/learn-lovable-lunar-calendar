import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLunarDate, getSolarTerm, HEAVENLY_STEMS, EARTHLY_BRANCHES, SOLAR_TERMS, getYearStemBranch, getMonthStemBranch } from '@/lib/chinese-calendar';
import HorseMascot from './HorseMascot';
import { getDaySignature, signatureHasEntries, loadSignatureStore } from '@/lib/signature-store';
import SignatureDialog from './SignatureDialog';

interface DailyViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Solar term abbreviations
const SOLAR_TERM_ABBR: Record<string, string> = {
  '立春': 'SS', '雨水': 'RW', '惊蛰': 'AI', '春分': 'SE',
  '清明': 'CB', '谷雨': 'GR', '立夏': 'SM', '小满': 'GB',
  '芒种': 'GE', '夏至': 'SS2', '小暑': 'MH', '大暑': 'MjH',
  '立秋': 'SA', '处暑': 'EH', '白露': 'WD', '秋分': 'AE',
  '寒露': 'CD', '霜降': 'FD', '立冬': 'SW', '小雪': 'MS',
  '大雪': 'MjS', '冬至': 'WS', '小寒': 'MC', '大寒': 'MjC',
};

// Get stem+branch for a specific day (simplified sexagenary cycle)
function getDayStemBranch(date: Date) {
  // Use a known reference: Jan 1, 2000 = 甲子 (index 0 in 60-day cycle... approximately)
  const ref = new Date(2000, 0, 1);
  const diff = Math.floor((date.getTime() - ref.getTime()) / 86400000);
  const cycle = (((diff % 60) + 60) % 60 + 54) % 60; // Jan 1, 2000 = 戊午 (index 54)
  const stemIdx = cycle % 10;
  const branchIdx = cycle % 12;
  return `${HEAVENLY_STEMS[stemIdx]}${EARTHLY_BRANCHES[branchIdx]}`;
}

const DailyView = ({ selectedDate, onDateChange }: DailyViewProps) => {
  const [noteDate, setNoteDate] = useState<string | null>(null);
  const [noteLabel, setNoteLabel] = useState('');
  const [noteSignature, setNoteSignature] = useState('');
  const [storeVersion, setStoreVersion] = useState(0);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Build cells including prev/next month outside days
  type CellData = { day: number; isOutside: boolean; date: Date };
  const cells: CellData[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    cells.push({ day: d, isOutside: true, date: new Date(year, month - 1, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isOutside: false, date: new Date(year, month, d) });
  }
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, isOutside: true, date: new Date(year, month + 1, d) });
    }
  }

  const prevMonth = () => onDateChange(new Date(year, month - 1, 1));
  const nextMonth = () => onDateChange(new Date(year, month + 1, 1));

  // Get solar terms for this month
  const monthSolarTerms = SOLAR_TERMS.filter(t => t.month === month + 1);

  const openNote = (day: number, isOutside: boolean) => {
    if (isOutside) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const d = new Date(year, month, day);
    const lunar = getLunarDate(d);
    const sig = getDaySignature(d);
    setNoteSignature(sig);
    setNoteLabel(`${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${lunar.monthName}${lunar.dayName}`);
    setNoteDate(dateStr);
  };

  return (
    <div className="p-2 fade-in">
      {/* Month header */}
      <div className="flex items-center justify-between mb-1 px-1">
        <button onClick={prevMonth} className="p-1 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-serif text-lg font-semibold">
          {selectedDate.toLocaleDateString('en-US', { month: 'long' })}, {year}
        </h2>
        <button onClick={nextMonth} className="p-1 hover:bg-muted rounded-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-center text-sm font-bold text-primary py-1">{w}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const lunar = getLunarDate(cell.date);
          const stemBranch = getDayStemBranch(cell.date);
          const m = cell.date.getMonth() + 1;
          const d = cell.date.getDate();
          const solarTerm = getSolarTerm(m, d);
          const dateStr = cell.isOutside ? '' : `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
          const isToday = !cell.isOutside && dateStr === todayStr;
          const sig = getDaySignature(cell.date);
          const hasEntries = !cell.isOutside && signatureHasEntries(sig);
          const lunarLabel = lunar.day === 1 ? `lm ${lunar.month}` : lunar.dayName;
          const solarAbbr = solarTerm ? SOLAR_TERM_ABBR[solarTerm.name] || solarTerm.name : null;

          return (
            <button
              key={i}
              onClick={() => openNote(cell.day, cell.isOutside)}
              className={`relative border border-border/40 p-0.5 min-h-[3.8rem] flex flex-col text-left transition-colors
                ${cell.isOutside ? 'opacity-40' : 'hover:bg-primary/5'}
                ${isToday ? 'bg-secondary/70' : ''}
              `}
            >
              {/* Top row: day number + stem-branch */}
              <div className="flex justify-between items-start w-full">
                <span className={`text-base font-bold leading-tight ${cell.isOutside ? 'text-muted-foreground' : ''}`}>
                  {cell.day}
                </span>
                <div className="flex flex-col items-center font-serif text-[10px] text-muted-foreground leading-none">
                  <span>{stemBranch[0]}</span>
                  <span>{stemBranch[1]}</span>
                </div>
              </div>

              {/* Bottom: lunar day or solar term */}
              <div className="mt-auto">
                {solarAbbr ? (
                  <span className="text-[10px] font-bold text-accent leading-tight">{solarAbbr}</span>
                ) : (
                  <span className="text-[10px] text-primary leading-tight">{lunarLabel}</span>
                )}
              </div>

              {hasEntries && (
                <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Solar terms for this month at the bottom */}
      {monthSolarTerms.length > 0 && (
        <div className="mt-3 px-1 text-xs text-muted-foreground space-y-0.5">
          {monthSolarTerms.map(t => (
            <div key={t.name}>{t.day} — {t.en} ({t.name})</div>
          ))}
        </div>
      )}

      {/* Y/M/D Stem-Branch Summary */}
      {(() => {
        const yearSB = getYearStemBranch(year);
        const monthSB = getMonthStemBranch(year, month);
        const ref = new Date(2000, 0, 1);
        const diff = Math.floor((selectedDate.getTime() - ref.getTime()) / 86400000);
        const cycle = (((diff % 60) + 60) % 60 + 54) % 60;
        const dayStem = HEAVENLY_STEMS[cycle % 10];
        const dayBranch = EARTHLY_BRANCHES[cycle % 12];
        return (
          <div className="flex items-end justify-end gap-3 mt-4 pr-2">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-baseline gap-2.5 text-primary/80">
                <span className="font-serif text-2xl tracking-wide">{yearSB.full}</span>
                <span className="text-xs font-medium text-muted-foreground">Y</span>
              </div>
              <div className="flex items-baseline gap-2.5 text-primary/80">
                <span className="font-serif text-2xl tracking-wide">{monthSB.full}</span>
                <span className="text-xs font-medium text-muted-foreground">M</span>
              </div>
              <div className="flex items-baseline gap-2.5 text-primary/80">
                <span className="font-serif text-2xl tracking-wide">{dayStem}{dayBranch}</span>
                <span className="text-xs font-medium text-muted-foreground">D</span>
              </div>
            </div>
            <div className="w-16 h-16">
              <HorseMascot />
            </div>
          </div>
        );
      })()}

      {noteDate && (
        <SignatureDialog
          open={!!noteDate}
          onClose={() => { setNoteDate(null); setStoreVersion(v => v + 1); }}
          signature={noteSignature}
          dateStr={noteDate}
          dateLabel={noteLabel}
        />
      )}
    </div>
  );
};

export default DailyView;
