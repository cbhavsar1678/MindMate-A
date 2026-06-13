import { useState, useEffect } from 'react';
import { MoodLog, WellnessScoreBreakdown } from '../types';
import { calculateWellnessScore, calculateWellnessStreak } from '../lib/storage';
import { MOTIVATIONAL_QUOTES } from '../lib/sentiment';
import { 
  Smile, Flame, Target, Zap, Moon, Activity, 
  Sparkles, ShieldAlert, CheckCircle, Clock, 
  ArrowRight, BookOpen, Heart, AlertTriangle 
} from 'lucide-react';

interface DashboardViewProps {
  logs: MoodLog[];
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ logs, onNavigate }: DashboardViewProps) {
  const [wellnessBreakdown, setWellnessBreakdown] = useState<WellnessScoreBreakdown>({
    overallScore: 78,
    moodComponent: 75,
    stressComponent: 80,
    sleepComponent: 70,
    consistencyComponent: 50,
    status: 'Healthy'
  });
  
  const [streak, setStreak] = useState(0);
  const [currentQuote, setCurrentQuote] = useState({ text: '', author: '' });
  
  // Daily wellness task list
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Perform a 4-4-6 breathing exercise to align heart rate', done: false, type: 'mindfulness' },
    { id: '2', text: 'Record today\'s mood levels inside the Mood Tracker', done: false, type: 'mood' },
    { id: '3', text: 'Write down 3 daily academic backlogs in your private journal', done: false, type: 'journal' },
    { id: '4', text: 'Drink 3L of water and take a 10-minute active screen walk', done: false, type: 'health' }
  ]);

  useEffect(() => {
    // Calculate stats on load
    const breakdown = calculateWellnessScore(logs);
    setWellnessBreakdown(breakdown);
    setStreak(calculateWellnessStreak(logs));

    // Choose random motivational quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setCurrentQuote(randomQuote);

    // If logged today, mark mood task as done
    const todayStr = new Date().toISOString().split('T')[0];
    const loggedToday = logs.some(log => log.date === todayStr);
    if (loggedToday) {
      setTasks(prev => prev.map(t => t.id === '2' ? { ...t, done: true } : t));
    }
  }, [logs]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Needs Attention':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'High Stress':
        return 'text-red-400 bg-red-400/10 border-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(log => log.date === todayStr) || logs[logs.length - 1];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Streaks banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
        <div className="space-y-1">
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight">Welcome Back, Student Aspirant!</h2>
          <p className="text-slate-400 text-sm">Let's balance your mental resilience with academic performance goals today.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#00E676]/10 border border-[#00E676]/20 py-2.5 px-4 rounded-2xl">
          <Flame className="w-5 h-5 text-[#00E676] fill-[#00E676]" />
          <div>
            <span className="block font-mono text-xs text-slate-400 tracking-wider">CURRENT STREAK</span>
            <span className="font-sans font-extrabold text-[#00E676]">{streak} {streak === 1 ? 'Day' : 'Days'}</span>
          </div>
        </div>
      </div>

      {/* Wellness Score Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-tr from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
          {/* Ambient accent background blur */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#00E676]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-white/5">
            <div className="space-y-1">
              <span className="text-xs uppercase font-mono tracking-widest text-[#00E676]">Active Stress Triage</span>
              <h3 className="text-xl font-bold text-white">Student Wellness Score</h3>
            </div>
            
            <div className={`px-4 py-1.5 rounded-full border text-xs font-mono font-semibold flex items-center gap-2 ${getStatusColor(wellnessBreakdown.status)}`}>
              <span className={`w-2 h-2 rounded-full ${
                wellnessBreakdown.status === 'Healthy' ? 'bg-emerald-400 animate-pulse' :
                wellnessBreakdown.status === 'Needs Attention' ? 'bg-amber-400 animate-pulse' : 'bg-red-400 animate-pulse'
              }`} />
              {wellnessBreakdown.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="flex items-center gap-6 justify-center md:justify-start">
              <div className="relative flex items-center justify-center">
                {/* SVG circular progress */}
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" className="stroke-white/5 fill-none" strokeWidth="8" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="56" 
                    className="stroke-[#00E676] fill-none transition-all duration-1000" 
                    strokeWidth="8" 
                    strokeDasharray={351.8}
                    strokeDashoffset={351.8 - (351.8 * wellnessBreakdown.overallScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="block text-3xl font-extrabold text-white">{wellnessBreakdown.overallScore}</span>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider">/ 100 INDEX</span>
                </div>
              </div>
              
              <div className="space-y-1 text-slate-300 text-sm">
                <p className="font-bold text-white">Your Emotional Quotient</p>
                <p className="text-xs text-slate-400">
                  {wellnessBreakdown.overallScore >= 75 
                    ? "Great alignment. Your stamina is optimal for handling high mock test frequency." 
                    : wellnessBreakdown.overallScore >= 50 
                    ? "Schedule regular revision breathers. Backlogs are slowly building tension." 
                    : "Caution: Academic overload risk. Please prioritize restorative sleep."}
                </p>
              </div>
            </div>

            {/* Score Component Breakdown bars */}
            <div className="space-y-3 font-mono text-xs">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider pb-1">Wellness Constituents权重</p>
              
              {/* Mood Component */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Mood Regulation (40%)</span>
                  <span className="text-emerald-400">{wellnessBreakdown.moodComponent}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${wellnessBreakdown.moodComponent}%` }} />
                </div>
              </div>

              {/* Stress Component */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Stress Buffering (30%)</span>
                  <span className="text-emerald-400">{wellnessBreakdown.stressComponent}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${wellnessBreakdown.stressComponent}%` }} />
                </div>
              </div>

              {/* Sleep Component */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Sleep Restoration (20%)</span>
                  <span className="text-emerald-400">{wellnessBreakdown.sleepComponent}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00C853]" style={{ width: `${wellnessBreakdown.sleepComponent}%` }} />
                </div>
              </div>

              {/* Consistency Component */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Tracking Frequency (10%)</span>
                  <span className="text-emerald-400">{wellnessBreakdown.consistencyComponent}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00C853]" style={{ width: `${wellnessBreakdown.consistencyComponent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Motivational Quote */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#00E676] to-[#00C853]" />
          <div className="space-y-4">
            <span className="block p-2 bg-[#00E676]/10 rounded-xl w-fit text-[#00E676]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500">Aspirant Quote of the Day</h4>
            <p className="text-slate-200 font-sans italic text-sm leading-relaxed">
              "{currentQuote.text}"
            </p>
          </div>
          <p className="text-xs font-mono text-[#00E676] mt-6 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
            — {currentQuote.author}
          </p>
        </div>
      </div>

      {/* Wellness Dashboard Cards */}
      <div className="space-y-4">
        <h3 className="text-md uppercase font-mono tracking-widest text-[#00E676] flex items-center gap-2">
          <Activity className="w-4 h-4" /> Operational Wellness Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Mood Log Card */}
          <div className="bg-white/[0.03] border border-white/5 hover:border-[#00E676]/30 p-5 rounded-2xl space-y-4 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans text-sm font-medium">Mood 😊</span>
              <span className="p-1 px-2.5 rounded-lg bg-[#00E676]/10 text-[#00E676] text-xs font-mono font-bold">Today</span>
            </div>
            {todayLog ? (
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-white capitalize">{todayLog.mood}</p>
                <p className="text-xs text-slate-400 font-mono">Score: {todayLog.moodScore}/100</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No entry logged today.</p>
            )}
          </div>

          {/* Stress Level Card */}
          <div className="bg-white/[0.03] border border-white/5 hover:border-red-500/30 p-5 rounded-2xl space-y-4 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans text-sm font-medium">Stress Load 😟</span>
              <span className={`w-2.5 h-2.5 rounded-full ${todayLog?.stressLevel > 65 ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
            </div>
            {todayLog ? (
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-white">{todayLog.stressLevel}%</p>
                <p className="text-xs text-slate-400 font-mono">
                  {todayLog.stressLevel > 65 ? '🚨 High pressure' : '🛡️ Controlled'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No metrics recorded.</p>
            )}
          </div>

          {/* Focus Level Card */}
          <div className="bg-white/[0.03] border border-white/5 hover:border-[#00E676]/30 p-5 rounded-2xl space-y-4 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans text-sm font-medium">Focus Factor 🎯</span>
              <Target className="w-4 h-4 text-[#00E676]" />
            </div>
            {todayLog ? (
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-white">{todayLog.focusLevel}%</p>
                <p className="text-xs text-slate-400 font-mono">Engagement</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No focus metrics.</p>
            )}
          </div>

          {/* Energy Level Card */}
          <div className="bg-white/[0.03] border border-white/5 hover:border-[#00C853]/30 p-5 rounded-2xl space-y-4 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans text-sm font-medium">Energy ⚡</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            {todayLog ? (
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-white">{todayLog.energyLevel}%</p>
                <p className="text-xs text-slate-400 font-mono">Stamina level</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No energy logged.</p>
            )}
          </div>

          {/* Sleep Hours Card */}
          <div className="bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 p-5 rounded-2xl space-y-4 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans text-sm font-medium">Sleep 😴</span>
              <Moon className="w-4 h-4 text-cyan-400" />
            </div>
            {todayLog ? (
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-white">{todayLog.sleepHours} Hrs</p>
                <p className="text-xs text-slate-400 font-mono">
                  {todayLog.sleepHours < 6 ? '⚠️ Deprivation risk' : '😴 Restorative rest'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic font-mono">0 hrs logged</p>
            )}
          </div>
        </div>
      </div>

      {/* Main split sections: Pomodoro widget & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Checklist */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-[#00E676]" /> Daily Wellness Checklist
            </span>
            <span className="text-xs font-mono text-slate-500">
              {tasks.filter(t => t.done).length} of {tasks.length} Complete
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  task.done 
                    ? 'bg-[#00E676]/5 border-[#00E676]/10 text-slate-400' 
                    : 'bg-white/[0.01] border-white/5 text-slate-100 hover:bg-white/[0.02]'
                }`}
                onClick={() => toggleTask(task.id)}
              >
                <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all ${
                  task.done 
                    ? 'border-[#00E676] bg-[#00E676] text-[#0F172A]' 
                    : 'border-slate-500 bg-transparent'
                }`}>
                  {task.done && <CheckCircle className="w-3 h-3 text-[#0F172A] stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <p className={`text-xs ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.text}
                  </p>
                  <span className="inline-block mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                    Category: {task.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Panel */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-cyan-400" /> Focus-Relaxation Hub
            </span>
            <span className="text-xs font-mono text-emerald-400">SERVERLESS ASSISTANT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono text-[#00E676] uppercase tracking-wide">AI CHAT COMPANION</span>
                <p className="text-sm font-bold text-slate-200 mt-2">Chat with MindMate AI</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Ask Coping guidelines for fatigue, sleep, exam rules or distraction prevention.</p>
              </div>
              <button 
                onClick={() => onNavigate('coach')}
                className="w-full mt-4 py-2.5 bg-white/5 hover:bg-white/10 text-xs font-sans text-white border border-white/10 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                Access Coach <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wide">MINDFULNESS RELIEF</span>
                <p className="text-sm font-bold text-slate-200 mt-2">Breathing & Relaxation</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Regulate high study pressure. Practice Inhale 4s - Hold 4s - Exhale 6s cycles.</p>
              </div>
              <button 
                onClick={() => onNavigate('mindfulness')}
                className="w-full mt-4 py-2.5 bg-gradient-to-r from-cyan-500/10 to-cyan-500/20 hover:from-cyan-500/20 border border-cyan-500/20 text-xs font-sans text-cyan-300 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                Open Zen Center <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <Heart className="w-8 h-8 text-[#00E676] animate-pulse shrink-0" />
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs font-bold text-white">Struggling with syllabus load?</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Try logging your diaries daily inside the **Wellness Diary** tab. Watch how possible stress patterns update inside the analysis panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
