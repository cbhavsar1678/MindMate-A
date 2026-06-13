import { useState, useEffect, ReactNode } from 'react';
import { MoodLog } from '../types';
import { calculateWellnessScore, calculateWellnessStreak } from '../lib/storage';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  Smile, Flame, Target, Sparkles, TrendingUp, 
  Download, RefreshCw, Layers, ShieldAlert, CheckCircle 
} from 'lucide-react';

interface WellnessAnalyticsViewProps {
  logs: MoodLog[];
}

export default function WellnessAnalyticsView({ logs }: WellnessAnalyticsViewProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');
  const [activeParameter, setActiveParameter] = useState<'all' | 'mood' | 'stress' | 'motivation' | 'sleep'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [diagnosticsScore, setDiagnosticsScore] = useState<any | null>(null);

  useEffect(() => {
    // Format logs for charts, sort chronologically
    const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
    
    // Filter by selected range
    const cutoffDate = new Date();
    if (timeRange === '7days') {
      cutoffDate.setDate(cutoffDate.getDate() - 7);
    } else {
      cutoffDate.setDate(cutoffDate.getDate() - 30);
    }

    const filtered = sorted.filter(log => new Date(log.date) >= cutoffDate);

    const formatted = filtered.map(log => {
      // Map ISO Date to reader-friendly MM-DD
      const parts = log.date.split('-');
      const shortDate = parts.length > 2 ? `${parts[1]}-${parts[2]}` : log.date;

      return {
        id: log.id,
        date: log.date,
        shortDate,
        'Mood Score': log.moodScore,
        'Stress Level': log.stressLevel,
        'Motivation': log.motivationLevel,
        'Sleep Hours': log.sleepHours,
        'Focus Index': log.focusLevel,
        'Stamina': log.energyLevel
      };
    });

    setChartData(formatted);
    setDiagnosticsScore(calculateWellnessScore(logs));
  }, [logs, timeRange]);

  const triggerExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      
      const contents = `
========================================
       MINDMATE AI WELLNESS REPORT      
========================================
Student Academic Diagnostics Summary
Current Date: 2026-06-13 (UTC)
----------------------------------------
Overall Resilience Score: ${diagnosticsScore?.overallScore}/100
Status: ${diagnosticsScore?.status}
Active Wellness Streak: ${calculateWellnessStreak(logs)} Days

Constituent Rating Breakdown:
- Mood Regulation Index: ${diagnosticsScore?.moodComponent}%
- Stress Resiliency Ratio: ${diagnosticsScore?.stressComponent}%
- Sleep Restoration Rating: ${diagnosticsScore?.sleepComponent}%
- Consistency Frequency: ${diagnosticsScore?.consistencyComponent}%

Total Tracked Days: ${logs.length}
----------------------------------------
CONFIDENTIAL DISCIPLINARY LOG REPORT (SECURE OFFLINE BASE)
Always check in with trusted teachers, counselors or guardians.
      `;
      
      // Download file cleanly
      const blob = new Blob([contents], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MindMate_Wellness_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Emotional Trends & Analysis</h2>
          <p className="text-slate-400 text-sm font-sans">Compare daily concentration indexes, stress lines, and sleeping curves chronologically.</p>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/5 rounded-xl p-1 flex">
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                timeRange === '7days' ? 'bg-[#00E676] text-[#0F172A] font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                timeRange === '30days' ? 'bg-[#00E676] text-[#0F172A] font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={triggerExport}
            disabled={isExporting || logs.length === 0}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/20 hover:from-emerald-500/25 border border-emerald-500/20 text-xs font-sans text-[#00E676] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Compiling PDF...' : 'Export PDF Report'}
          </button>
        </div>
      </div>

      {chartsEmptyStateCheck(chartData, (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Chart frame */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-[#00E676]" /> Performance & Anxiety Trajectory
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-mono">X-Axis: Month-Day (Chronological Layout)</p>
              </div>

              {/* Param filter tabs */}
              <div className="flex flex-wrap gap-1.5 bg-slate-900/40 p-1 rounded-xl border border-white/5">
                {(['all', 'mood', 'stress', 'motivation', 'sleep'] as const).map(param => (
                  <button
                    key={param}
                    onClick={() => setActiveParameter(param)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono capitalize transition-all cursor-pointer ${
                      activeParameter === param ? 'bg-white/10 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {param}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts canvas */}
            <div className="h-[350px] w-full text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData} 
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="shortDate" stroke="#475569" />
                  <YAxis domain={[0, 100]} stroke="#475569" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', borderRadius: '12px' }}
                    labelClassName="text-slate-400 text-[10px]"
                  />
                  <Legend wrapperStyle={{ color: '#94A3B8', paddingTop: '15px' }} />
                  
                  {/* Adaptive Lines depending on active parameter */}
                  {(activeParameter === 'all' || activeParameter === 'mood') && (
                    <Line 
                      type="monotone" 
                      dataKey="Mood Score" 
                      stroke="#00E676" 
                      strokeWidth={2.5} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  )}
                  
                  {(activeParameter === 'all' || activeParameter === 'stress') && (
                    <Line 
                      type="monotone" 
                      dataKey="Stress Level" 
                      stroke="#EF4444" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                    />
                  )}

                  {(activeParameter === 'all' || activeParameter === 'motivation') && (
                    <Line 
                      type="monotone" 
                      dataKey="Motivation" 
                      stroke="#FBBF24" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                    />
                  )}

                  {(activeParameter === 'all' || activeParameter === 'sleep') && (
                    <Line 
                      type="monotone" 
                      dataKey="Sleep Hours" 
                      stroke="#06B6D4" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      name="Sleep Hrs (x10)"
                      // Multiply by 10 internally to fit 0-100 scale graph
                      transform="scale(10)" 
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side diagnostics summary */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sleeping & retention statistics */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-[#00E676]" /> Retention Correlation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comparative analysis shows how your sleeping routine directly impacts motivation factors:
              </p>

              {/* Bar Chart representing correlation of Sleep to Stamina */}
              <div className="h-[150px] w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.slice(-5)}>
                    <XAxis dataKey="shortDate" stroke="#475569" hide />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="Sleep Hours" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Sleep (Hrs)" />
                    <Bar dataKey="Stamina" fill="#00E676" radius={[4, 4, 0, 0]} name="Stamina (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[10px] uppercase font-mono text-slate-500 text-center">
                📊 Sleep vs stamina correlation (Last 5 records)
              </div>
            </div>

            {/* Smart recommendations block depending on average stress level */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00E676] block">AI Coping Suggestions</span>
              
              {diagnosticsScore && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 font-medium">
                    {diagnosticsScore.status === 'High Stress' 
                      ? '⚠️ Critical Strain levels detected in trends during revisions.' 
                      : diagnosticsScore.status === 'Needs Attention'
                      ? '🛡️ Moderate schedule anxiety has accumulated.'
                      : '🟢 Excellent mental stamina metrics.'}
                  </p>
                  
                  <div className="text-xs text-slate-400 space-y-2.5 font-sans">
                    {diagnosticsScore.status === 'High Stress' ? (
                      <>
                        <div className="p-3 bg-red-500/10 border border-red-500/10 rounded-xl space-y-1">
                          <span className="text-red-400 block font-bold font-mono text-[10px]">TREATMENT PROTOCOL</span>
                          <p>Reduce mock test intensity. Allocate full days to revision backlogs and focus solely on formula worksheets with 8 hours of sleep.</p>
                        </div>
                      </>
                    ) : diagnosticsScore.status === 'Needs Attention' ? (
                      <>
                        <div className="p-3 bg-amber-500/10 border border-amber-500/10 rounded-xl space-y-1">
                          <span className="text-amber-400 block font-bold font-mono text-[10px]">PREVENTATIVE STRATEGY</span>
                          <p>Implement the 45-minute study Pomodoro cycle. Limit active screen revisions after 10 PM. Practice deep breathing during mock gaps.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/10 rounded-xl space-y-1">
                          <span className="text-[#00E676] block font-bold font-mono text-[10px]">OPPORTUNISTIC TRACKING</span>
                          <p>Stamina is optimal! Take advantage of high momentum to evaluate deep concept workbooks or attempt real-time previous year UPSC/JEE tests.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      ))}
    </div>
  );
}

// Inline helper to prevent blank panels when chart lists are empty
function chartsEmptyStateCheck(data: any[], children: ReactNode) {
  if (data.length === 0) {
    return (
      <div className="p-16 border border-white/5 rounded-3xl bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-3">
        <ShieldAlert className="w-12 h-12 text-[#00E676]/40" />
        <h4 className="text-slate-300 font-bold">Chart Datasets Empty</h4>
        <p className="text-xs text-slate-500 max-w-sm">
          Please log your first emotional metrics or sleep numbers in the **Mood Tracker** panel to populate analytical trend lines.
        </p>
      </div>
    );
  }
  return children;
}
