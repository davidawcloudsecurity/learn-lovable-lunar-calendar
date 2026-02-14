import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLunarDate, getYearStemBranch, getMonthStemBranch } from '@/lib/chinese-calendar';
import HorseMascot from './HorseMascot';

interface MonthlyViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange: (view: 'daily') => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MonthlyView = ({ selectedDate, onDateChange, onViewChange }: MonthlyViewProps) => {
  const year = selectedDate.getFullYear();

  const prevYear = () => onDateChange(new Date(year - 1, 0, 1));
  const nextYear = () => onDateChange(new Date(year + 1, 0, 1));

  const selectMonth = (month: number) => {
    onDateChange(new Date(year, month, 1));
    onViewChange('daily');
  };

  // Get lunar date range label for each Gregorian month
  const getLunarRange = (month: number) => {
    const start = getLunarDate(new Date(year, month, 1));
    const endDay = new Date(year, month + 1, 0).getDate();
    const end = getLunarDate(new Date(year, month, endDay));
    return `${start.monthName}${start.dayName} — ${end.monthName}${end.dayName}`;
  };

  const currentMonth = new Date().getMonth();
  const isCurrentYear = year === new Date().getFullYear();

  return (
    <div className="p-4 fade-in">
      {/* Year navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevYear} className="p-2 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-serif text-lg font-bold">{year}</h2>
        <button onClick={nextYear} className="p-2 hover:bg-muted rounded-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {MONTHS.map((name, i) => {
          const isCurrent = isCurrentYear && i === currentMonth;
          const mSB = getMonthStemBranch(year, i);
          return (
            <button
              key={i}
              onClick={() => selectMonth(i)}
              className={`zodiac-card text-left ${isCurrent ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-serif font-bold text-sm">{name}</span>
                <div className="flex flex-col items-center font-serif text-xs text-primary/70 leading-none">
                  <span>{mSB.full[0]}</span>
                  <span>{mSB.full[1]}</span>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">{getLunarRange(i)}</div>
            </button>
          );
        })}
      </div>

      {/* Y/M Stem-Branch Summary (no day in monthly view) */}
      {(() => {
        const yearSB = getYearStemBranch(year);
        const monthSB = getMonthStemBranch(year, selectedDate.getMonth());
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
            </div>
            <div className="w-16 h-16">
              <HorseMascot />
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default MonthlyView;
