import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, Flame, Activity, Smile, BookOpen, 
  MessageSquare, TrendingUp, Wind, User, 
  GraduationCap, LogOut, Menu, X, Sparkles, Clock 
} from 'lucide-react';

// Components
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import MoodTrackerView from './components/MoodTrackerView';
import JournalView from './components/JournalView';
import AICoachView from './components/AICoachView';
import WellnessAnalyticsView from './components/WellnessAnalyticsView';
import MindfulnessCenterView from './components/MindfulnessCenterView';
import ProfileView from './components/ProfileView';

// Handlers
import { MoodLog, JournalEntry } from './types';
import { 
  getMoodLogs, saveMoodLogs, 
  getJournals, saveJournals, 
  calculateWellnessStreak, 
  seedHistoricalDataIfEmpty 
} from './lib/storage';

export default function App() {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Storage states
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  useEffect(() => {
    // Seed initial mock timeline if empty (ensures dashboards demo beautiful lines right off the bat)
    seedHistoricalDataIfEmpty();
    
    // Load states
    const loadedLogs = getMoodLogs();
    const loadedJournals = getJournals();
    
    setLogs(loadedLogs);
    setJournals(loadedJournals);
    setCurrentStreak(calculateWellnessStreak(loadedLogs));

    // Persist landing launch bypass
    const bypassStr = localStorage.getItem('mindmate_launcher_bypass');
    if (bypassStr === 'true') {
      setIsStarted(true);
    }
  }, []);

  const handleLaunchApp = () => {
    setIsStarted(true);
    localStorage.setItem('mindmate_launcher_bypass', 'true');
  };

  const handleLogChange = (newLogs: MoodLog[]) => {
    setLogs(newLogs);
    saveMoodLogs(newLogs);
    setCurrentStreak(calculateWellnessStreak(newLogs));
  };

  const handleJournalChange = (newJournals: JournalEntry[]) => {
    setJournals(newJournals);
    saveJournals(newJournals);
  };

  const handleNavigateDirect = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const resetLauncherBypass = () => {
    localStorage.removeItem('mindmate_launcher_bypass');
    setIsStarted(false);
    setActiveTab('dashboard');
  };

  // Navigations metadata
  const TABS_CONFIG = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'mood', label: 'Mood Log', icon: <Smile className="w-4 h-4" /> },
    { id: 'journal', label: 'AI Diary', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'coach', label: 'AI Coach', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'analytics', label: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'mindfulness', label: 'Zen Lounge', icon: <Wind className="w-4 h-4" /> },
    { id: 'profile', label: 'Goals & Badges', icon: <GraduationCap className="w-4 h-4" /> }
  ];

  if (!isStarted) {
    return <LandingPage onStart={handleLaunchApp} />;
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans bg-[#0F172A] selection:bg-[#00E676] selection:text-[#0F172A] flex flex-col overflow-x-hidden relative">
      {/* Decorative localized blur lights */}
      <div className="absolute top-[10%] left-[-5%] w-[350px] h-[350px] bg-[#00E676]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[13%] right-[-5%] w-[450px] h-[450px] bg-[#00C853]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Header */}
      <header className="sticky top-4 mx-4 md:mx-8 mt-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl z-40 px-6 py-4 flex items-center justify-between shadow-xl shadow-black/10">
        <div className="flex items-center gap-2.5">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2 bg-[#00E676] rounded-xl shadow-lg shadow-[#00E676]/20">
              <Brain className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                MindMate <span className="text-[#00E676]">AI</span>
              </span>
              <p className="text-[9px] text-[#00E676] font-mono tracking-wider">SECURE STUDY SANDBOX</p>
            </div>
          </div>
        </div>

        {/* Global Streak Indicator Header + Profile info */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-[#00E676]/10 border border-[#00E676]/15 px-3 py-1.5 rounded-xl font-mono text-xs text-[#00E676]">
            <Flame className="w-4 h-4 fill-[#00E676]" />
            <span>Streak: {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</span>
          </div>

          <button
            onClick={resetLauncherBypass}
            className="p-2.5 bg-white/5 hover:bg-white/10 hover:text-red-400 border border-white/5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs text-slate-400"
            title="Landing Page Preview"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Landing</span>
          </button>
        </div>
      </header>

      {/* Main Container Workspace */}
      <div className="flex flex-1 relative max-w-7xl mx-auto w-full px-4 md:px-8 py-8 gap-8 min-h-0">
        
        {/* Desktop Left Sidebar Navigation */}
        <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl h-fit sticky top-28 gap-8">
          <div className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E676] px-2.5 py-1 rounded-lg bg-[#00E676]/10 w-fit block">Aspirant Console</span>
            
            <nav className="space-y-1.5">
              {TABS_CONFIG.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleNavigateDirect(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#00E676] text-[#0F172A] shadow-md shadow-[#00E676]/10 font-bold border border-[#00E676]/10'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-[#0F172A]' : 'text-slate-400'}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <p className="text-[9px] font-mono tracking-wide text-slate-500 mb-1">LOCAL EXAM DATABASE</p>
            <p className="text-[11px] text-slate-400 leading-snug">100% Client Protected. Workspace runs zero tracking metrics.</p>
          </div>
        </aside>

        {/* Mobile Slide-out Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Back backdrop wrapper */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black z-30 md:hidden"
              />

              {/* Sidebar drawer itself */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed top-0 bottom-0 left-0 w-64 bg-[#0F172A] border-r border-white/10 p-6 z-40 flex flex-col justify-between md:hidden"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="font-bold text-[#00E676] text-sm font-mono uppercase tracking-wider">Aspirant Navigation</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <nav className="space-y-1.5">
                    {TABS_CONFIG.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => handleNavigateDirect(tab.id)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all ${
                          activeTab === tab.id
                            ? 'bg-[#00E676]/15 text-white border border-[#00E676]/20'
                            : 'text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        <span className={activeTab === tab.id ? 'text-[#00E676]' : ''}>
                          {tab.icon}
                        </span>
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-4 bg-[#00E676]/5 border border-[#00E676]/10 rounded-xl text-[10px] font-mono text-slate-405 leading-normal">
                  <span className="text-white block font-bold">Secure Local Execution</span>
                  Your diaries and stress trends never scale online.
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Dynamic page content wrapper */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="min-h-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView logs={logs} onNavigate={handleNavigateDirect} />
              )}
              {activeTab === 'mood' && (
                <MoodTrackerView logs={logs} onLogsChange={handleLogChange} />
              )}
              {activeTab === 'journal' && (
                <JournalView journals={journals} onJournalsChange={handleJournalChange} />
              )}
              {activeTab === 'coach' && (
                <AICoachView />
              )}
              {activeTab === 'analytics' && (
                <WellnessAnalyticsView logs={logs} />
              )}
              {activeTab === 'mindfulness' && (
                <MindfulnessCenterView />
              )}
              {activeTab === 'profile' && (
                <ProfileView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
