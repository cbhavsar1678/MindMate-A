import { useState, useEffect, FormEvent } from 'react';
import { MoodLog, MoodType } from '../types';
import { getMoodLogs, saveMoodLogs, calculateWellnessStreak } from '../lib/storage';
import { 
  Smile, Moon, Target, Zap, Flame, 
  Trash2, Plus, Calendar, CheckCircle, 
  RefreshCw, TrendingUp, Sparkles, Sliders 
} from 'lucide-react';

interface MoodTrackerViewProps {
  logs: MoodLog[];
  onLogsChange: (newLogs: MoodLog[]) => void;
}

const MOODS_LIST: { type: MoodType; emoji: string; label: string; score: number; color: string; desc: string }[] = [
  { type: 'happy', emoji: '😊', label: 'Happy / Optimistic', score: 100, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', desc: 'Feeling fully prepared, motivated, and ahead of schedule.' },
  { type: 'calm', emoji: '😌', label: 'Calm / Grounded', score: 85, color: 'text-green-400 bg-green-500/10 border-green-500/30', desc: 'Slight stress but overall study routines are steady.' },
  { type: 'neutral', emoji: '😐', label: 'Neutral / Balanced', score: 65, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30', desc: 'Standard revision pacing. Neither super excited nor down.' },
  { type: 'sad', emoji: '😔', label: 'Sad / Low Energy', score: 40, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', desc: 'Tired from persistent study, worried about rankings.' },
  { type: 'stressed', emoji: '😫', label: 'Stressed / Backlogs', score: 30, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', desc: 'Drowning under test schedules and syllabus pressure.' },
  { type: 'overwhelmed', emoji: '😭', label: 'Overwhelmed / Burnout', score: 15, color: 'text-red-400 bg-red-500/10 border-red-500/30', desc: 'Severe failure worries. Hard to retain text.' }
];

export default function MoodTrackerView({ logs, onLogsChange }: MoodTrackerViewProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral');
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [stressLevel, setStressLevel] = useState<number>(50);
  const [motivationLevel, setMotivationLevel] = useState<number>(65);
  const [focusLevel, setFocusLevel] = useState<number>(60);
  const [energyLevel, setEnergyLevel] = useState<number>(65);
  
  const [successMsg, setSuccessMsg] = useState('');
  const [stats, setStats] = useState({
    dailyScore: 0,
    weeklyScore: 0,
    monthlyScore: 0
  });

  useEffect(() => {
    calculateScores();
  }, [logs]);

  const calculateScores = () => {
    if (logs.length === 0) return;
    
    // Sort logs by date descending
    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    
    // Daily Score (from today's log if exists, otherwise last log)
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(l => l.date === todayStr);
    const daily = todayLog ? todayLog.moodScore : (sortedLogs[0] ? sortedLogs[0].moodScore : 0);

    // Weekly Score (logs from past 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyLogs = logs.filter(log => new Date(log.date) >= oneWeekAgo);
    const weekly = weeklyLogs.length > 0 
      ? weeklyLogs.reduce((acc, current) => acc + current.moodScore, 0) / weeklyLogs.length 
      : 0;

    // Monthly Score (logs from past 30 days)
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const monthlyLogs = logs.filter(log => new Date(log.date) >= oneMonthAgo);
    const monthly = monthlyLogs.length > 0 
      ? monthlyLogs.reduce((acc, current) => acc + current.moodScore, 0) / monthlyLogs.length 
      : 0;

    setStats({
      dailyScore: Math.round(daily),
      weeklyScore: Math.round(weekly),
      monthlyScore: Math.round(monthly)
    });
  };

  const handleSaveLogs = (e: FormEvent) => {
    e.preventDefault();
    
    const todayStr = new Date().toISOString().split('T')[0];
    const matchingMood = MOODS_LIST.find(m => m.type === selectedMood);
    const moodScore = matchingMood ? matchingMood.score : 65;

    // Create entry
    const newLog: MoodLog = {
      id: `m_log_${Date.now()}`,
      date: todayStr,
      mood: selectedMood,
      moodScore,
      stressLevel,
      motivationLevel,
      focusLevel,
      energyLevel,
      sleepHours
    };

    // Filter out previous logs from today to avoid duplicates
    const filteredLogs = logs.filter(log => log.date !== todayStr);
    const newLogsList = [...filteredLogs, newLog];
    
    onLogsChange(newLogsList);
    setSuccessMsg('Your daily wellness metrics were recorded successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteLog = (id: string) => {
    const nextLogs = logs.filter(l => l.id !== id);
    onLogsChange(nextLogs);
  };

  // Get matching explanation of selected mood
  const activeMoodInfo = MOODS_LIST.find(m => m.type === selectedMood);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Daily Mood & Fatigue Tracker</h2>
        <p className="text-slate-400 text-sm">Measure your daily intellectual stamina and keep record of cumulative stress indicators.</p>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="block font-mono text-[10px] text-slate-500 uppercase tracking-widest">TODAY'S STATUS SCORE</span>
            <span className="font-sans font-extrabold text-[#00E676] text-3xl">{stats.dailyScore || '--'}</span>
          </div>
          <TrendingUp className="w-8 h-8 text-[#00E676]/30" />
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="block font-mono text-[10px] text-slate-500 uppercase tracking-widest">7-DAY AVG SCORE</span>
            <span className="font-sans font-extrabold text-[#00E676] text-3xl">{stats.weeklyScore || '--'}</span>
          </div>
          <Smile className="w-8 h-8 text-[#00E676]/30" />
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="block font-mono text-[10px] text-slate-500 uppercase tracking-widest">30-DAY AVG TREND</span>
            <span className="font-sans font-extrabold text-[#00E676] text-3xl">{stats.monthlyScore || '--'}</span>
          </div>
          <Target className="w-8 h-8 text-[#00E676]/30" />
        </div>
      </div>

      {/* Main split: Input form vs Logs list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form panel */}
        <form onSubmit={handleSaveLogs} className="lg:col-span-7 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-md space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Plus className="w-4.5 h-4.5 text-[#00E676]" /> Record Today's Academic Exhaustion
            </h3>
            <p className="text-xs text-slate-400 mt-1">Slight variations occur daily depending on revision cycles and score updates.</p>
          </div>

          {/* Success Dialog */}
          {successMsg && (
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-medium flex items-center gap-2.5 animate-pulse">
              <CheckCircle className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          {/* Emojis selection */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">1. Select Current Emotional Vibe</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {MOODS_LIST.map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSelectedMood(item.type)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    selectedMood === item.type
                      ? 'bg-[#00E676]/25 border-[#00E676] scale-105 shadow-md shadow-[#00E676]/10'
                      : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02] text-slate-400'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-[10px] font-medium block truncate w-full">{item.type}</span>
                </button>
              ))}
            </div>
            
            {activeMoodInfo && (
              <p className="p-3 bg-white/[0.02] rounded-xl border border-white/5 text-xs text-slate-400 italic">
                {activeMoodInfo.desc}
              </p>
            )}
          </div>

          {/* Slider inputs for Sleep, Stress, Motivation, Focus, Energy */}
          <div className="space-y-5 pt-4 border-t border-white/5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00E676]" /> 2. Refine Performance Indicators
            </h4>

            {/* Sleep Hours Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />SleepHours Last Night
                </span>
                <span className="text-cyan-400 font-bold">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={e => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
              />
              <span className="block text-[10px] text-slate-500 font-mono">Recommended sleeping goal is 7-8 hours for exam retention.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Stress Level */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />Stress Level Index
                  </span>
                  <span className="text-orange-400 font-bold">{stressLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stressLevel}
                  onChange={e => setStressLevel(parseInt(e.target.value))}
                  className="w-full accent-orange-400 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              {/* Motivation Level */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00E676]" />Motivation Drive
                  </span>
                  <span className="text-[#00E676] font-bold">{motivationLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={motivationLevel}
                  onChange={e => setMotivationLevel(parseInt(e.target.value))}
                  className="w-full accent-[#00E676] bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              {/* Focus Level */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-purple-400" />Focus / Concentration
                  </span>
                  <span className="text-purple-400 font-bold">{focusLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={focusLevel}
                  onChange={e => setFocusLevel(parseInt(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              {/* Energy Level */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />Physical Stamina
                  </span>
                  <span className="text-yellow-400 font-bold">{energyLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={energyLevel}
                  onChange={e => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full accent-yellow-400 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00E676] to-[#00C853] hover:brightness-105 text-[#0F172A] font-sans font-bold cursor-pointer tracking-wide flex items-center justify-center gap-2"
          >
            Log Entry
          </button>
        </form>

        {/* Logs list panel */}
        <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-6 max-h-[640px] overflow-y-auto">
          <div className="border-b border-white/5 pb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-[#00E676]" /> Log Chronology
            </h3>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 font-mono text-[10px] text-slate-400">{logs.length} Total</span>
          </div>

          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-xs italic text-center py-12">No logs saved. Log your first response on the left!</p>
            ) : (
              [...logs].sort((a, b) => b.date.localeCompare(a.date)).map(log => {
                const moodObj = MOODS_LIST.find(m => m.type === log.mood);
                return (
                  <div key={log.id} className="p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl flex items-center justify-between gap-4 transition-all group">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl bg-white/5 p-2 rounded-xl block">{moodObj?.emoji || '😐'}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-white font-sans capitalize">{log.mood}</p>
                          <span className="text-[9px] font-mono text-slate-500">{log.date}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                          Sleep: {log.sleepHours}h • Stress: {log.stressLevel}% • Focus: {log.focusLevel}%
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
