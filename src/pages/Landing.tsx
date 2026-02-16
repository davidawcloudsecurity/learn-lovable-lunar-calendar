import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Eye, Calendar, BarChart3, Brain } from 'lucide-react';
import HorseMascot from '@/components/HorseMascot';
import { Button } from '@/components/ui/button';
import QuizModal from '@/components/QuizModal';

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
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-neutral-900 overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <HorseMascot small />
          </div>
          <span className="font-sans text-lg font-semibold text-neutral-900">Lunar Calendar</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/app')}
          className="border-green-600 text-green-600 hover:bg-green-50 transition-colors"
        >
          Open App
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-24 max-w-4xl mx-auto text-center">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-600" />
            2026 · Year of the Fire Horse 丙午年
          </div>

          <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-neutral-900 mb-6">
            Make Better Decisions.
            <br />
            <span className="text-green-600">Avoid Costly Mistakes.</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            A daily behavioral forecast that warns you before risky actions — and helps you learn from real outcomes.
          </p>

          <Button
            size="lg"
            onClick={() => setIsQuizOpen(true)}
            className="bg-green-600 text-white hover:bg-green-700 text-base px-8 py-6 rounded-lg shadow-sm transition-all duration-200 group"
          >
            Start Assessment
            <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-sm text-neutral-500 mt-4">
            Free · No sign-up required · PWA ready
          </p>
        </div>
      </section>

      {/* Preview card mockup */}
      <section className="px-6 pb-24 max-w-3xl mx-auto">
        <div className="relative rounded-xl border border-neutral-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xl text-neutral-900">Feb 16, 2026</span>
              <span className="text-neutral-600 text-sm">庚寅月 · 丙午年</span>
            </div>
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <div className="flex items-center gap-2 text-red-700 font-medium text-sm mb-1">
                <Shield className="w-4 h-4" />
                ⚠️ High Risk — Impulsive decisions likely
              </div>
              <p className="text-neutral-600 text-xs">
                This signature historically correlates with emotional spending and rushed commitments. Review past entries before acting.
              </p>
            </div>
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3">
              <div className="flex items-center gap-2 text-green-700 font-medium text-sm mb-1">
                <Eye className="w-4 h-4" />
                Pattern detected: 3 similar entries
              </div>
              <p className="text-neutral-600 text-xs">
                Last occurrence: Dec 17, 2025 — Tagged "Pushed people" and "Trusted too fast"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto bg-neutral-50 -mx-6">
        <div className="px-6 py-16">
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-center text-neutral-900 mb-12">
            Your personal <span className="text-green-600">behavioral radar</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-md transition-all duration-200"
              >
                <f.icon className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto mb-6">
            <HorseMascot />
          </div>
          <h2 className="font-sans text-3xl font-bold text-neutral-900 mb-3">
            Stop repeating the same mistakes
          </h2>
          <p className="text-neutral-600 mb-8">
            Your behavior follows cycles. Start tracking them today.
          </p>
          <Button
            size="lg"
            onClick={() => setIsQuizOpen(true)}
            className="bg-green-600 text-white hover:bg-green-700 text-base px-8 py-6 rounded-lg shadow-sm"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 px-6 py-6 text-center text-sm text-neutral-500">
        <p>Lunar Calendar · 2026 丙午年 · Built with 🐴</p>
      </footer>

      <QuizModal open={isQuizOpen} onOpenChange={setIsQuizOpen} />
    </div>
  );
};

export default Landing;
