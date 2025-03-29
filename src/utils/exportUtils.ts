
import { MoodEntry } from "@/types/mood";
import { ChatHistory } from "@/types/chat";
import { getMoodEntries } from "./moodUtils";
import { getChats } from "./storage";

// Export mood data as JSON
export function exportMoodData(): string {
  const entries = getMoodEntries();
  return JSON.stringify(entries, null, 2);
}

// Export chat data as JSON
export function exportChatData(): string {
  const chats = getChats();
  return JSON.stringify(chats, null, 2);
}

// Export all data as JSON
export function exportAllData(): string {
  const data = {
    mood_entries: getMoodEntries(),
    chat_histories: getChats()
  };
  return JSON.stringify(data, null, 2);
}

// Download file
export function downloadAsFile(content: string, filename: string, type: string = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export mood data as CSV
export function exportMoodDataAsCSV(): string {
  const entries = getMoodEntries();
  if (entries.length === 0) return '';
  
  // CSV header
  const headers = ['Date', 'Mood Level', 'Notes', 'Tags'];
  
  // Map entries to CSV rows
  const rows = entries.map(entry => [
    new Date(entry.date).toLocaleString(),
    entry.level.toString(),
    `"${entry.notes.replace(/"/g, '""')}"`,
    `"${entry.tags.join(',').replace(/"/g, '""')}"`
  ]);
  
  // Combine header and rows
  return [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
}

// Export mood data specifically for visualization
export function exportMoodDataForVisualization(): { dates: string[], levels: number[] } {
  const entries = getMoodEntries();
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return {
    dates: sortedEntries.map(entry => new Date(entry.date).toLocaleDateString()),
    levels: sortedEntries.map(entry => entry.level)
  };
}
