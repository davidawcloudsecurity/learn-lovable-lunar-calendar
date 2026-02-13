import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLunarDate } from '@/lib/chinese-calendar';

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
          return (
            <button
              key={i}
              onClick={() => selectMonth(i)}
              className={`zodiac-card text-left ${isCurrent ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="font-serif font-bold text-sm">{name}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{getLunarRange(i)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyView;
