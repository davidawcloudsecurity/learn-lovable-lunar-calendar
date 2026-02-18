import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import QuizModal from '@/components/QuizModal';
import HorseMascot from '@/components/HorseMascot';
import { Brain, Heart, Shield, Sparkles, CheckCircle2, Calendar } from 'lucide-react';

const OverthinkerLanding = () => {
  const [email, setEmail] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);

  const handleGetStarted = () => {
    setShowQuiz(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-block">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              For Anxious Decision-Makers
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
            Stop <span className="text-primary">Second-Guessing</span> Every Decision
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track your decisions and see which days you make choices you regret. 
            Your personal "green light / red light" calendar for peace of mind.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto pt-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
            />
            <Button 
              onClick={handleGetStarted}
              className="h-12 px-8 text-base font-bold whitespace-nowrap w-full sm:w-auto"
            >
              Find My Pattern
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            $47/year · Start your 30-day experiment
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-3 bg-muted/30 p-4 rounded-lg max-w-2xl mx-auto">
          <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white">
            <HorseMascot />
          </div>
          <p className="text-sm text-muted-foreground italic">
            "I used to replay every decision in my head for days. Now I check my calendar first. 
            If it's a red day, I wait. The anxiety is gone." - Emma, 32
          </p>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Does This Sound Familiar?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="text-4xl mb-4">😰</div>
              <h3 className="font-bold mb-2">"Did I Make the Right Choice?"</h3>
              <p className="text-sm text-muted-foreground">
                You replay decisions in your head for days, weeks, months. The uncertainty is exhausting.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="font-bold mb-2">Analysis Paralysis</h3>
              <p className="text-sm text-muted-foreground">
                You overthink everything. Small decisions feel huge. You're stuck in your head.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-bold mb-2">You Want Data, Not Guesses</h3>
              <p className="text-sm text-muted-foreground">
                You journal, you track, you analyze. But you still don't know which days you make good vs bad decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            What If Your "Bad Days" Follow a Pattern?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Track your decisions against your personal energy calendar. See the pattern. Gain confidence.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Your Personal Risk Calendar</h3>
                <p className="text-muted-foreground">
                  🟢 Green days = High clarity (make important decisions with confidence)
                  <br />
                  🔴 Red days = Low clarity (wait, reflect, don't commit)
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Decision Journal with Context</h3>
                <p className="text-muted-foreground">
                  Log what you decided and how it turned out. The app shows you which day type it was. 
                  Patterns emerge fast.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Pattern Recognition AI</h3>
                <p className="text-muted-foreground">
                  "You regret 80% of decisions made on red days. You're confident about 90% of green day decisions. 
                  Tomorrow is green - good time to decide."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Relief Section */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Imagine This Relief</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            You check your calendar. It's a green day. You make the decision. You don't second-guess it. 
            You move on with your life.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-background p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">80%</div>
              <div className="text-sm text-muted-foreground">Less decision anxiety</div>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">30 days</div>
              <div className="text-sm text-muted-foreground">To see your pattern</div>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">$47</div>
              <div className="text-sm text-muted-foreground">Annual investment in peace of mind</div>
            </div>
          </div>

          <Button onClick={handleGetStarted} size="lg" className="text-lg px-8 py-6">
            Start My 30-Day Experiment
          </Button>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Get Your Personal Calendar</h3>
                <p className="text-muted-foreground">
                  Enter your birth details. We calculate your energy pattern (based on 5,000 years of Chinese astrology).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Track Your Decisions</h3>
                <p className="text-muted-foreground">
                  Each day, log: What did you decide? How do you feel about it? The app tags it with the day type.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">See Your Pattern</h3>
                <p className="text-muted-foreground">
                  After 30 days: "You regret 70% of red day decisions. You're confident about 85% of green day decisions."
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Use It to Decide</h3>
                <p className="text-muted-foreground">
                  Big decision coming up? Check your calendar. Green day = go ahead. Red day = wait 2 days. Simple.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Overthinkers Say</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold">Jessica M.</div>
                  <div className="text-sm text-muted-foreground">Marketing Manager</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "I used to journal obsessively, trying to figure out why some days I felt 'off.' 
                This app showed me the pattern in 3 weeks. Now I just check the color and trust it."
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold">David L.</div>
                  <div className="text-sm text-muted-foreground">Software Engineer</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "I'm a data person. I was skeptical. But after tracking 40 decisions, the correlation was undeniable. 
                Red days = regrets. Green days = confidence. I don't question it anymore."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">Is this just confirmation bias?</h3>
              <p className="text-muted-foreground">
                Maybe! That's why we track. Log your decisions blind (don't look at the color first). 
                After 30 days, check the correlation. If it's random, you'll see it.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">What if I don't believe in astrology?</h3>
              <p className="text-muted-foreground">
                Perfect. Treat it as pattern recognition. Your body has rhythms (sleep, energy, mood). 
                This tracks them. Call it astrology or data science - does it help? That's all that matters.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Will this make me more anxious?</h3>
              <p className="text-muted-foreground">
                Opposite. Anxiety comes from uncertainty. This gives you data. "It's a red day, that's why I feel off. 
                I'll wait to decide." Relief, not anxiety.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">What if I need to decide on a red day?</h3>
              <p className="text-muted-foreground">
                You still can! Red days aren't "bad" - they're just "be extra careful." 
                The calendar is a guide, not a rule. You always have free will.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stop Overthinking. Start Tracking.
          </h2>
          <p className="text-xl mb-8 opacity-90">
            30 days to see your pattern. A lifetime of confident decisions.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            Start My Experiment - $47/year
          </Button>
          <p className="text-sm mt-4 opacity-75">
            Cancel anytime · Your data stays private
          </p>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal open={showQuiz} onOpenChange={setShowQuiz} />
      )}
    </div>
  );
};

export default OverthinkerLanding;
