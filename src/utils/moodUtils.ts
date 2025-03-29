import { MoodEntry, MoodLevel, MoodSummary, MoodAnalytics } from "@/types/mood";
import { STORAGE_KEYS } from "./config";

// Save mood entries to localStorage
export function saveMoodEntries(entries: MoodEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving mood entries to localStorage:", error);
  }
}

// Get mood entries from localStorage
export function getMoodEntries(): MoodEntry[] {
  try {
    const storedEntries = localStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch (error) {
    console.error("Error getting mood entries from localStorage:", error);
    return [];
  }
}

// Add a new mood entry or update existing one
export function addMoodEntry(
  level: MoodLevel, 
  notes: string, 
  tags: string[] = [],
  customDate?: string
): MoodEntry {
  const entries = getMoodEntries();
  const entryDate = customDate || new Date().toISOString();
  const datePrefix = entryDate.split('T')[0]; // YYYY-MM-DD
  
  // Check if an entry already exists for the selected date
  const existingEntryIndex = entries.findIndex(entry => entry.date.startsWith(datePrefix));
  
  const newEntry: MoodEntry = {
    id: existingEntryIndex >= 0 ? entries[existingEntryIndex].id : crypto.randomUUID(),
    date: entryDate,
    level,
    notes,
    tags
  };
  
  if (existingEntryIndex >= 0) {
    // Update existing entry
    entries[existingEntryIndex] = newEntry;
  } else {
    // Add new entry
    entries.push(newEntry);
  }
  
  saveMoodEntries(entries);
  return newEntry;
}

// Calculate streak (consecutive days with entries)
export function calculateStreak(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 1;
  let currentDate = new Date(sortedEntries[0].date);
  currentDate.setHours(0, 0, 0, 0);
  
  for (let i = 1; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    entryDate.setHours(0, 0, 0, 0);
    
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    
    if (entryDate.getTime() === prevDay.getTime()) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }
  
  return streak;
}

// Calculate improvement rate (average change over last 7 days compared to previous 7)
export function calculateImprovementRate(entries: MoodEntry[]): number {
  if (entries.length < 8) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const recentWeek = sortedEntries.slice(0, 7);
  const previousWeek = sortedEntries.slice(7, 14);
  
  const recentAvg = recentWeek.reduce((sum, entry) => sum + entry.level, 0) / recentWeek.length;
  const previousAvg = previousWeek.reduce((sum, entry) => sum + entry.level, 0) / previousWeek.length;
  
  // Return percentage change
  return previousAvg !== 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
}

// Calculate standard deviation (variability) of mood levels
export function calculateVariability(entries: MoodEntry[]): number {
  if (entries.length <= 1) return 0;
  
  const levels = entries.map(entry => entry.level);
  const mean = levels.reduce((sum, level) => sum + level, 0) / levels.length;
  
  const squaredDifferences = levels.map(level => Math.pow(level - mean, 2));
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / (levels.length - 1);
  
  return Math.sqrt(variance);
}

// Calculate habit consistency (percentage of days with entries in the last month)
export function calculateHabitConsistency(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;
  
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const uniqueDaysWithEntries = new Set();
  entries.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (entryDate >= thirtyDaysAgo && entryDate <= today) {
      uniqueDaysWithEntries.add(entryDate.toISOString().split('T')[0]);
    }
  });
  
  return (uniqueDaysWithEntries.size / 30) * 100;
}

// Get mood summary statistics with enhanced metrics
export function getMoodSummary(): MoodSummary {
  const entries = getMoodEntries();
  
  if (entries.length === 0) {
    return {
      averageLevel: 0,
      totalEntries: 0,
      streakDays: 0,
      improvementRate: 0,
      variabilityScore: 0,
      habitConsistency: 0
    };
  }
  
  const averageLevel = entries.reduce((sum, entry) => sum + entry.level, 0) / entries.length;
  const streakDays = calculateStreak(entries);
  const improvementRate = calculateImprovementRate(entries);
  const variabilityScore = calculateVariability(entries);
  const habitConsistency = calculateHabitConsistency(entries);
  
  return {
    averageLevel,
    totalEntries: entries.length,
    streakDays,
    improvementRate,
    variabilityScore,
    habitConsistency
  };
}

// Get entries for the past N days
export function getEntriesForPastDays(days: number): MoodEntry[] {
  const entries = getMoodEntries();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return entries.filter(entry => new Date(entry.date) >= cutoffDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Get entry for specific date (if exists)
export function getEntryForDate(date: Date): MoodEntry | null {
  const entries = getMoodEntries();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  
  return entries.find(entry => entry.date.startsWith(dateStr)) || null;
}

// Format date for display
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Get mood label based on level
export function getMoodLabel(level: MoodLevel): string {
  switch (level) {
    case 1: return "Very Low";
    case 2: return "Low";
    case 3: return "Neutral";
    case 4: return "Good";
    case 5: return "Excellent";
    default: return "Unknown";
  }
}

// Get color based on mood level
export function getMoodColor(level: MoodLevel): string {
  switch (level) {
    case 1: return "#ef4444"; // red-500
    case 2: return "#f97316"; // orange-500
    case 3: return "#eab308"; // yellow-500
    case 4: return "#84cc16"; // lime-500
    case 5: return "#22c55e"; // green-500
    default: return "#94a3b8"; // slate-400
  }
}

// Get information about mood scoring methodology
export function getMoodAnalyticsInfo(): MoodAnalytics[] {
  return [
    {
      title: "Average Mood Level",
      description: "The arithmetic mean of all your mood entries, giving an overall picture of your emotional state.",
      methodology: "Calculated by summing all mood levels and dividing by the number of entries."
    },
    {
      title: "Streak Days",
      description: "The number of consecutive days you've tracked your mood without missing a day.",
      methodology: "Based on the Seinfeld 'Don't Break the Chain' method, which is proven to build lasting habits through consistency."
    },
    {
      title: "Improvement Rate",
      description: "How your mood is trending compared to the previous period.",
      methodology: "Calculated using a rolling average comparison between the most recent 7 days and the 7 days before that, expressed as a percentage change."
    },
    {
      title: "Variability Score",
      description: "How much your mood fluctuates day to day.",
      methodology: "Calculated using standard deviation, a statistical measure that quantifies the amount of variation in your mood levels."
    },
    {
      title: "Habit Consistency",
      description: "How consistently you're tracking your mood.",
      methodology: "Percentage of days in the last 30 days that have a mood entry, based on the habit formation research by BJ Fogg which shows that consistency is more important than intensity in forming lasting habits."
    }
  ];
}
