import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, Brain, Hourglass, Target, Play, Square, 
  RotateCcw, CheckCircle, Volume2, VolumeX, Sparkles 
} from 'lucide-react';

export default function MindfulnessCenterView() {
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'focus' | 'pomodoro'>('breathing');

  return (
    <div className="space-y-8 pb-12">
      {/* View Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Mindfulness & Reset Lounge</h2>
        <p className="text-slate-400 text-sm">Quiet down high review palpitations, boost mental recall, and restore concentration cycles.</p>
      </div>

      {/* Internal mindfulness tab selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'breathing' ? 'bg-[#00E676] text-[#0F172A]' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Wind className="w-4 h-4" /> Breathing Guide
        </button>

        <button
          onClick={() => setActiveTab('grounding')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'grounding' ? 'bg-[#00E676] text-[#0F172A]' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Brain className="w-4 h-4" /> Grounding (5-4-3-2-1)
        </button>

        <button
          onClick={() => setActiveTab('focus')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'focus' ? 'bg-[#00E676] text-[#0F172A]' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Target className="w-4 h-4" /> Focus Reset
        </button>

        <button
          onClick={() => setActiveTab('pomodoro')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'pomodoro' ? 'bg-[#00E676] text-[#0F172A]' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Hourglass className="w-4 h-4" /> Pomodoro Timer
        </button>
      </div>

      {/* Active Area Rendering */}
      <div className="bg-white/[0.02] border border-white/5 p-6 sm:p-8 rounded-3xl min-h-[450px] flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
        
        {activeTab === 'breathing' && <BreathingExercise />}
        {activeTab === 'grounding' && <GroundingExercise />}
        {activeTab === 'focus' && <FocusResetExercise />}
        {activeTab === 'pomodoro' && <PomodoroTimerWidget />}
        
      </div>
    </div>
  );
}

