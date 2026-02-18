import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import QuizModal from '@/components/QuizModal';
import HorseMascot from '@/components/HorseMascot';
import { TrendingUp, Calendar, Target, BarChart3, CheckCircle2 } from 'lucide-react';

const EntrepreneursLanding = () => {
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
              For Entrepreneurs & Founders
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
            Stop Launching on Your <span className="text-primary">Worst Days</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your birth chart reveals your high-performance windows. Track launches, sales calls, 
            and partnerships against your personal risk calendar.
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
              Get My Calendar
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            $97/year · 60-day money-back guarantee
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-3 bg-muted/30 p-4 rounded-lg max-w-2xl mx-auto">
          <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white">
            <HorseMascot />
          </div>
          <p className="text-sm text-muted-foreground italic">
            "I tracked 100 product launches against BaZi charts. Launches on 'green days' had 3x better conversion. 
            Now I never launch on red days." - Solo Founder
          </p>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ever Wonder Why Some Launches Flop?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="text-4xl mb-4">📉</div>
              <h3 className="font-bold mb-2">Same Product, Different Results</h3>
              <p className="text-sm text-muted-foreground">
                You launch on Tuesday - crickets. Launch the same thing next month - it takes off. Why?
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-bold mb-2">Sales Calls That Go Nowhere</h3>
              <p className="text-sm text-muted-foreground">
                Some days you close every call. Other days, same pitch, everyone says "I'll think about it."
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="font-bold mb-2">Timing Is Everything</h3>
              <p className="text-sm text-muted-foreground">
                You know timing matters, but you're guessing. What if you could see your high-performance windows?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Your Personal Launch Calendar
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Based on 5,000 years of Chinese metaphysics + your own data
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">See Your Risk Windows</h3>
                <p className="text-muted-foreground">
                  🟢 Green days = High-performance windows (launch, pitch, sign contracts)
                  <br />
                  🔴 Red days = High-risk periods (postpone big moves, focus on research)
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Track Your Decisions</h3>
                <p className="text-muted-foreground">
                  Log launches, sales calls, partnerships. See which day types correlate with wins vs regrets.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Get AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  "You close deals 3x better on Harmony days vs Clash days. Next week has 3 green days - plan accordingly."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">The ROI Is Obvious</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            One successful launch timed right = 100x the $97 investment
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-background p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">$97</div>
              <div className="text-sm text-muted-foreground">Annual investment</div>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">3x</div>
              <div className="text-sm text-muted-foreground">Better conversion on green days</div>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">60%</div>
              <div className="text-sm text-muted-foreground">Fewer regretted decisions</div>
            </div>
          </div>

          <Button onClick={handleGetStarted} size="lg" className="text-lg px-8 py-6">
            Get Your Risk Calendar - $97/year
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
                <h3 className="font-bold text-lg mb-2">Enter Your Birth Details</h3>
                <p className="text-muted-foreground">
                  We calculate your personal BaZi chart (like your business horoscope)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Check Before Big Moves</h3>
                <p className="text-muted-foreground">
                  Planning a launch? Sales call? Partnership? Check your calendar first. Green = go, Red = wait.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Track & Learn</h3>
                <p className="text-muted-foreground">
                  Log outcomes. After 30 days, you'll see clear patterns. After 60 days, it's undeniable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Founders Say</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold">Sarah K.</div>
                  <div className="text-sm text-muted-foreground">SaaS Founder</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "I was skeptical, but tracked 10 launches. Green days: 8/10 success. Red days: 2/10. 
                Now I plan everything around this calendar. Worth 100x the price."
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold">Mike T.</div>
                  <div className="text-sm text-muted-foreground">Indie Hacker</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Thought it was woo-woo. Tried it anyway. My close rate on green days is 3x higher. 
                I don't launch on red days anymore. Simple as that."
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
              <h3 className="font-bold mb-2">Is this just astrology?</h3>
              <p className="text-muted-foreground">
                BaZi is 5,000 years of pattern recognition. Call it astrology, call it data science - 
                the question is: does it work? Track for 30 days and see.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">What if I don't believe in this stuff?</h3>
              <p className="text-muted-foreground">
                Perfect. Treat it as an experiment. Track your launches/calls against the calendar. 
                If you see correlation, use it. If not, get a refund. No belief required.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">How accurate is it?</h3>
              <p className="text-muted-foreground">
                Most users report 60-80% correlation between risk levels and outcomes. 
                That's a massive edge in business. Even 60% accuracy = huge advantage.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">What's the guarantee?</h3>
              <p className="text-muted-foreground">
                Track 10 major decisions over 60 days. If you don't see a pattern, full refund. 
                One well-timed launch pays for itself 100x over.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stop Guessing. Start Timing.
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Your next launch could be your best - if you time it right.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            Get My Risk Calendar - $97/year
          </Button>
          <p className="text-sm mt-4 opacity-75">
            60-day money-back guarantee · Cancel anytime
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

export default EntrepreneursLanding;
