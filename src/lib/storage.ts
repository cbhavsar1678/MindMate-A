import { MoodLog, JournalEntry, ExamCountdown, AchievementBadge, WellnessScoreBreakdown, MoodType } from '../types';

const STORAGE_KEYS = {
  MOODS: 'mindmate_mood_logs',
  JOURNALS: 'mindmate_journals',
  EXAMS: 'mindmate_exams',
  BADGES: 'mindmate_badges',
  STREAK: 'mindmate_streak',
};

// Initial default badges
const DEFAULT_BADGES: AchievementBadge[] = [
  { id: 'first_log', name: 'First Milestone', description: 'Log your very first mood entry', icon: 'Smile', unlocked: false },
  { id: 'streak_3', name: 'Consistency Cadet', description: 'Maintain a 3-day wellness streak', icon: 'Flame', unlocked: false },
  { id: 'streak_7', name: 'Wellness Warrior', description: 'Maintain a 7-day wellness streak', icon: 'ShieldAlert', unlocked: false },
  { id: 'reflection', name: 'Inner Self Reflection', description: 'Write your first wellness journal entry', icon: 'BookOpen', unlocked: false },
  { id: 'mindful', name: 'Zen Disciple', description: 'Complete at least 1 guided mindfulness session', icon: 'Wind', unlocked: false },
  { id: 'stress_master', name: 'Calm Catalyst', description: 'Record a stress score below 30 on a highly motivated day', icon: 'Sparkles', unlocked: false }
];

// Default exams to prepare for
export const DEFAULT_EXAMS: ExamCountdown[] = [
  { id: 'jee', examName: 'JEE Advanced', examDate: '2026-05-24' },
  { id: 'neet', examName: 'NEET UG', examDate: '2026-05-03' },
  { id: 'upsc', examName: 'UPSC CSE (Prelims)', examDate: '2026-05-31' },
  { id: 'cat', examName: 'CAT Exam', examDate: '2026-11-29' },
  { id: 'gate', examName: 'GATE Exam', examDate: '2026-02-07' },
  { id: 'cuet', examName: 'CUET UG', examDate: '2026-05-15' }
];

// Helper to get raw logs
export function getMoodLogs(): MoodLog[] {
  const data = localStorage.getItem(STORAGE_KEYS.MOODS);
  return data ? JSON.parse(data) : [];
}

export function saveMoodLogs(logs: MoodLog[]): void {
  localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(logs));
  checkAndUnlockBadges();
}

export function getJournals(): JournalEntry[] {
  const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
  return data ? JSON.parse(data) : [];
}

export function saveJournals(journals: JournalEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
  checkAndUnlockBadges();
}

export function getExams(): ExamCountdown[] {
  const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
  if (!data) {
    // Seed default exams with simulated dates in current or next year
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(DEFAULT_EXAMS));
    return DEFAULT_EXAMS;
  }
  return JSON.parse(data);
}

export function saveExams(exams: ExamCountdown[]): void {
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
}

export function getBadges(): AchievementBadge[] {
  const data = localStorage.getItem(STORAGE_KEYS.BADGES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(DEFAULT_BADGES));
    return DEFAULT_BADGES;
  }
  return JSON.parse(data);
}

export function saveBadges(badges: AchievementBadge[]): void {
  localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
}

