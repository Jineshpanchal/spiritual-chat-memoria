
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: string; // ISO string format
  level: MoodLevel;
  notes: string;
  tags: string[];
}

export interface MoodSummary {
  averageLevel: number;
  totalEntries: number;
  streakDays: number;
  improvementRate: number;
}
