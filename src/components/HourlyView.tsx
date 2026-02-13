import { SHICHEN, HEAVENLY_STEMS, getCurrentShichen } from '@/lib/chinese-calendar';

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
    </div>
  );
};

export default HourlyView;
