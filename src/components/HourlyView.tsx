import { SHICHEN, HEAVENLY_STEMS, EARTHLY_BRANCHES, getCurrentShichen, getYearStemBranch, getMonthStemBranch } from '@/lib/chinese-calendar';
import HorseMascot from './HorseMascot';

interface HourlyViewProps {
  selectedDate: Date;
}

// Get the heavenly stem + earthly branch pair for each shichen of a given day
function getDayStemBranchPairs(date: Date) {
  // Simplified: use day-of-year to rotate stems
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const stemOffset = (dayOfYear * 2) % 10; // each day shifts stems by 2
  return SHICHEN.map((shi, i) => {
    const stemIndex = (stemOffset + i) % 10;
    return `${HEAVENLY_STEMS[stemIndex]}${shi.branch}`;
  });
}

const HourlyView = ({ selectedDate }: HourlyViewProps) => {
  const currentHour = new Date().getHours();
  const currentShichen = getCurrentShichen(currentHour);
  const isToday = new Date().toDateString() === selectedDate.toDateString();
  const pairs = getDayStemBranchPairs(selectedDate);

  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dateLabel = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-4 fade-in">
      <h2 className="font-serif text-center text-lg font-semibold mb-0">{dateLabel}</h2>
      <div className="text-center text-sm text-primary font-medium bg-secondary/60 rounded py-1 mb-4">{dayName}</div>

      <div className="flex flex-col items-end pr-4 gap-1">
        {SHICHEN.map((shi, i) => {
          const isCurrent = isToday && i === currentShichen;
          const timeRange = shi.time.replace(':', '').replace('-', '-').replace(':', '');

          return (
            <div
              key={i}
              className={`flex items-baseline gap-2 ${isCurrent ? 'text-primary font-bold' : 'text-primary/80'}`}
            >
              <span className="font-serif text-2xl tracking-wide">{pairs[i]}</span>
              <span className="text-base font-medium">{shi.time}</span>
            </div>
          );
        })}
      </div>

      {/* Summary: Year / Month / Day stem-branch + mascot */}
      {(() => {
        const yearSB = getYearStemBranch(selectedDate.getFullYear());
        const monthSB = getMonthStemBranch(selectedDate.getFullYear(), selectedDate.getMonth());
        // Day stem-branch
        const ref = new Date(2000, 0, 1);
        const diff = Math.floor((selectedDate.getTime() - ref.getTime()) / 86400000);
        const cycle = (((diff % 60) + 60) % 60 + 54) % 60; // Jan 1, 2000 = 戊午 (index 54)
        const dayStem = HEAVENLY_STEMS[cycle % 10];
        const dayBranch = EARTHLY_BRANCHES[cycle % 12];

        return (
          <div className="flex items-end justify-end gap-3 mt-4 pr-4">
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
    </div>
  );
};
export default HourlyView;
