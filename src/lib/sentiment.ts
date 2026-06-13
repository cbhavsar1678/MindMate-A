import { MoodType, StressPattern } from '../types';

// Keywords lists
const KEYWORDS = {
  stress: ['exam', 'test', 'study', 'syllabus', 'prep', 'jee', 'neet', 'upsc', 'cat', 'gate', 'cuet', 'mock', 'coaching', 'backlog', 'marks', 'rank', 'revision', 'pressure', 'timetable', 'score'],
  anxiety: ['fear', 'scared', 'worried', 'panic', 'anxious', 'nervous', 'trigger', 'heartbeat', 'tension', 'palpitation', 'jittery', 'butterflies', 'distressed', 'terror', 'future', 'uncertain'],
  doubt: ['fail', 'failing', 'cannot', 'can\'t do', 'not good enough', 'useless', 'dumb', 'stupid', 'incapable', 'underprepared', 'unready', 'forget', 'forgot', 'forgetting', 'weak', 'rejected'],
  burnout: ['tired', 'exhausted', 'sleepy', 'drained', 'burnout', 'burnt out', 'no energy', 'heavy', 'headache', 'fed up', 'lazy', 'fatigue', 'blank', 'bored', 'uninterested', 'give up'],
  confidence: ['confident', 'ready', 'prepared', 'crack', 'clear', 'solved', 'improving', 'strong', 'positive', 'easy', 'excel', 'achieve', 'got this', 'score high'],
  motivation: ['focus', 'motivated', 'determined', 'ambition', 'goals', 'inspired', 'dream', 'topper', 'hard work', 'consistent', 'routine', 'dedicated']
};

const EMERGENCY_KEYWORDS = [
  'quit',
  'can\'t handle this',
  'cant handle this',
  'i want to quit',
  'hopeless',
  'give up',
  'end my life',
  'want to die',
  'suicide',
  'worthless',
  'cannot live',
  'hurt myself',
  'end everything'
];

export interface SentimentResult {
  moodType: MoodType;
  emotionalState: string;
  triggers: string[];
  suggestions: string[];
  emergencyTriggered: boolean;
}

