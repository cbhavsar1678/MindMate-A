import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { JournalEntry, StressPattern } from '../types';
import { analyzeJournalEntry, getStressPatterns } from '../lib/sentiment';
import { getJournals, saveJournals } from '../lib/storage';
import { 
  BookOpen, Sparkles, AlertTriangle, AlertCircle, 
  CheckCircle, ShieldAlert, Activity, Award, Trash2, Calendar
} from 'lucide-react';

interface JournalViewProps {
  journals: JournalEntry[];
  onJournalsChange: (newJournals: JournalEntry[]) => void;
}

export default function JournalView({ journals, onJournalsChange }: JournalViewProps) {
  const [journalText, setJournalText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [patterns, setPatterns] = useState<StressPattern[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [isEmergencyZone, setIsEmergencyZone] = useState(false);

  useEffect(() => {
    // Re-evaluate patterns whenever entries list changes
    const recPatterns = getStressPatterns(journals);
    setPatterns(recPatterns);
  }, [journals]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJournalText(text);

    // Dynamic safety check
    const lowercaseText = text.toLowerCase();
    const safetyThreat = [
      'quit', 'can\'t handle this', 'cant handle this', 'hopeless', 
      'end my life', 'want to die', 'suicide', 'give up'
    ].some(word => lowercaseText.includes(word));
    
    setIsEmergencyZone(safetyThreat);
  };

  const handleEvaluate = (e: FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    // Run local sentiment engine
    const analysis = analyzeJournalEntry(journalText);
    setAnalysisResult(analysis);
    setIsEmergencyZone(analysis.emergencyTriggered);

    // Save entry
    const newEntry: JournalEntry = {
      id: `j_${Date.now()}`,
      date: new Date().toISOString(),
      text: journalText,
      moodType: analysis.moodType,
      emotionalState: analysis.emotionalState,
      triggers: analysis.triggers,
      suggestions: analysis.suggestions,
      emergencyTriggered: analysis.emergencyTriggered
    };

    const updatedJournals = [newEntry, ...journals];
    onJournalsChange(updatedJournals);
    
    // Reset and alert
    setJournalText('');
    setSuccessMsg('Your journal entry was analyzed and logged inside secure storage!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteEntry = (id: string) => {
    const index = journals.filter(j => j.id !== id);
    onJournalsChange(index);
    if (analysisResult && !journals.some(j => j.id === id)) {
      setAnalysisResult(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* View Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold font-sans text-white tracking-tight">AI Wellness Diary</h2>
        <p className="text-slate-400 text-sm">Write down your mock test feelings, prep backlogs, or parental expectations. Evaluated safely on your browser.</p>
      </div>

      {/* Emergency Alert Mode trigger */}
      {isEmergencyZone && (
        <div className="p-6 bg-red-500/15 border-2 border-red-500 rounded-3xl space-y-4 animate-bounce">
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-8 h-8 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-md font-bold text-red-200">You seem to be going through a highly challenging phase.</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Remember that competitive exams do not define your dynamic human potential. Please consider taking a step back and speaking to someone who cares:
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2 text-slate-300 pl-12">
            <div className="p-3.5 bg-[#0F172A]/70 border border-red-500/20 rounded-xl space-y-1">
              <span className="text-red-400 block font-bold">Trusted Contacts</span>
              <p>• Speak to your parents immediately.</p>
              <p>• Reach out to a course teacher or coordinator.</p>
            </div>
            <div className="p-3.5 bg-[#0F172A]/70 border border-red-500/20 rounded-xl space-y-1">
              <span className="text-red-400 block font-bold">Free Immediate Counseling</span>
              <p>• Kiran Suicide Prevention Support: 1800-599-0019</p>
              <p>• Tele-MANAS Wellness (Govt Govt Helpline): 14416</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Form Left, Patterns Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Diary entry form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00E676]" /> How are you feeling today?
              </h3>
              <span className="text-xs font-mono text-slate-500">Local NLP evaluation</span>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleEvaluate} className="space-y-4">
              <textarea
                value={journalText}
                onChange={handleTextChange}
                placeholder="Examples: 'JEE advanced test preparation is very stressful today. I am afraid I will fail...' or 'Tackled my physical chemistry backlog and feel much better today...'"
                rows={6}
                maxLength={4000}
                className="w-full p-4 rounded-2xl bg-[#0F172A] border border-white/10 text-slate-100 font-sans text-sm focus:border-[#00E676] focus:outline-none transition-all placeholder:text-slate-600 leading-relaxed"
              />

              <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                <span>{journalText.length} / 4000 chars</span>
                <span>Fully secure • Private Offline Sandbox</span>
              </div>

              <button
                type="submit"
                disabled={!journalText.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00E676] to-[#00C853] text-[#0F172A] font-sans font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Sparkles className="w-4.5 h-4.5" /> Analyze Sentiment & Record
              </button>
            </form>
          </div>

          {/* Last Analysed Entry Showcase */}
          {analysisResult && (
            <div className="bg-white/[0.03] border border-[#00E676]/20 p-6 rounded-3xl space-y-4 bg-gradient-to-tr from-[#00E676]/5 to-transparent relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-[#00E676]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-xs font-mono text-[#00E676]">
                <Activity className="w-4 h-4" /> EXTRACTED DIAGNOSTICS LOG
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">EMOTIONAL STATE STATE</span>
                  <span className="font-sans font-extrabold text-[#00E676] text-lg">{analysisResult.emotionalState}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2 border border-white/5 p-3.5 rounded-2xl bg-[#0F172A]/40">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">⚠️ Possible Triggers</span>
                    <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc font-sans">
                      {analysisResult.triggers.map((trig: string, idx: number) => (
                        <li key={idx}>{trig}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 border border-[#00E676]/10 p-3.5 rounded-2xl bg-[#00E676]/5">
                    <span className="text-[10px] font-mono text-[#00E676] block uppercase tracking-wider">🌱 Suggested Actions</span>
                    <ul className="text-xs text-slate-200 space-y-1.5 pl-4 list-disc font-sans">
                      {analysisResult.suggestions.map((sug: string, idx: number) => (
                        <li key={idx}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Patterns & Word frequency + logs Right panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Past 7 Journals word density patterns */}
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertSquareIcon className="w-4.5 h-4.5 text-orange-400" /> Stress Word Density
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes your last 7 journal entries to identify which high-anxiety academic words recur most frequently.
            </p>

            <div className="space-y-3 pt-2">
              {patterns.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-6">Insufficient keywords recorded in the last 7 entries to draw density charts.</p>
              ) : (
                patterns.map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300 capitalize">"{item.word}"</span>
                      <span className="text-slate-400">{item.count} {item.count === 1 ? 'time' : 'times'}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-[#00E676]" 
                        style={{ width: `${Math.min(100, (item.count / 10) * 100)}%` }} 
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {patterns.length > 0 && (
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-mono text-slate-400 leading-normal">
                <span className="text-white font-bold block mb-0.5">💡 Pattern Insight:</span>
                You have active references to exam pressures and timelines. Reduce study strain by trying the Focus Mode Pomodoro.
              </div>
            )}
          </div>

          {/* Past entries short catalog */}
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-[#00E676]" /> Diary Entries
              </h3>
              <span className="px-2 py-0.5 rounded bg-white/5 font-mono text-[9px] text-slate-400">{journals.length} Entries</span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {journals.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-6">Your logged diaries will populate here.</p>
              ) : (
                journals.map(entry => (
                  <div key={entry.id} className="p-3.5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-xl space-y-2 group relative">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block">
                          {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="inline-block px-1.5 py-0.5 mt-1 rounded bg-[#00E676]/10 text-[#00E676] text-[9px] font-mono capitalize">
                          {entry.moodType}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-500/10"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed">
                      {entry.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Simple dynamic inline helper to prevent missing icon definitions
function AlertSquareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
