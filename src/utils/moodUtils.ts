
import { MoodEntry, MoodLevel, MoodSummary } from "@/types/mood";
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

// Add a new mood entry
export function addMoodEntry(level: MoodLevel, notes: string, tags: string[] = []): MoodEntry {
  const entries = getMoodEntries();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if an entry already exists for today
  const existingEntryIndex = entries.findIndex(entry => entry.date.startsWith(today));
  
  const newEntry: MoodEntry = {
    id: existingEntryIndex >= 0 ? entries[existingEntryIndex].id : crypto.randomUUID(),
    date: new Date().toISOString(),
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

// Get mood summary statistics
export function getMoodSummary(): MoodSummary {
  const entries = getMoodEntries();
  
  if (entries.length === 0) {
    return {
      averageLevel: 0,
      totalEntries: 0,
      streakDays: 0,
      improvementRate: 0
    };
  }
  
  const averageLevel = entries.reduce((sum, entry) => sum + entry.level, 0) / entries.length;
  const streakDays = calculateStreak(entries);
  const improvementRate = calculateImprovementRate(entries);
  
  return {
    averageLevel,
    totalEntries: entries.length,
    streakDays,
    improvementRate
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