// Calculate the wellness score breakdown
export function calculateWellnessScore(logs: MoodLog[]): WellnessScoreBreakdown {
  if (logs.length === 0) {
    return {
      overallScore: 75,
      moodComponent: 75,
      stressComponent: 80,
      sleepComponent: 70,
      consistencyComponent: 50,
      status: 'Healthy'
    };
  }

  // Get averages over the past 7 logs (or whatever exists)
  const recentLogs = logs.slice(-7);
  
  // 1. Mood Component (40%): Average moodScore
  const avgMood = recentLogs.reduce((acc, log) => acc + log.moodScore, 0) / recentLogs.length;

  // 2. Stress Component (30%): Calculated as 100 - stressLevel
  const avgStress = recentLogs.reduce((acc, log) => acc + (100 - log.stressLevel), 0) / recentLogs.length;

  // 3. Sleep Component (20%): Optimized at 8 hours. 8 hours or more = 100%. Less hours is proportional.
  const avgSleep = recentLogs.reduce((acc, log) => {
    const sleepRating = log.sleepHours >= 8 ? 100 : (log.sleepHours / 8) * 100;
    return acc + sleepRating;
  }, 0) / recentLogs.length;

  // 4. Consistency Component (10%): Wellness streak over past 7 days (e.g. log count / 7)
  const streak = calculateWellnessStreak(logs);
  const consistencyScore = Math.min(100, (streak / 7) * 100);

  // Weighted total
  const overallScore = Math.round(
    (avgMood * 0.4) +
    (avgStress * 0.3) +
    (avgSleep * 0.2) +
    (consistencyScore * 0.1)
  );

  let status: 'Healthy' | 'Needs Attention' | 'High Stress' = 'Healthy';
  if (overallScore < 50) {
    status = 'High Stress';
  } else if (overallScore < 75) {
    status = 'Needs Attention';
  }

  return {
    overallScore,
    moodComponent: Math.round(avgMood),
    stressComponent: Math.round(avgStress),
    sleepComponent: Math.round(avgSleep),
    consistencyComponent: Math.round(consistencyScore),
    status
  };
}

