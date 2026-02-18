import { useState } from 'react';
import CalendarHeader, { type ViewType } from '@/components/CalendarHeader';
import HourlyView from '@/components/HourlyView';
import DailyView from '@/components/DailyView';
import MonthlyView from '@/components/MonthlyView';
import YearlyView from '@/components/YearlyView';

const Index = () => {
  const [view, setView] = useState<ViewType>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto border-x border-border">
      <CalendarHeader view={view} onViewChange={setView} selectedDate={selectedDate} />

      <main className="flex-1 overflow-y-auto">
        {view === 'hourly' && <HourlyView selectedDate={selectedDate} />}
        {view === 'daily' && <DailyView selectedDate={selectedDate} onDateChange={setSelectedDate} onViewChange={setView} />}
        {view === 'monthly' && (
          <MonthlyView selectedDate={selectedDate} onDateChange={setSelectedDate} onViewChange={setView as any} />
        )}
        {view === 'yearly' && (
          <YearlyView selectedDate={selectedDate} onDateChange={setSelectedDate} onViewChange={setView as any} />
        )}
      </main>

      {/* Footer with current info */}
      <footer className="border-t border-border px-4 py-2 text-center">
        <button
          onClick={() => { setSelectedDate(new Date()); setView('daily'); }}
          className="text-xs text-primary font-medium hover:underline"
        >
          📅 Today
        </button>
      </footer>
    </div>
  );
};

export default Index;
