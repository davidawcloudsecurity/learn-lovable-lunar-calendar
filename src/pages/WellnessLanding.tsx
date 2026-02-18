import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import QuizModal from '@/components/QuizModal';
import HorseMascot from '@/components/HorseMascot';
import { Moon, Sparkles, Heart, Flower2, Sun, Stars } from 'lucide-react';

const WellnessLanding = () => {
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
              For Spiritual Seekers & Wellness Enthusiasts
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
            Stop Fighting Your <span className="text-primary">Natural Rhythms</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track habits with your lunar energy cycles. Build streaks that actually stick. 
            Live in flow with your personal cosmic calendar.
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
              Find My Flow
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            $27/year · Align with your energy
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-3 bg-muted/30 p-4 rounded-lg max-w-2xl mx-auto">
          <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white">
            <HorseMascot />
          </div>
          <p className="text-sm text-muted-foreground italic">
            "I used to force myself to meditate every day. Now I follow my energy calendar. 
            Some days are for action, some for rest. My practice finally feels natural." - Luna, Yoga Teacher
          </p>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-gradient-to-b from-purple-50/50 to-pink-50/50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            You Know Energy Flows in Cycles
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg border border-border shadow-sm">
              <div className="text-4xl mb-4">🌙</div>
              <h3 className="font-bold mb-2">You Track Moon Phases</h3>
              <p className="text-sm text-muted-foreground">
                You know new moons are for setting intentions, full moons for releasing. 
                But what about your personal daily energy?
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border shadow-sm">
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="font-bold mb-2">Habits Feel Forced</h3>
              <p className="text-sm text-muted-foreground">
                Some days your meditation flows. Other days you can't focus. 
                Your workout feels amazing or exhausting. Why?
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border shadow-sm">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-bold mb-2">You Want to Live Aligned</h3>
              <p className="text-sm text-muted-foreground">
                You believe in working with energy, not against it. 
                But you don't have a personal map of your rhythms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Your Personal Energy Map
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Based on your birth chart + 5,000 years of Chinese lunar wisdom
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Moon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Daily Energy Forecast</h3>
                <p className="text-muted-foreground">
                  🟢 High energy days = Perfect for yang activities (exercise, socializing, creating)
                  <br />
                  🔴 Low energy days = Perfect for yin activities (rest, reflection, meditation)
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Habit Tracking with Context</h3>
                <p className="text-muted-foreground">
                  Track meditation, yoga, journaling, sleep. See which practices flow on which day types. 
                  Stop forcing, start flowing.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Personalized Insights</h3>
                <p className="text-muted-foreground">
                  "Your meditation practice is 80% more consistent on Water days. Your energy peaks on Wood days. 
                  Tomorrow is Fire - great for creative work."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-b from-blue-50/50 to-green-50/50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Live in Flow, Not Force</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            When you align with your natural rhythms, everything gets easier
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">3x</div>
              <div className="text-sm text-muted-foreground">More consistent habits</div>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">80%</div>
              <div className="text-sm text-muted-foreground">Less resistance to practice</div>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">30 days</div>
              <div className="text-sm text-muted-foreground">To feel the difference</div>
            </div>
          </div>

          <Button onClick={handleGetStarted} size="lg" className="text-lg px-8 py-6">
            Get My Energy Calendar - $27/year
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
                  We calculate your personal BaZi chart - your energetic blueprint based on birth date and time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Check Your Daily Energy</h3>
                <p className="text-muted-foreground">
                  Each morning, see your energy forecast. High energy day? Schedule your workout. 
                  Low energy day? Perfect for yin yoga and journaling.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Track Your Practices</h3>
                <p className="text-muted-foreground">
                  Log meditation, yoga, sleep quality, mood. The app shows you which practices flow on which days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Flow with Your Rhythm</h3>
                <p className="text-muted-foreground">
                  After 30 days, you'll know your pattern. No more forcing. Just flowing with your natural energy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Wellness Seekers Say</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flower2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold">Maya R.</div>
                  <div className="text-sm text-muted-foreground">Reiki Practitioner</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "I've been tracking moon phases for years, but this is next level. 
                My personal energy map is so accurate it's almost scary. I finally understand my rhythms."
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold">Kai S.</div>
                  <div className="text-sm text-muted-foreground">Meditation Teacher</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "My students ask why some days meditation feels effortless and others it's a struggle. 
                Now I can show them their energy calendar. Game changer."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Elements Section */}
      <div className="py-16 bg-gradient-to-b from-amber-50/50 to-orange-50/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Understand Your Elemental Energy
          </h2>
          
          <div className="grid md:grid-cols-5 gap-4">
            <div className="bg-background p-4 rounded-lg text-center border border-border">
              <div className="text-3xl mb-2">🌳</div>
              <div className="font-bold text-sm">Wood</div>
              <div className="text-xs text-muted-foreground">Growth, creativity</div>
            </div>
            <div className="bg-background p-4 rounded-lg text-center border border-border">
              <div className="text-3xl mb-2">🔥</div>
              <div className="font-bold text-sm">Fire</div>
              <div className="text-xs text-muted-foreground">Action, passion</div>
            </div>
            <div className="bg-background p-4 rounded-lg text-center border border-border">
              <div className="text-3xl mb-2">🏔️</div>
              <div className="font-bold text-sm">Earth</div>
              <div className="text-xs text-muted-foreground">Grounding, stability</div>
            </div>
            <div className="bg-background p-4 rounded-lg text-center border border-border">
              <div className="text-3xl mb-2">⚔️</div>
              <div className="font-bold text-sm">Metal</div>
              <div className="text-xs text-muted-foreground">Clarity, structure</div>
            </div>
            <div className="bg-background p-4 rounded-lg text-center border border-border">
              <div className="text-3xl mb-2">💧</div>
              <div className="font-bold text-sm">Water</div>
              <div className="text-xs text-muted-foreground">Flow, intuition</div>
            </div>
          </div>

          <p className="text-center text-muted-foreground mt-6">
            Each day carries elemental energy. Learn which elements support your practices.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">How is this different from moon calendars?</h3>
              <p className="text-muted-foreground">
                Moon calendars are universal - same for everyone. This is personalized to YOUR birth chart. 
                Your high energy days might be someone else's low energy days.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Do I need to know Chinese astrology?</h3>
              <p className="text-muted-foreground">
                Nope! The app does all the calculations. You just check your daily energy and track your practices. 
                Learn the theory if you want, but it's not required.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Can I use this with my existing practices?</h3>
              <p className="text-muted-foreground">
                Absolutely! This complements moon tracking, Human Design, Ayurveda, or any other system. 
                It's just another layer of self-awareness.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">What if I miss days?</h3>
              <p className="text-muted-foreground">
                No pressure! Even tracking 3-4 days per week is enough to see patterns. 
                This is about flow, not perfection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Stars className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Stop Forcing. Start Flowing.
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Your energy has a rhythm. Let's find it together.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            Get My Energy Calendar - $27/year
          </Button>
          <p className="text-sm mt-4 opacity-75">
            Cancel anytime · Your sacred space, your data
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

export default WellnessLanding;
