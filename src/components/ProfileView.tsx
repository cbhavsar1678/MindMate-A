import { useState, useEffect, FormEvent } from 'react';
import { ExamCountdown, AchievementBadge } from '../types';
import { getExams, saveExams, getBadges, clearAllMindMateData, DEFAULT_EXAMS } from '../lib/storage';
import { 
  User, Award, Calendar, Trash2, Plus, 
  CheckCircle, ShieldAlert, Clock, Sparkles, 
  Flame, BookOpen, Wind, Smile, GraduationCap 
} from 'lucide-react';

export default function ProfileView() {
  const [exams, setExams] = useState<ExamCountdown[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('jee');
  const [customExamName, setCustomExamName] = useState('');
  const [customExamDate, setCustomExamDate] = useState('');
  
  const [badges, setBadges] = useState<AchievementBadge[]>([]);
  const [countdownText, setCountdownText] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    setExams(getExams());
    setBadges(getBadges());
  }, []);

  useEffect(() => {
    if (exams.length === 0) return;
    
    // Find active exam
    const activeExam = exams.find(e => e.id === selectedExamId) || exams[0];
    if (!activeExam) return;

    const calculateTime = () => {
      const difference = +new Date(activeExam.examDate) - +new Date();
      if (difference > 0) {
        setCountdownText({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        });
      } else {
        setCountdownText({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // refresh every minute

    return () => clearInterval(interval);
  }, [exams, selectedExamId]);

  const handleAddCustomExam = (e: FormEvent) => {
    e.preventDefault();
    if (!customExamName.trim() || !customExamDate) return;

    const newEx: ExamCountdown = {
      id: `custom_${Date.now()}`,
      examName: customExamName,
      examDate: customExamDate
    };

    const nextExams = [...exams, newEx];
    setExams(nextExams);
    saveExams(nextExams);
    setSelectedExamId(newEx.id);

    setCustomExamName('');
    setCustomExamDate('');
    alert(`Success: ${newEx.examName} countdown created!`);
  };

  const handleDeleteExam = (id: string) => {
    const nextExams = exams.filter(e => e.id !== id);
    setExams(nextExams);
    saveExams(nextExams);
    if (selectedExamId === id && nextExams.length > 0) {
      setSelectedExamId(nextExams[0].id);
    }
  };

  const handlePurge = () => {
    if (confirm('☠️ CRITICAL WARNING: This will immediately delete all logged mood entries, wellness diary files, chatbot histories, streaks, and unlocked badges. This action is IRREVERSIBLE. Proceed?')) {
      clearAllMindMateData();
      alert('Local Database Purged. Reloading application...');
      window.location.reload();
    }
  };

  const getBadgeIcon = (id: string) => {
    switch (id) {
      case 'first_log':
        return <Smile className="w-5 h-5 text-emerald-400" />;
      case 'streak_3':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'streak_7':
        return <Wind className="w-5 h-5 text-purple-400" />;
      case 'reflection':
        return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case 'stress_master':
        return <Sparkles className="w-5 h-5 text-yellow-400" />;
      default:
        return <Award className="w-5 h-5 text-slate-400" />;
    }
  };

  const activeExamObj = exams.find(e => e.id === selectedExamId);

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Student target & achievements</h2>
        <p className="text-slate-400 text-sm">Personalize milestones, review remaining preparation windows, and award yourself badges for diligence.</p>
      </div>

      {/* Countdown Clock (Highlights active exam) */}
      <div className="bg-gradient-to-tr from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00E676]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#00E676] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Active Countdown Target
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {activeExamObj ? activeExamObj.examName : 'No Exam Chosen'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">Date: {activeExamObj ? activeExamObj.examDate : 'YYYY-MM-DD'}</p>
          </div>

          {/* Exam target selection list */}
          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="p-3 bg-[#0F172A] border border-white/10 rounded-xl text-xs text-slate-300 focus:border-[#00E676] focus:outline-none transition-all"
          >
            {exams.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.examName}</option>
            ))}
          </select>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-3 gap-4 text-center pt-8 max-w-lg mx-auto">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <span className="block text-4xl sm:text-5xl font-extrabold text-[#00E676] font-mono tracking-tight">{countdownText.days}</span>
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-widest">DAYS</span>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <span className="block text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">{countdownText.hours}</span>
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-widest">HOURS</span>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <span className="block text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">{countdownText.minutes}</span>
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-widest">MINS</span>
          </div>
        </div>

        <p className="text-center font-mono text-[10px] text-slate-600 mt-6 uppercase tracking-wider">
          ⏳ Countdowns are processed offline relative to local browser time zones
        </p>
      </div>

      {/* Badges Locker + Custom list target spacer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Badges Locker Display */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Milestones & Achievement Badges</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">{badges.filter(b => b.unlocked).length} of {badges.length} Unlocked</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map(badge => (
              <div 
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex gap-3 items-center ${
                  badge.unlocked 
                    ? 'bg-[#00E676]/5 border-[#00E676]/20' 
                    : 'bg-white/[0.01] border-white/5 opacity-60'
                }`}
              >
                <div className={`p-3 rounded-xl shrink-0 ${badge.unlocked ? 'bg-[#00E676]/10' : 'bg-white/5'}`}>
                  {getBadgeIcon(badge.id)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{badge.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{badge.description}</p>
                  {badge.unlocked && (
                    <span className="block font-mono text-[8px] text-[#00E676] mt-1">Unlocked: {badge.unlockedAt}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Exam Creator + Purge Database Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Custom exam scheduler */}
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4.5 h-4.5 text-[#00E676]" /> Target Scheduler
            </h3>

            <form onSubmit={handleAddCustomExam} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Exam Title</label>
                <input
                  type="text"
                  required
                  value={customExamName}
                  onChange={e => setCustomExamName(e.target.value)}
                  placeholder="e.g. UPSC CSE Main, CAT 2026..."
                  className="w-full p-2.5 bg-[#0F172A] border border-white/5 rounded-xl text-xs text-white focus:border-[#00E676] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Target Date</label>
                <input
                  type="date"
                  required
                  value={customExamDate}
                  onChange={e => setCustomExamDate(e.target.value)}
                  className="w-full p-2.5 bg-[#0F172A] border border-white/5 rounded-xl text-xs text-white focus:border-[#00E676] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-sans text-white border border-white/10 transition-all font-semibold"
              >
                Track Schedule
              </button>
            </form>
          </div>

          {/* Exam Manager list */}
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E676]">Exam Database</h3>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {exams.map(ex => (
                <div key={ex.id} className="p-2.5 bg-[#0F172A] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">{ex.examName}</p>
                    <span className="text-[9px] font-mono text-slate-500">{ex.examDate}</span>
                  </div>
                  {!DEFAULT_EXAMS.some(def => def.id === ex.id) && (
                    <button
                      onClick={() => handleDeleteExam(ex.id)}
                      className="p-1 text-slate-500 hover:text-red-400"
                      title="Delete Scheduler"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone local clearance */}
          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold">
              <ShieldAlert className="w-4.5 h-4.5" /> CRITICAL ZONE
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Clear all locally stored indicators, diagnostic history files, unlocked milestones and conversational caches permanently.
            </p>
            <button
              onClick={handlePurge}
              className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-mono font-bold text-red-300 transition-all cursor-pointer"
            >
              Reset All Diagnostic Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
