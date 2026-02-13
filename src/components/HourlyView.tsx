import { SHICHEN, ZODIAC_ANIMALS, getCurrentShichen, EARTHLY_BRANCHES } from '@/lib/chinese-calendar';

interface HourlyViewProps {
  selectedDate: Date;
}

const HourlyView = ({ selectedDate }: HourlyViewProps) => {
  const currentHour = new Date().getHours();
  const currentShichen = getCurrentShichen(currentHour);
  const isToday = new Date().toDateString() === selectedDate.toDateString();

  return (
    <div className="p-4 fade-in">
      <h2 className="font-serif text-lg font-bold mb-1">十二时辰 · Twelve Shichen</h2>
      <p className="text-xs text-muted-foreground mb-4">
        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SHICHEN.map((shi, i) => {
          const animal = ZODIAC_ANIMALS[shi.animal];
          const isCurrent = isToday && i === currentShichen;

          return (
            <div
              key={i}
              className={`zodiac-card relative ${isCurrent ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            >
              {isCurrent && (
                <span className="absolute top-1 right-2 text-[10px] font-medium text-primary">NOW</span>
              )}
              <div className="text-2xl mb-1">{animal.emoji}</div>
              <div className="font-serif font-bold text-sm">{shi.name}</div>
              <div className="text-xs text-muted-foreground">{shi.time}</div>
              <div className="text-xs mt-1">
                <span className="text-primary font-medium">{EARTHLY_BRANCHES[i]}</span>
                <span className="text-muted-foreground"> · {animal.name} · {animal.cn}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyView;
