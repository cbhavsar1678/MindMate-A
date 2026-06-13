import { motion } from 'motion/react';
import { Brain, Flame, Sparkles, Wind, MessageSquare, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen text-slate-100 flex flex-col bg-[#0F172A] selection:bg-[#00E676] selection:text-[#0F172A] overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#00E676]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00C853]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/5 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-[#00C853] to-[#00E676] rounded-xl shadow-lg shadow-[#00E676]/20">
            <Brain className="w-6 h-6 text-[#0F172A]" />
          </div>
          <div>
            <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              MindMate <span className="text-[#00E676]">AI</span>
            </span>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">STUDENT COPILOT</p>
          </div>
        </div>
        <div>
          <button
            onClick={onStart}
            className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all font-sans text-sm font-medium"
          >
            Launch Board
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col lg:flex-row items-center justify-center gap-12 py-16 z-10">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] font-mono text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            FOR JEE, NEET, UPSC, UPSC, CAT & GATE ASPIRANTS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Conquer Exams <br />
            Without Losing Your <br />
            <span className="bg-gradient-to-r from-[#00E676] to-[#00C853] bg-clip-text text-transparent">
              Mental Wellness
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans"
          >
            MindMate AI is your companion for managing academic strain. Predict burnout risk, decode stress triggers with locally compiled sentiment analysis, and reset with custom mindfulness timers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00E676] to-[#00C853] hover:brightness-110 text-[#0F172A] font-sans font-bold rounded-2xl shadow-xl shadow-[#00E676]/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Start Free Tracking
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-sans font-semibold rounded-2xl border border-white/5 hover:border-white/10 transition-all text-center"
            >
              Explore Features
            </a>
          </motion.div>

          <div className="flex items-center justify-center lg:justify-start gap-8 pt-6 border-t border-white/5 max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-xs text-slate-500 font-mono">CLIENT SIDE SECURITY</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-xs text-slate-500 font-mono">API KEYS REQUIRED</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-3xl font-bold text-white">6+</p>
              <p className="text-xs text-slate-500 font-mono">TARGET EXAMS CHRONOLOGY</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Block */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00E676]/10 to-[#00C853]/5 rounded-3xl blur-[40px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6"
          >
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500/65" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/65" />
                <span className="w-3 h-3 rounded-full bg-green-500/65" />
              </div>
              <div className="px-3 py-1 rounded-lg bg-white/5 font-mono text-[10px] text-slate-400">
                DAILY METRIC STATUS
              </div>
            </div>

            {/* Simulated Emotion Level */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" /> Stress Pressure
                </span>
                <span className="text-sm font-bold text-red-400">82% (Critical)</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full w-[82%]" />
              </div>
            </div>

            {/* Sentiment Response Demonstration */}
            <div className="p-4 rounded-2xl bg-white/[0.03] space-y-3 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-[#00E676] font-mono">
                <Sparkles className="w-3.5 h-3.5" /> DIARY SENTIMENT ANALYSIS
              </div>
              <p className="text-xs italic text-slate-300">
                "Mock syllabus backlog is giving me sleepless nights. NEET biology exam is in 10 days and I can't concentrate..."
              </p>
              <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-slate-400">
                <p><strong className="text-white">Detected Triggers:</strong> Exam schedule fatigue, sleep loss.</p>
                <p><strong className="text-white">Relief Action:</strong> Start 4-4-6 breathing in our center now.</p>
              </div>
            </div>

            {/* Breathing Animation preview */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#00E676]/5 border border-[#00E676]/10">
              <div className="w-6 h-6 rounded-full bg-[#00E676]/20 flex items-center justify-center animate-ping">
                <div className="w-3 h-3 rounded-full bg-[#00E676]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-200">Interactive Relaxation Center</p>
                <p className="text-[10px] text-slate-400">Regulate study hyperventilation in 2 minutes</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Feature Catalog Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-white/5 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-sans text-3xl font-bold text-white tracking-tight">
            Engineered Expressly for Academic Resilience
          </h2>
          <p className="text-slate-400 font-sans text-sm md:text-base">
            High stakes shouldn't compromise mental clarity. Build consistent habits with offline-safe diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00E676]/25 transition-all space-y-4">
            <div className="p-3 bg-[#00E676]/10 text-[#00E676] rounded-xl w-fit">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Journal Analysis</h3>
            <p className="text-sm text-slate-400">
              Your words are parsed locally to decode stress indicators, trace performance triggers, and return actionable relief steps without transmitting raw data anywhere.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00E676]/25 transition-all space-y-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Wellness Coach Chat</h3>
            <p className="text-sm text-slate-400">
              An interactive conversational assistant trained with student-centric coping rules for anxieties, focus lapses, and sleep schedules. Always online, completely serverless.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00E676]/25 transition-all space-y-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Mindfulness Center</h3>
            <p className="text-sm text-slate-400">
              Trigger instant calm using the 4-4-6 guided breathing sequencer, 5-4-3-2-1 tactical sensory grounding sequences, or the 2-minute focus resets during revisions.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00E676]/25 transition-all space-y-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Streak & Score Systems</h3>
            <p className="text-sm text-slate-400">
              Combines mood, sleep cycles, self-reported focus, and journaling consistency to form a single, holistic student wellness index with health status ranges.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00E676]/25 transition-all space-y-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Target Countdown</h3>
            <p className="text-sm text-slate-400">
              Keep target exams like JEE Advanced, NEET UG, CAT, GATE, or UPSC Prelims in line. Maintain perspective of remaining blocks without sensory overload.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00E676]/25 transition-all space-y-4">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-xl w-fit">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Safe Emergency Guard</h3>
            <p className="text-sm text-slate-400">
              Immediate triage and resources trigger automatically when persistent hopelessness parameters are detected in journals, routing you to trusted contacts and counselor resources.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/80 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#00E676] font-mono">TRUSTED COPING METRICS</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white">Loved by High-Stakes Exam Aspirants</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <p className="text-slate-300 text-sm italic">
                "Studying 14 hours for JEE Advanced was making me highly anxious. The local mood tracking and the 4-4-6 breathing breathing loop helped me calm my heart before solving test papers."
              </p>
              <div>
                <p className="text-xs font-bold text-white">Ananya R. (IIT Aspirant)</p>
                <span className="text-[10px] text-[#00E676] font-mono">JEE 2026</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <p className="text-slate-300 text-sm italic">
                "Writing my syllabus frustrations in the journal and seeing the potential triggers visual breakdown is insanely helpful. It doesn't send data online, keeping my worries private!"
              </p>
              <div>
                <p className="text-xs font-bold text-white">Kabir S. (Civil Services Candidate)</p>
                <span className="text-[10px] text-[#00E676] font-mono">UPSC Prelims</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <p className="text-slate-300 text-sm italic">
                "The study Pomodoro timer paired with focus levels is great. If I'm stressed, the app automatically suggests reducing study intensity. Genuinely practical recommendations!"
              </p>
              <div>
                <p className="text-xs font-bold text-white">Dr. Rohit K. (PostGrad Competitor)</p>
                <span className="text-[10px] text-[#00E676] font-mono">NEET PG / GATE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-slate-500 text-xs font-mono mt-auto relative z-10">
        <p className="text-slate-400 mb-1">MindMate AI Student Companion — Built for Mental Fortitude</p>
        <p>Private & fully secure client execution • LocalStorage enabled • Safe Space 2026</p>
      </footer>
    </div>
  );
}
