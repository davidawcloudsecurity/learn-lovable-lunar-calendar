import { useState, useEffect } from 'react';
import CalendarHeader, { type ViewType } from '@/components/CalendarHeader';
import HourlyView from '@/components/HourlyView';
import DailyView from '@/components/DailyView';
import MonthlyView from '@/components/MonthlyView';
import YearlyView from '@/components/YearlyView';
import OnboardingTour from '@/components/OnboardingTour';

const App = () => {
  const [view, setView] = useState<ViewType>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user is new (first time visiting)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    // Disabled: Onboarding popup won't auto-show, but banner will still appear
    // if (!hasSeenOnboarding) {
    //   setShowOnboarding(true);
    // }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  // Handle Android back button to return from hourly to daily view
  useEffect(() => {
    const handlePopState = () => {
      if (view === 'hourly') {
        setView('daily');
      }
    };

    // Push state when entering hourly view (only if not already in history)
    if (view === 'hourly') {
      const currentState = window.history.state;
      if (!currentState || currentState.view !== 'hourly') {
        window.history.pushState({ view: 'hourly' }, '');
      }
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view]);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto border-x border-border">
      <CalendarHeader 
        view={view} 
        onViewChange={setView} 
        selectedDate={selectedDate}
        onShowHelp={() => setShowOnboarding(true)}
      />

      <main className="flex-1 overflow-y-auto">
        {view === 'hourly' && <HourlyView selectedDate={selectedDate} />}
        {view === 'daily' && (
          <DailyView 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
            onViewChange={setView}
            onShowHelp={() => setShowOnboarding(true)}
          />
        )}
        {view === 'monthly' && (
          <MonthlyView 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
            onViewChange={() => setView('daily')} 
          />
        )}
        {view === 'yearly' && (
          <YearlyView 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
            onViewChange={() => setView('monthly')} 
          />
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

      {/* Onboarding Tour */}
      <OnboardingTour open={showOnboarding} onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default App;
