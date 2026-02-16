import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Eye, Calendar, BarChart3, Brain } from 'lucide-react';
import HorseMascot from '@/components/HorseMascot';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Shield,
    title: 'Risk Warnings',
    desc: 'Get daily alerts before you make impulsive decisions tied to your behavioral cycle.',
  },
  {
    icon: TrendingUp,
    title: 'Pattern Tracking',
    desc: 'Log real outcomes and see which mistakes repeat on the same 60-day signatures.',
  },
  {
    icon: Eye,
    title: 'BaZi Insights',
    desc: 'Personalized forecasts based on your birth chart — Heavenly Stems & Earthly Branches.',
  },
  {
    icon: Calendar,
    title: 'Dual Calendar',
    desc: 'Gregorian and Chinese lunar dates side by side with solar terms and zodiac info.',
  },
  {
    icon: BarChart3,
    title: 'Behavioral Memory',
    desc: 'Notes indexed by the 干支 cycle — not dates — so patterns surface across years.',
  },
  {
    icon: Brain,
    title: 'Learn From Outcomes',
    desc: 'Tag mistakes, review them when the cycle repeats, and break the loop.',
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ink text-cream overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <HorseMascot small />
          </div>
          <span className="font-serif text-lg font-bold text-cream">Lunar Calendar</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/app')}
          className="border-jade text-jade hover:bg-jade hover:text-cream transition-colors"
        >
          Open App
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-20 max-w-4xl mx-auto text-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-jade/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-jade/30 bg-jade/5 text-jade text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-jade animate-pulse" />
            2026 · Year of the Fire Horse 丙午年
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-cream mb-6">
            Make Better Decisions.
            <br />
            <span className="text-jade">Avoid Costly Mistakes.</span>
          </h1>

          <p className="text-lg sm:text-xl text-cream/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            A daily behavioral forecast that warns you before risky actions — and helps you learn from real outcomes.
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/app')}
            className="bg-jade text-cream hover:bg-jade-light hover:text-ink text-base px-8 py-6 rounded-xl shadow-lg shadow-jade/20 transition-all duration-300 group"
          >
            Open Calendar
            <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-sm text-cream/30 mt-4">
            Free · No sign-up required · PWA ready
          </p>
        </div>
      </section>

      {/* Preview card mockup */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div className="relative rounded-2xl border border-jade/20 bg-jade-dark/30 backdrop-blur-sm p-6 shadow-2xl shadow-jade/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-vermillion/70" />
            <div className="w-3 h-3 rounded-full bg-gold/70" />
            <div className="w-3 h-3 rounded-full bg-jade/70" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl text-cream">Feb 16, 2026</span>
              <span className="font-serif text-jade text-sm">庚寅月 · 丙午年</span>
            </div>
            <div className="rounded-lg bg-vermillion/10 border border-vermillion/30 px-4 py-3">
              <div className="flex items-center gap-2 text-vermillion font-medium text-sm mb-1">
                <Shield className="w-4 h-4" />
                ⚠️ High Risk — Impulsive decisions likely
              </div>
              <p className="text-cream/50 text-xs">
                This signature historically correlates with emotional spending and rushed commitments. Review past entries before acting.
              </p>
            </div>
            <div className="rounded-lg bg-jade/10 border border-jade/30 px-4 py-3">
              <div className="flex items-center gap-2 text-jade font-medium text-sm mb-1">
                <Eye className="w-4 h-4" />
                Pattern detected: 3 similar entries
              </div>
              <p className="text-cream/50 text-xs">
                Last occurrence: Dec 17, 2025 — Tagged "Pushed people" and "Trusted too fast"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center text-cream mb-12">
          Your personal <span className="text-jade">behavioral radar</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-jade/15 bg-jade-dark/20 p-5 hover:border-jade/40 hover:bg-jade-dark/30 transition-all duration-300"
            >
              <f.icon className="w-8 h-8 text-jade mb-3" />
              <h3 className="font-serif text-lg font-semibold text-cream mb-1">{f.title}</h3>
              <p className="text-sm text-cream/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 text-center">
        <div className="max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto mb-6">
            <HorseMascot />
          </div>
          <h2 className="font-serif text-2xl font-bold text-cream mb-3">
            Stop repeating the same mistakes
          </h2>
          <p className="text-cream/50 mb-8">
            Your behavior follows cycles. Start tracking them today.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/app')}
            className="bg-jade text-cream hover:bg-jade-light hover:text-ink text-base px-8 py-6 rounded-xl shadow-lg shadow-jade/20"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-jade/10 px-6 py-6 text-center text-sm text-cream/30">
        <p>Lunar Calendar · 2026 丙午年 · Built with 🐴</p>
      </footer>
    </div>
  );
};

export default Landing;