// Calculate streak count
export function calculateWellnessStreak(logs: MoodLog[]): number {
  if (logs.length === 0) return 0;
  
  // Sort logs by date descending
  const sortedDays = Array.from(new Set(logs.map(log => log.date))).sort().reverse();
  
  let streak = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // If no entry today and no entry yesterday, streak is broken
  if (sortedDays[0] !== todayStr && sortedDays[0] !== yesterdayStr) {
    return 0;
  }

  let expectedDate = new Date(sortedDays[0]);
  
  for (let i = 0; i < sortedDays.length; i++) {
    const logDateStr = sortedDays[i];
    const logDate = new Date(logDateStr);
    
    // Check if difference in days is <= 1
    const diffTime = Math.abs(expectedDate.getTime() - logDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (i === 0 || diffDays <= 1) {
      streak++;
      expectedDate = logDate;
    } else {
      break;
    }
  }

  return streak;
}

// Dynamic updates of badges
export function checkAndUnlockBadges(): AchievementBadge[] {
  const logs = getMoodLogs();
  const journals = getJournals();
  const badges = getBadges();
  
  let changed = false;
  const updated = badges.map(badge => {
    if (badge.unlocked) return badge;

    let shouldUnlock = false;
    
    if (badge.id === 'first_log' && logs.length > 0) {
      shouldUnlock = true;
    } else if (badge.id === 'streak_3' && calculateWellnessStreak(logs) >= 3) {
      shouldUnlock = true;
    } else if (badge.id === 'streak_7' && calculateWellnessStreak(logs) >= 7) {
      shouldUnlock = true;
    } else if (badge.id === 'reflection' && journals.length > 0) {
      shouldUnlock = true;
    } else if (badge.id === 'stress_master') {
      const luckyLog = logs.find(l => l.stressLevel < 35 && l.motivationLevel > 75);
      if (luckyLog) shouldUnlock = true;
    }

    if (shouldUnlock) {
      changed = true;
      return {
        ...badge,
        unlocked: true,
        unlockedAt: new Date().toISOString().split('T')[0]
      };
    }
    return badge;
  });

  if (changed) {
    saveBadges(updated);
  }
  return updated;
}

// Seed mock historical logs for preview and analysis charts
export function seedHistoricalDataIfEmpty(): void {
  const logs = getMoodLogs();
  const journals = getJournals();
  
  if (logs.length === 0) {
    const seedLogs: MoodLog[] = [];
    const seedJournals: JournalEntry[] = [];
    
    // Create 7 days of logs ending yesterday
    for (let i = 8; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Simulating a student recovering from exam stress
      let mood: MoodType = 'neutral';
      let moodScore = 60;
      let stressLevel = 75;
      let motivationLevel = 50;
      let focusLevel = 55;
      let energyLevel = 60;
      let sleepHours = 6.5;
      
      if (i === 8 || i === 7) {
        mood = 'stressed';
        moodScore = 40;
        stressLevel = 85;
        motivationLevel = 45;
        focusLevel = 45;
        energyLevel = 40;
        sleepHours = 5;
      } else if (i === 6 || i === 5) {
        mood = 'sad';
        moodScore = 45;
        stressLevel = 80;
        motivationLevel = 50;
        focusLevel = 50;
        energyLevel = 45;
        sleepHours = 5.5;
      } else if (i === 4 || i === 3) {
        mood = 'calm';
        moodScore = 70;
        stressLevel = 50;
        motivationLevel = 65;
        focusLevel = 70;
        energyLevel = 65;
        sleepHours = 7;
      } else if (i === 2 || i === 1) {
        mood = 'happy';
        moodScore = 85;
        stressLevel = 25;
        motivationLevel = 88;
        focusLevel = 80;
        energyLevel = 85;
        sleepHours = 8;
      }

      seedLogs.push({
        id: `seed_m_${i}`,
        date: dateStr,
        mood,
        moodScore,
        stressLevel,
        motivationLevel,
        focusLevel,
        energyLevel,
        sleepHours
      });
    }

    // Seed 2 Journals to show sentiments
    const journalDate1 = new Date();
    journalDate1.setDate(journalDate1.getDate() - 5);
    seedJournals.push({
      id: 'seed_j_1',
      date: journalDate1.toISOString(),
      text: "I am feeling extremely exhausted today with my UPSC prelims backlog preparation. There are so many syllabus chapters pending and I only slept 4 hours last night. I am scared I will fail my upcoming feedback mock test on Sunday.",
      moodType: 'stressed',
      emotionalState: 'Undergoing Noticeable Test Anxiety',
      triggers: ['Syllabus backlog overload', 'Inadequate sleep / sleep schedule disruption', 'Fear of failure on mock test'],
      suggestions: [
        'Practice the 4-4-6 breathing exercise immediately in the Mindfulness Center',
        'Divide your revision backlog into small chunks rather than looking at the entire syllabus'
      ],
      emergencyTriggered: false
    });

    const journalDate2 = new Date();
    journalDate2.setDate(journalDate2.getDate() - 2);
    seedJournals.push({
      id: 'seed_j_2',
      date: journalDate2.toISOString(),
      text: "I am starting to feel a bit more confident. I solved a complete workbook of calculus problems today. Feeling ready and motivated to tackle my mocks! Spent some good focus hours.",
      moodType: 'happy',
      emotionalState: 'Motivated, Focused & Mentally Aligned',
      triggers: ['Successful problem sets solver', 'Academic focus restoration'],
      suggestions: [
        'Attempt a mock exam session to test your retention under time pressure',
        'Incentivize your accomplishments with a small relaxation session'
      ],
      emergencyTriggered: false
    });

    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(seedLogs));
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(seedJournals));
    
    // Set custom streak
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(DEFAULT_BADGES));
    checkAndUnlockBadges();
  }
}

// Clear all storage for reset
export function clearAllMindMateData(): void {
  localStorage.removeItem(STORAGE_KEYS.MOODS);
  localStorage.removeItem(STORAGE_KEYS.JOURNALS);
  localStorage.removeItem(STORAGE_KEYS.EXAMS);
  localStorage.removeItem(STORAGE_KEYS.BADGES);
  localStorage.removeItem(STORAGE_KEYS.STREAK);
}
