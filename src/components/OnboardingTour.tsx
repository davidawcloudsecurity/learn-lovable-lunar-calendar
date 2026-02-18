import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import HorseMascot from './HorseMascot';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

interface OnboardingTourProps {
  open: boolean;
  onComplete: () => void;
}

const TOUR_STEPS = [
  {
    title: "Welcome! Let's Get You Started 🎉",
    content: (
      <div className="space-y-4">
        <p className="text-base leading-relaxed">
          This app helps you spot patterns in your "good days" vs "bad days" using a 5,000-year-old system called BaZi.
        </p>
        <p className="text-base leading-relaxed font-medium">
          Don't worry - you don't need to understand the theory to benefit from it.
        </p>
        <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">
            Think of this like a <span className="font-bold text-foreground">weather forecast for your decisions</span>. 
            Some days are clear skies, some are stormy. We'll show you which is which.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "The Color Code (Most Important!) 🎨",
    content: (
      <div className="space-y-4">
        <p className="text-base mb-4">Each day has a color showing your energy alignment:</p>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 border-l-4 border-green-500 rounded">
            <span className="text-2xl">🟢</span>
            <div>
              <div className="font-bold text-green-900">Green = Go Days</div>
              <div className="text-sm text-green-800">Best for: Important meetings, signing contracts, launching projects</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <span className="text-2xl">🟡</span>
            <div>
              <div className="font-bold text-yellow-900">Yellow = Caution Days</div>
              <div className="text-sm text-yellow-800">Okay for: Routine work, planning, small decisions</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <span className="text-2xl">🔴</span>
            <div>
              <div className="font-bold text-red-900">Red = Wait Days</div>
              <div className="text-sm text-red-800">Avoid: Major commitments. Good for: Research, reflection, rest</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg mt-4">
          <p className="text-sm text-blue-900">
            <span className="font-bold">Real example:</span> "I pitched to an investor on a green day - they said yes! 
            Same pitch on a red day the next week - they seemed annoyed." 🤔
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Those Chinese Characters? 📝",
    content: (
      <div className="space-y-4">
        <p className="text-base leading-relaxed">
          You'll see characters like <span className="font-serif text-xl">甲子</span> or <span className="font-serif text-xl">丙午</span> next to each date.
        </p>
        
        <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
          <p className="text-base font-medium mb-2">Think of them like:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Your daily "weather pattern"</li>
            <li>• A unique energy combination</li>
            <li>• Your personal horoscope for that day</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-base font-bold text-green-900 mb-2">Good news:</p>
          <p className="text-sm text-green-800">
            You don't need to memorize them! The app calculates how they interact with YOUR birth chart 
            and shows you the color-coded result.
          </p>
        </div>

        <p className="text-sm text-muted-foreground italic">
          (Advanced users can study the characters later. For now, just focus on the colors.)
        </p>
      </div>
    ),
  },
  {
    title: "How to Use This App 🎯",
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="border-l-4 border-primary pl-4">
            <div className="font-bold text-base mb-1">Morning (5 seconds)</div>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Open the app</li>
              <li>2. Check today's color</li>
              <li>3. Plan your day accordingly</li>
            </ol>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <div className="font-bold text-base mb-1">Evening (30 seconds)</div>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Tap today's date</li>
              <li>2. Log: 👍 Good / 👎 Rough / 😐 Meh</li>
              <li>3. Add one sentence about what happened</li>
            </ol>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
          <p className="text-sm font-medium text-yellow-900 mb-2">Week 1 Goal:</p>
          <p className="text-sm text-yellow-800">
            Just track what happens. Don't overthink it. Patterns will emerge around day 30.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">What You'll Notice:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• "My 3 worst meetings were all on red days"</li>
            <li>• "I feel more energized on green days"</li>
            <li>• "Red days = more conflicts and regrets"</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "The 30-Day Experiment 🔬",
    content: (
      <div className="space-y-4">
        <p className="text-base leading-relaxed">
          This is an <span className="font-bold">experiment</span>, not a religion. 
          Track your decisions for 30 days and see if there's a pattern.
        </p>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="text-xl">📊</span>
            <div>
              <div className="font-medium">Track:</div>
              <div className="text-sm text-muted-foreground">Important decisions, mood, energy, work productivity</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">👀</span>
            <div>
              <div className="font-medium">Notice:</div>
              <div className="text-sm text-muted-foreground">Do red days correlate with regrets? Green days with wins?</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">🎯</span>
            <div>
              <div className="font-medium">Payoff:</div>
              <div className="text-sm text-muted-foreground">Better decision timing = fewer regrets</div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mt-4">
          <p className="text-sm font-medium mb-2">Remember:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✅ Use it as a guide, not a rule</li>
            <li>✅ You still have free will</li>
            <li>✅ Even 60% accuracy = huge advantage</li>
            <li>✅ Science or mysticism - patterns are patterns</li>
          </ul>
        </div>

        <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
          <p className="text-base font-bold mb-2">Your Challenge:</p>
          <p className="text-sm">
            Track for 30 days. If you see a pattern, you've gained a powerful tool. 
            If you don't, you've lost nothing but gained self-awareness.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "You're Ready! 🚀",
    content: (
      <div className="space-y-4 text-center">
        <div className="w-24 h-24 mx-auto">
          <HorseMascot />
        </div>

        <p className="text-lg font-medium">
          That's everything you need to get started!
        </p>

        <div className="bg-muted/30 p-4 rounded-lg border border-border/50 text-left">
          <p className="font-medium mb-2">Quick Recap:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>🟢 Green = Go days (important stuff)</li>
            <li>🟡 Yellow = Caution days (routine work)</li>
            <li>🔴 Red = Wait days (avoid big decisions)</li>
            <li>📝 Track daily for 30 days</li>
            <li>👀 Watch for patterns</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left">
          <p className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tips:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Tap the Horse mascot anytime for help</li>
            <li>• Right-click days for more options</li>
            <li>• Set up your birth chart in settings for personalized results</li>
            <li>• Check the app each morning (takes 5 seconds)</li>
          </ul>
        </div>

        <p className="text-base font-medium text-primary">
          Let's see if this works for you too! 🐴
        </p>

        <p className="text-xs text-muted-foreground">
          You can replay this tour anytime from Settings → Help & Tutorial
        </p>
      </div>
    ),
  },
];

export default function OnboardingTour({ open, onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStep = TOUR_STEPS[step];
  const isLastStep = step === TOUR_STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-8">
            <h2 className="text-2xl font-bold mb-1">{currentStep.title}</h2>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Step {step + 1} of {TOUR_STEPS.length}
              </div>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[200px]">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((step + 1) / TOUR_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="py-4">
          {currentStep.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip Tour
          </Button>

          <Button onClick={handleNext} className="gap-2">
            {isLastStep ? "Let's Go!" : 'Next'}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
