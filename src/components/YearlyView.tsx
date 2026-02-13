import { getYearZodiac, getYearStemBranch, LUNAR_YEAR_RANGES } from '@/lib/chinese-calendar';

interface YearlyViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange: (view: 'monthly') => void;
}

const YearlyView = ({ selectedDate, onDateChange, onViewChange }: YearlyViewProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

  const selectYear = (year: number) => {
    onDateChange(new Date(year, selectedDate.getMonth(), 1));
    onViewChange('monthly');
  };

  return (
    <div className="p-4 fade-in">
      <h2 className="font-serif text-lg font-bold mb-4">十二生肖 · Zodiac Years</h2>

      <div className="grid grid-cols-2 gap-3">
        {years.map(year => {
          const zodiac = getYearZodiac(year);
          const sb = getYearStemBranch(year);
          const isCurrent = year === currentYear;

          return (
            <button
              key={year}
              onClick={() => selectYear(year)}
              className={`zodiac-card text-left ${isCurrent ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{zodiac.emoji}</span>
                <div>
                  <div className="font-serif font-bold text-base">{year}</div>
                  <div className="text-xs font-medium text-primary">{sb.full}年</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {sb.element}{zodiac.cn} · {sb.elementEn} {zodiac.name}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {LUNAR_YEAR_RANGES[year] || ''}
              </div>
              {isCurrent && (
                <span className="inline-block mt-1 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Current Year
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default YearlyView;
