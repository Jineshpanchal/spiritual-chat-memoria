
import React from "react";
import { MoodEntry, MoodLevel } from "@/types/mood";
import { formatDate, getMoodLabel, getMoodColor } from "@/utils/moodUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, Calendar } from "lucide-react";

interface MoodJournalEntriesProps {
  entries: MoodEntry[];
}

const MoodJournalEntries = ({ entries }: MoodJournalEntriesProps) => {
  if (entries.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-2">
          <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="font-medium text-lg">No journal entries yet</h3>
          <p className="text-muted-foreground">
            Start tracking your spiritual journey by adding your first entry.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MessageSquare className="h-5 w-5" /> Journal Entries
      </h2>
      
      <div className="space-y-4">
        {sortedEntries.map((entry) => (
          <Card key={entry.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">
                  {formatDate(entry.date)}
                </CardTitle>
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{ backgroundColor: `${getMoodColor(entry.level)}20`, color: getMoodColor(entry.level) }}
                >
                  <Star className="h-3 w-3" />
                  <span>{getMoodLabel(entry.level)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {entry.notes ? (
                <p className="text-sm text-muted-foreground">{entry.notes}</p>
              ) : (
                <p className="text-sm italic text-muted-foreground">No notes for this entry</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MoodJournalEntries;