// Local Sentiment Analyzer
export function analyzeJournalEntry(text: string): SentimentResult {
  const lowercaseText = text.toLowerCase();
  
  // Check for emergency keywords
  const emergencyTriggered = EMERGENCY_KEYWORDS.some(keyword => lowercaseText.includes(keyword));

  // Count keyword frequencies
  const counts = {
    stress: 0,
    anxiety: 0,
    doubt: 0,
    burnout: 0,
    confidence: 0,
    motivation: 0
  };

  Object.entries(KEYWORDS).forEach(([category, list]) => {
    list.forEach(word => {
      // Simple exact match or boundary check
      const regex = new RegExp(`\\b${word}\\b|\\b${word}s\\b`, 'gi');
      const matches = lowercaseText.match(regex);
      if (matches) {
        counts[category as keyof typeof counts] += matches.length;
      }
    });
  });

  // Calculate dominant emotion category
  const categories = Object.keys(counts) as Array<keyof typeof counts>;
  let dominantCategory: keyof typeof counts = 'stress';
  let maxCount = -1;

  categories.forEach(cat => {
    if (counts[cat] > maxCount) {
      maxCount = counts[cat];
      dominantCategory = cat;
    }
  });

  // Decide mood category and descriptive phrase
  let moodType: MoodType = 'neutral';
  let emotionalState = 'Calm & Steady';
  const triggers: string[] = [];
  const suggestions: string[] = [];

  // Identify triggers based on keywords
  if (lowercaseText.includes('jee') || lowercaseText.includes('neet') || lowercaseText.includes('upsc') || lowercaseText.includes('exam')) {
    triggers.push('Competitive exam pressure and rank worries');
  }
  if (lowercaseText.includes('sleep') || lowercaseText.includes('night') || lowercaseText.includes('tired') || lowercaseText.includes('exhausted')) {
    triggers.push('Inadequate sleep / sleep schedule disruption');
  }
  if (lowercaseText.includes('syllabus') || lowercaseText.includes('backlog') || lowercaseText.includes('finish') || lowercaseText.includes('revision')) {
    triggers.push('Syllabus overload and study pacing anxiety');
  }
  if (lowercaseText.includes('parents') || lowercaseText.includes('family') || lowercaseText.includes('expectation') || lowercaseText.includes('marks')) {
    triggers.push('Fear of falling short of social or family expectations');
  }
  if (lowercaseText.includes('mock') || lowercaseText.includes('test') || lowercaseText.includes('score')) {
    triggers.push('Mock test score volatility or negative performance feedback');
  }
  if (triggers.length === 0 && maxCount > 0) {
    triggers.push('Academic task saturation and upcoming appraisal');
  } else if (triggers.length === 0) {
    triggers.push('Daily study routine inertia');
  }

  // Suggest actions
  if (counts.burnout > 0 || counts.stress > 3) {
    suggestions.push('Practice the 4-4-6 breathing exercise immediately in the Mindfulness Center');
    suggestions.push('Decompress by breaking study sets into strict 45-minute sessions (Pomodoro)');
    suggestions.push('Hydrate, disconnect from study screens, and take a 10-minute active walking break');
  }
  if (counts.anxiety > 0 || counts.doubt > 0) {
    suggestions.push('Utilize the 5-4-3-2-1 Grounding technique to bring focus back to the present');
    suggestions.push('Write down the top 3 small, simple topics you can solve right now to build inertia');
    suggestions.push('Remind yourself: mock exams are diagnostics to help you grow, not dynamic assessments of worth');
  }
  if (counts.confidence > 0 || counts.motivation > 0) {
    suggestions.push('Incite higher momentum: perfect opportunity to attempt a full-length mock test!');
    suggestions.push('Tackle your highest-difficulty revision topics while energy levels remain optimized');
    suggestions.push('Write down your main strategy milestones for next week to maintain this peak focus');
  }

  // Ensure fallback suggestions
  if (suggestions.length === 0) {
    suggestions.push('Perform a 2-minute Focus Reset to align your cognitive pathways');
    suggestions.push('Review your daily checklists and award yourself micro-breaks for achievements');
    suggestions.push('Reflect on 3 chapters you mastered last month to counter self-doubt');
  }

  // Emotional State assessment mapping
  if (emergencyTriggered) {
    moodType = 'overwhelmed';
    emotionalState = 'Critically Overwhelmed & Seeking Relief';
  } else if (counts.burnout > counts.confidence && counts.burnout > counts.motivation && counts.burnout > 1) {
    moodType = 'stressed';
    emotionalState = 'Experiencing Academic Burnout / Fatigue';
  } else if (counts.anxiety > counts.confidence && counts.anxiety > counts.motivation && counts.anxiety > 1) {
    moodType = 'stressed';
    emotionalState = 'Undergoing Noticeable Test Anxiety';
  } else if (counts.doubt > counts.confidence && counts.doubt > counts.motivation && counts.doubt > 1) {
    moodType = 'sad';
    emotionalState = 'Hindered by Temporary Imposter Syndrome / Self-Doubt';
  } else if (counts.stress > counts.confidence && counts.stress > counts.motivation && counts.stress > 1) {
    moodType = 'stressed';
    emotionalState = 'Moderately Stressed by Backlogs & Schedules';
  } else if (counts.confidence > 1 || counts.motivation > 1) {
    moodType = 'happy';
    emotionalState = 'Motivated, Focused & Mentally Aligned';
  } else {
    moodType = 'neutral';
    emotionalState = 'Balanced Calm & Operational Baseline';
  }

  return {
    moodType,
    emotionalState,
    triggers,
    suggestions,
    emergencyTriggered
  };
}

// Hidden Stress Pattern Detector (over past 7 entries)
export function getStressPatterns(entries: { text: string }[]): StressPattern[] {
  const wordCounts: { [key: string]: number } = {};
  
  // Clean text and split to individual words
  entries.slice(-7).forEach(entry => {
    const cleanText = entry.text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
      .replace(/\s{2,}/g, ' ');
    
    const words = cleanText.split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) { // disregard very small words
        // Only count stress/pattern-relevant words
        const isCommonAcademicWord = [
          'exam', 'test', 'study', 'syllabus', 'jee', 'neet', 'upsc', 'cat', 'gate', 'cuet', 
          'pressure', 'marks', 'rank', 'sleep', 'tired', 'mock', 'parents', 'fail', 'failing', 
          'anxious', 'focus', 'time', 'hours', 'coaching', 'backlog', 'revision', 'crack'
        ].includes(word);

        if (isCommonAcademicWord) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      }
    });
  });

  return Object.entries(wordCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5 stress patterns
}

