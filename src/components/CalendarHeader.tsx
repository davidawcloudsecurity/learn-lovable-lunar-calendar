import HorseMascot from './HorseMascot';
import { getYearZodiac, getYearStemBranch } from '@/lib/chinese-calendar';

export type ViewType = 'hourly' | 'daily' | 'monthly' | 'yearly';

interface CalendarHeaderProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedDate: Date;
}

const VIEWS: { key: ViewType; label: string; cn: string }[] = [
  { key: 'hourly', label: 'Hour', cn: '时' },
  { key: 'daily', label: 'Day', cn: '日' },
  { key: 'monthly', label: 'Month', cn: '月' },
  { key: 'yearly', label: 'Year', cn: '年' },
];

const CalendarHeader = ({ view, onViewChange, selectedDate }: CalendarHeaderProps) => {
  const year = selectedDate.getFullYear();
  const zodiac = getYearZodiac(year);
  const stemBranch = getYearStemBranch(year);

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      {/* Title row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HorseMascot small />
          <div>
            <h1 className="text-lg font-bold leading-tight">Chinese Zodiac Calendar</h1>
            <p className="text-xs text-muted-foreground">
              {year} · {stemBranch.full}年 · {stemBranch.element}{zodiac.cn}年 · {zodiac.emoji} {zodiac.name}
            </p>
          </div>
        </div>
      </div>

      {/* View tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {VIEWS.map(v => (
          <button
            key={v.key}
            onClick={() => onViewChange(v.key)}
            className={`view-tab flex-1 text-center ${
              view === v.key ? 'view-tab-active' : 'view-tab-inactive'
            }`}
          >
            <span className="block text-xs">{v.cn}</span>
            <span className="block text-[10px] opacity-80">{v.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

export default CalendarHeader;
