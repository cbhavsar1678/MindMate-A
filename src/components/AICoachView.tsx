import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getCoachResponse } from '../lib/sentiment';
import { 
  MessageSquare, Send, Sparkles, Brain, Clock, 
  Trash2, User, HelpCircle, ArrowRight 
} from 'lucide-react';

export default function AICoachView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_TOPICS = [
    { label: '🔥 Severe Burnout Help', prompt: 'I am studying 12 hours daily but feel completely exhausted, tired and blank.' },
    { label: '📅 How to fix Backlogs?', prompt: 'How do I handle syllabus backlogs without ruining my current exam timeline?' },
    { label: '😟 Fear of Mock Failure', prompt: 'I got low marks in my mock test and I am scared of failing my final exam.' },
    { label: '🎯 Focus/Concentration Reset', prompt: 'How do I stop getting distracted by my phone during study sessions?' }
  ];

  useEffect(() => {
    // Initial welcome message if storage is empty
    const savedMessages = localStorage.getItem('mindmate_chat_history');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const initialMsgs: ChatMessage[] = [
        {
          id: 'welcome',
          sender: 'ai',
          text: "Hello! I am MindMate, your local AI Wellness Guide. I am specifically programmed with student-support guidelines for overcoming exam burnout, test anxiety, phone distractions, sleep loss, and backlog recovery. How can I support your study stamina today?",
          timestamp: new Date().toISOString()
        }
      ];
      setMessages(initialMsgs);
      localStorage.setItem('mindmate_chat_history', JSON.stringify(initialMsgs));
    }
  }, []);

  useEffect(() => {
    // Save chat dynamically
    if (messages.length > 0) {
      localStorage.setItem('mindmate_chat_history', JSON.stringify(messages));
    }
    // Scroll
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate AI thinking and reply
    setTimeout(() => {
      const resultObj = getCoachResponse(text);
      const aiReply: ChatMessage = {
        id: `chat_${Date.now() + 1}`,
        sender: 'ai',
        text: resultObj.text,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiReply]);
    }, 600);
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear your local Chat history?')) {
      const initialMsgs: ChatMessage[] = [
        {
          id: 'welcome',
          sender: 'ai',
          text: "Chat cleared! How can I support your mental stamina and study plan today?",
          timestamp: new Date().toISOString()
        }
      ];
      setMessages(initialMsgs);
      localStorage.setItem('mindmate_chat_history', JSON.stringify(initialMsgs));
    }
  };

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-140px)]">
      {/* View Header */}
      <div className="flex justify-between items-center shrink-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-sans text-white tracking-tight">AI Wellness Coach Console</h2>
          <p className="text-slate-400 text-sm">Secure local assistant skilled in tackling academic burnout, sleep schedules, and anxious exam mindsets.</p>
        </div>
        
        <button
          onClick={handleClearChat}
          className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
          title="Clear Chat History"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Suggestion pills room (Desktop Left) */}
        <div className="lg:col-span-3 space-y-4 shrink-0 overflow-y-auto lg:block hidden">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E676] block">Stamina Guidelines</span>
          <p className="text-xs text-slate-400 leading-normal">Click any of these common high-stakes student challenges to trigger immediate support strategies:</p>
          
          <div className="space-y-3 pt-2">
            {SUGGESTED_TOPICS.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(topic.prompt)}
                className="w-full p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#00E676]/30 text-left transition-all group flex flex-col gap-2 cursor-pointer"
              >
                <span className="text-xs font-sans font-bold text-white group-hover:text-[#00E676] transition-colors">{topic.label}</span>
                <span className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{topic.prompt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Core Chat Dialog Frame */}
        <div className="lg:col-span-9 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col min-h-0 overflow-hidden relative">
          
          {/* Active status indicator */}
          <div className="p-4 bg-white/[0.01] border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse" />
              <div>
                <p className="text-xs font-bold text-white font-sans">MindMate AI Support Engine</p>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Operational Mode: Offline Sandbox</p>
              </div>
            </div>
            <span className="p-1 px-2.5 rounded-lg bg-[#00E676]/10 text-[#00E676] text-[10px] font-mono leading-none">NO ENDPOINT CALLS</span>
          </div>

          {/* Messages stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map(msg => (
              <div 
                key={msg.id}
                className={`flex gap-3.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 border uppercase font-mono text-xs ${
                  msg.sender === 'user' 
                    ? 'bg-white/5 text-white border-white/10' 
                    : 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/20'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4.5 h-4.5" />}
                </div>

                <div className={`p-4 rounded-2xl leading-relaxed text-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-[#00C853]/15 to-[#00E676]/10 border border-[#00E676]/20 text-slate-100'
                    : 'bg-white/[0.03] border border-white/5 text-slate-200'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="block mt-1.5 font-mono text-[9px] text-slate-500 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Pre-made Pills for Mobile (renders inline on smaller screens) */}
          <div className="px-6 py-2 flex gap-2 overflow-x-auto lg:hidden shrink-0 border-t border-white/5 bg-slate-950/20">
            {SUGGESTED_TOPICS.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(topic.prompt)}
                className="shrink-0 p-2 text-[11px] font-sans font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl uppercase transition-all"
              >
                {topic.label.split(' ').slice(1).join(' ')}
              </button>
            ))}
          </div>

          {/* Form input dock */}
          <div className="p-4 bg-slate-950/40 border-t border-white/5 shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-3 bg-[#0F172A] border border-white/10 rounded-2xl p-2 focus-within:border-[#00E676] transition-all"
            >
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask me anything: 'I feel unmotivated to revise chemistry logs today...'"
                className="flex-1 bg-transparent border-none text-slate-100 font-sans text-sm p-2 focus:outline-none placeholder:text-slate-600"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00C853] hover:brightness-105 text-[#0F172A] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