// Chatbot Knowledge Base & Responder
export function getCoachResponse(messageText: string): { text: string; category: string } {
  const text = messageText.toLowerCase();

  // Keyword Categories for responses
  if (text.includes('fail') || text.includes('not get selected') || text.includes('drop') || text.includes('backup') || text.includes('mock score') || text.includes('less marks') || text.includes('fear of failure')) {
    return {
      text: "Feeling worried about failure or low scores is completely normal, especially when you are putting in your best. Remember, mock tests are designed to find cracks in your armor so you can patch them, not to define your dynamic capabilities. Let's redirect this fear into focus: identify the exact 3 topics from your last low score, revise them for 30 minutes, and ignore the grand rank table.",
      category: 'Anxiety'
    };
  }

  if (text.includes('exam') || text.includes('pressure') || text.includes('jee') || text.includes('neet') || text.includes('upsc') || text.includes('gate') || text.includes('cat') || text.includes('boards') || text.includes('syllabus') || text.includes('stress')) {
    return {
      text: "Competitive exam preparation is a marathon, not a dash. When the syllabus looks like an insurmountable mountain, remember: you don't climb a mountain in one leap. Break today down into three micro-targets: one revision topic, one practice worksheet, and one light preview. You only need to win TODAY.",
      category: 'Study planning'
    };
  }

  if (text.includes('tired') || text.includes('burnout') || text.includes('exhausted') || text.includes('no energy') || text.includes('blank') || text.includes('quit') || text.includes('fatigue') || text.includes('give up')) {
    return {
      text: "It sounds like physical or cognitive fatigue is taking over. Human brains cannot retain complex formulas under persistent depletion. Give yourself full permission to log off for the next 2 hours. Go take a walk, eat a healthy snack, or lie down without looking at a screen. Resting is as crucial as practicing; a well-rested brain solves in 20 minutes what a burnt-out brain takes 2 hours to process.",
      category: 'Burnout'
    };
  }

  if (text.includes('sleep') || text.includes('insomnia') || text.includes('night') || text.includes('wake up') || text.includes('overslept')) {
    return {
      text: "Sleep is the ultimate cognitive consolidator—your brain literally cleanses pathways and stores what you studied today while you sleep. Sacrificing sleep for 2 extra study hours is negative productivity. Try to aim for 6.5 to 7.5 hours of solid rest. Avoid screens 30 minutes before sleep; open a physical textbook instead to relax your focus.",
      category: 'Sleep'
    };
  }

  if (text.includes('focus') || text.includes('distract') || text.includes('phone') || text.includes('instagram') || text.includes('youtube') || text.includes('attention')) {
    return {
      text: "Digital distraction is designed to trigger dopaminergic spikes. To counter this, don't rely purely on willpower. Set physical barriers: put your cell phone in another room or shut it down. Use the Focus Timer at MindMate: do a crisp '25 minutes on, 5 minutes off' session. Tell yourself, 'I can check my updates during my 5-minute break.' Building focus is a muscle—train it incrementally.",
      category: 'Focus'
    };
  }

  if (text.includes('motivation') || text.includes('lazy') || text.includes('procrastinate') || text.includes('unmotivated') || text.includes('inspired') || text.includes('demotivated')) {
    return {
      text: "Action precedes motivation! The biggest myth is that we must 'feel like it' to start. Start with something so small it requires zero motivation to initiate. Write down 1 simple formula, or read just 1 page of your textbook. Once you write that first line, the friction decreases and momentum takes over. Remember your original dream—why you registered for this test. We believe in you!",
      category: 'Motivation'
    };
  }

  if (text.includes('backlog') || text.includes('timetable') || text.includes('plan') || text.includes('schedule') || text.includes('routine')) {
    return {
      text: "Backlogs act as anchors dragging down student morale. The secret to backlog recovery is 'Parallel Tracking'. Do NOT freeze your active syllabus to finish backlogs; you will only create brand-new ones. Instead, dedicate 80% of your time to active topics, and set aside 1 hour daily exclusively to resolve backlogs chronologically. Consistency over intensity is the cure.",
      category: 'Study planning'
    };
  }

  if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('how are you') || text.includes('help')) {
    return {
      text: "Hello! I am your AI Wellness Companion at MindMate. I'm here to support you through the rigorous journey of competitive exams. Feel free to ask me about anxiety, focus, study planning, sleep schedules, burnout remedies, or motivation resets. How are you holding up today?",
      category: 'Support'
    };
  }

  // Fallback generic but empathetic response
  return {
    text: "I hear you, and your feelings are completely valid. Prepping for high-stakes exams puts you under immense daily strain. Try writing more in your Wellness Diary, practicing a grounding mindfulness exercise in our Center, or breaking your immediate study task into small digestible bites. You can do this!",
    category: 'General'
  };
}

// Predefined Motivational Quotes
export const MOTIVATIONAL_QUOTES = [
  { text: "Your preparation is an investment, not a sacrifice. Every problem resolved is one step closer to your dream.", author: "MindMate Wellness" },
  { text: "Rankings are mere feedback loops, not reflections of your ultimate intellectual destiny. Just excel in the next 10 minutes.", author: "Student Mentor Coach" },
  { text: "Success in UPSC/JEE/NEET is built upon daily quiet hours of repetitive focus, not momentary sparks of genius. Keep grinding in silence.", author: "Strategic Study Expert" },
  { text: "Do not let what you cannot do right now interfere with what you are perfectly capable of executing today.", author: "John Wooden" },
  { text: "It is not the mountain we conquer, but ourselves. Consistency leads to clarity, and clarity conquers test rooms.", author: "Sir Edmund Hillary" },
  { text: "The secret of getting ahead is getting started. Take premium care of your sleep; rest is the fuel of comprehension.", author: "Mark Twain" }
];