// 1. GUIDED BREATHING EXERCISE (4-4-6 SECS CYCLES)
function BreathingExercise() {
  const [cycleState, setCycleState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timerID: any;
    if (isActive) {
      timerID = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // State shift logic
            if (cycleState === 'inhale') {
              setCycleState('hold');
              return 4; // hold 4 seconds
            } else if (cycleState === 'hold') {
              setCycleState('exhale');
              return 6; // exhale 6 seconds
            } else {
              setCycleState('inhale');
              setCompletedCycles(c => c + 1);
              return 4; // inhale 4 seconds
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSecondsLeft(4);
      setCycleState('inhale');
    }

    return () => clearInterval(timerID);
  }, [isActive, cycleState]);

  const toggleExercise = () => {
    setIsActive(!isActive);
  };

  // Visual text guides
  const getGuideText = () => {
    switch (cycleState) {
      case 'inhale':
        return 'Breathe In... Fill your lungs slowly';
      case 'hold':
        return 'Hold... Relax your cognitive muscles';
      case 'exhale':
        return 'Exhale... Release all exam pressure';
    }
  };

  const getRingScale = () => {
    if (!isActive) return 1.0;
    switch (cycleState) {
      case 'inhale':
        return 1.4; // expanding
      case 'hold':
        return 1.4; // held large
      case 'exhale':
        return 0.85; // deflating
    }
  };

  const getRingColor = () => {
    switch (cycleState) {
      case 'inhale':
        return 'border-[#00E676] bg-[#00E676]/15 shadow-[#00E676]/40';
      case 'hold':
        return 'border-amber-400 bg-amber-400/15 shadow-amber-400/40';
      case 'exhale':
        return 'border-cyan-400 bg-cyan-400/15 shadow-cyan-400/40';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-w-lg mx-auto space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#00E676] px-3 py-1 rounded bg-[#00E676]/10">Academic Tensors Regulator</span>
        <h3 className="text-xl font-bold text-white font-sans mt-3">Sovereign 4-4-6 Respiration Cycle</h3>
        <p className="text-xs text-slate-400 leading-normal">
          Designed by mentors to reset hyperventilation spikes triggered by tough mockup score sheets.
        </p>
      </div>

      {/* Pulsing breathing ring */}
      <div className="h-48 flex items-center justify-center relative w-full">
        <motion.div
          animate={{ scale: getRingScale() }}
          transition={{ duration: cycleState === 'inhale' ? 4 : cycleState === 'exhale' ? 6 : 4, ease: "easeInOut" }}
          className={`w-36 h-36 rounded-full border-4 flex items-center justify-center text-center shadow-2xl ${getRingColor()}`}
        >
          <div className="space-y-1">
            <span className="block text-3xl font-extrabold text-white">{secondsLeft}s</span>
            <span className="text-[9px] uppercase font-mono text-slate-200 tracking-wider font-semibold">{cycleState}</span>
          </div>
        </motion.div>
      </div>

      {/* Breathing Instruction text */}
      <div className="text-center space-y-3">
        <h4 className="text-sm font-sans font-extrabold text-slate-100 transition-colors uppercase h-6">
          {isActive ? getGuideText() : 'Ready to breathe?'}
        </h4>
        <p className="font-mono text-xs text-slate-500">Cycles Completed Today: {completedCycles}</p>
      </div>

      <button
        onClick={toggleExercise}
        className={`w-full max-w-sm py-3.5 rounded-2xl font-sans font-bold cursor-pointer transition-all ${
          isActive 
            ? 'bg-slate-800 text-slate-200 border border-white/5 hover:bg-slate-700' 
            : 'bg-gradient-to-r from-[#00E676] to-[#00C853] text-[#0F172A]'
        }`}
      >
        {isActive ? 'Pause Guide' : 'Begin Breathing Loop'}
      </button>
    </div>
  );
}

// 2. TACTICAL 5-4-3-2-1 SENSORY GROUNDING WORKBOOK
function GroundingExercise() {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState({
    see: ['', '', '', '', ''],
    touch: ['', '', '', ''],
    hear: ['', '', ''],
    smell: ['', ''],
    taste: ['']
  });

  const handleInputChange = (field: keyof typeof inputs, idx: number, val: string) => {
    setInputs(prev => {
      const arr = [...prev[field]];
      arr[idx] = val;
      return { ...prev, [field]: arr };
    });
  };

  const getStepHeadline = () => {
    switch (step) {
      case 1: return { num: 5, action: 'Things you SEE around you', sub: 'Ground your eyes on actual physical items in the room.', field: 'see' as const };
      case 2: return { num: 4, action: 'Things you can TOUCH/FEEL', sub: 'The texture of your desk, paper weight, clothing weave.', field: 'touch' as const };
      case 3: return { num: 3, action: 'Ambient sounds you HEAR', sub: 'Ceiling fans, far-away street horn hums, your own breath.', field: 'hear' as const };
      case 4: return { num: 2, action: 'Scents/Aromas you can SMELL', sub: 'Ink from pages, timber polish, tea cups or air molecules.', field: 'smell' as const };
      case 5: return { num: 1, action: 'Flavors you can TASTE', sub: 'Slight traces of coffee, cool water, mint or standard moisture.', field: 'taste' as const };
      default: return { num: 0, action: 'Friction Terminated', sub: 'Done', field: 'taste' as const };
    }
  };

  const activeConf = getStepHeadline();

  return (
    <div className="flex flex-col justify-between py-2 w-full max-w-lg mx-auto h-[400px]">
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E676] px-3 py-1 rounded bg-[#00E676]/10">Anti-Panic Coping System</span>
          <h3 className="text-lg font-bold text-white mt-1">5-4-3-2-1 Sensory Grounding</h3>
        </div>

        {step <= 5 ? (
          <div className="space-y-4 p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-[#00E676]">{activeConf.num}</span>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{activeConf.action}</h4>
                <p className="text-[11px] text-slate-400">{activeConf.sub}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {inputs[activeConf.field].map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={val}
                  onChange={e => handleInputChange(activeConf.field, idx, e.target.value)}
                  placeholder={`Sensory record #${idx + 1}...`}
                  className="w-full p-2.5 rounded-xl bg-[#0F172A] border border-white/5 focus:border-[#00E676] focus:outline-none text-xs text-slate-200"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 border border-[#00E676]/20 bg-[#00E676]/5 rounded-3xl text-center space-y-4">
            <CheckCircle className="w-10 h-10 text-[#00E676] mx-auto animate-bounce" />
            <h4 className="text-md font-bold text-white">Focus Alignment Succeeded</h4>
            <p className="text-xs text-slate-300 leading-normal max-w-xs mx-auto">
              Your physical environment has override the study panic centers. You are completely in charge.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {step > 1 && step <= 5 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="px-5 py-3 rounded-xl bg-white/5 text-slate-400 text-xs font-semibold hover:text-white"
          >
            Back
          </button>
        )}
        
        {step <= 5 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex-1 py-3.5 rounded-xl bg-[#00E676] text-[#0F172A] text-xs font-bold font-sans cursor-pointer hover:brightness-105 transition-all text-center"
          >
            Next ({step}/5)
          </button>
        ) : (
          <button
            onClick={() => {
              setStep(1);
              setInputs({ see: ['', '', '', '', ''], touch: ['', '', '', ''], hear: ['', '', ''], smell: ['', ''], taste: [''] });
            }}
            className="w-full py-3.5 rounded-xl border border-white/5 hover:bg-white/5 text-xs text-slate-300 font-bold"
          >
            Restart Grounds Workbook
          </button>
        )}
      </div>
    </div>
  );
}

// 3. 2-MINUTE FOCUS RESET EXERCISE
function FocusResetExercise() {
  const [seconds, setSeconds] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const AFFIRMATIONS = [
    "One formula at a time. The syllabus will fall into line.",
    "Inhale consistency, exhale comparison with others.",
    "Mock exams show cracks; they do not dictate my destiny.",
    "I am building academic resilience step by step.",
    "Rest is productive. My brain is absorbing the data now."
  ];
  const [activeAffirmation, setActiveAffirmation] = useState(AFFIRMATIONS[0]);

  useEffect(() => {
    let timer: any;
    if (isRunning && seconds > 0) {
      timer = setInterval(() => {
        setSeconds(prev => {
          const nextVal = prev - 1;
          if (nextVal > 0 && nextVal % 20 === 0) {
            const randomIdx = Math.floor(Math.random() * AFFIRMATIONS.length);
            setActiveAffirmation(AFFIRMATIONS[randomIdx]);
          }
          return nextVal;
        });
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [seconds, isRunning]);

  const handleStart = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(120);
    setActiveAffirmation(AFFIRMATIONS[0]);
  };

  const minutesStr = Math.floor(seconds / 60);
  const secondsStr = String(seconds % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center py-4 w-full max-w-lg mx-auto space-y-8 h-[380px]">
      <div className="text-center space-y-1">
        <span className="text-xs font-mono uppercase tracking-widest text-[#00E676] px-3 py-1 rounded bg-[#00E676]/10">Fast Cognitive Calibrator</span>
        <h3 className="text-lg font-bold text-white mt-1">2-Minute Focus Alignment</h3>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Hypnotic glowing dot breathing ring */}
        <motion.div
          animate={{ scale: isRunning ? [1.0, 1.25, 1.0] : 1.0 }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full bg-[#00E676]/25 border-2 border-[#00E676] shadow-xl shadow-[#00E676]/20 flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-[#00E676]" />
        </motion.div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-3xl font-extrabold text-white font-mono">{minutesStr}:{secondsStr}</p>
        <p className="text-xs text-slate-300 italic max-w-xs mx-auto leading-relaxed px-4 text-[#00E676]">
          "{activeAffirmation}"
        </p>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <button
          onClick={handleStart}
          className="flex-1 py-3 text-xs bg-[#00E676] text-[#0F172A] font-bold rounded-xl hover:brightness-105 cursor-pointer"
        >
          {isRunning ? 'Pause' : 'Launch Reset'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 text-xs hover:text-white"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// 4. CUSTOM POMODORO STUDY TIMER
function PomodoroTimerWidget() {
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    setSecondsLeft((timerMode === 'study' ? studyMinutes : breakMinutes) * 60);
  }, [studyMinutes, breakMinutes, timerMode]);

  useEffect(() => {
    let timer: any;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(s => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      // Alarm sound simulation or state shift
      setIsActive(false);
      try {
        // Safe context-audio check
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 520;
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        // audio context blocked by browser gesture
      }

      if (timerMode === 'study') {
        setTimerMode('break');
        setSessionsCompleted(c => c + 1);
        alert('Pomodoro Session Complete! Time for a well-deserved breather.');
      } else {
        setTimerMode('study');
        alert('Breather finished. Get back to focus sessions!');
      }
    }
    return () => clearInterval(timer);
  }, [secondsLeft, isActive]);

  const handleStartToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimerMode('study');
    setSecondsLeft(studyMinutes * 60);
  };

  const progressTotal = (timerMode === 'study' ? studyMinutes : breakMinutes) * 60;
  const progressRatio = ((progressTotal - secondsLeft) / progressTotal) * 100;

  const minStr = Math.floor(secondsLeft / 60);
  const secStr = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-between py-2 w-full max-w-lg mx-auto h-[400px]">
      <div className="text-center space-y-1 w-full">
        <span className="text-xs font-mono uppercase tracking-widest text-[#00E676] px-3 py-1 rounded bg-[#00E676]/10">Stamina Pacing Instrument</span>
        <h3 className="text-lg font-bold text-white mt-1">Pomodoro Study Engine</h3>
      </div>

      {/* Circle progress bar around count */}
      <div className="relative flex items-center justify-center p-8">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle cx="80" cy="80" r="72" className="stroke-white/5 fill-none" strokeWidth="6" />
          <circle 
            cx="80" 
            cy="80" 
            r="72" 
            className={`fill-none transition-all duration-300 stroke-${timerMode === 'study' ? '[#00E676]' : 'cyan-400'}`} 
            strokeWidth="6" 
            strokeDasharray={452.3}
            strokeDashoffset={452.3 - (452.3 * progressRatio) / 100}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute text-center">
          <span className="block text-4xl font-extrabold text-white font-mono">{minStr}:{secStr}</span>
          <span className="text-[9px] uppercase font-mono text-slate-400 tracking-wider">
            {timerMode === 'study' ? '🔥 Focus Term' : '😌 Relax breakeaway'}
          </span>
        </div>
      </div>

      {/* Config buttons */}
      <div className="flex gap-4 p-3 bg-white/[0.01] border border-white/5 rounded-2xl w-full justify-around text-xs font-mono">
        <div>
          <span className="text-slate-500 block text-[9px] mb-1">STUDY SESSION (M)</span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setStudyMinutes(m => Math.max(5, m - 5))} className="p-1 text-slate-400 hover:text-white">-</button>
            <span className="text-white font-bold">{studyMinutes}m</span>
            <button onClick={() => setStudyMinutes(m => Math.min(60, m + 5))} className="p-1 text-slate-400 hover:text-white">+</button>
          </div>
        </div>

        <div className="w-px bg-white/10" />

        <div>
          <span className="text-slate-500 block text-[9px] mb-1">BREAK INTERVAL (M)</span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setBreakMinutes(m => Math.max(1, m - 1))} className="p-1 text-slate-400 hover:text-white">-</button>
            <span className="text-white font-bold">{breakMinutes}m</span>
            <button onClick={() => setBreakMinutes(m => Math.min(30, m + 1))} className="p-1 text-slate-400 hover:text-white">+</button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <button
          onClick={handleStartToggle}
          className="flex-1 py-3 bg-gradient-to-r from-[#00E676] to-[#00C853] text-[#0F172A] font-sans font-bold rounded-2xl cursor-pointer hover:brightness-105 transition-all text-xs"
        >
          {isActive ? 'Pause Session' : 'Start Focus Term'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-2xl transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[10px] font-mono text-slate-500 mt-2 text-center">Sessions Completed Today: {sessionsCompleted}</p>
    </div>
  );
}
