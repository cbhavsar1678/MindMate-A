export type MoodType = 'happy' | 'calm' | 'neutral' | 'sad' | 'stressed' | 'overwhelmed';

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  moodScore: number; // 0-100
  stressLevel: number; // 0-100
  motivationLevel: number; // 0-100
  focusLevel: number; // 0-100
  energyLevel: number; // 0-100
  sleepHours: number; // 0-24
}

export interface JournalEntry {
  id: string;
  date: string; // ISO String
  text: string;
  moodType: MoodType;
  emotionalState: string;
  triggers: string[];
  suggestions: string[];
  emergencyTriggered: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ExamCountdown {
  id: string;
  examName: string;
  examDate: string; // YYYY-MM-DD
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface WellnessScoreBreakdown {
  overallScore: number;
  moodComponent: number; // 40%
  stressComponent: number; // 30%
  sleepComponent: number; // 20%
  consistencyComponent: number; // 10%
  status: 'Healthy' | 'Needs Attention' | 'High Stress';
}

export interface StressPattern {
  word: string;
  count: number;
}
