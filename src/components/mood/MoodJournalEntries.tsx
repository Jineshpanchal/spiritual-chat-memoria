
import React from "react";
import { MoodEntry } from "@/types/mood";
import { formatDate, getMoodColor, getMoodLabel } from "@/utils/moodUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoodJournalEntriesProps {
  entries: MoodEntry[];
  onEntrySelect: (date: Date) => void;
  selectedDate?: Date;
}

const MoodJournalEntries = ({ entries, onEntrySelect, selectedDate }: MoodJournalEntriesProps) => {
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const isSelectedDate = (entry: MoodEntry): boolean => {
    if (!selectedDate) return false;
    
    const entryDate = new Date(entry.date);
    return (
      entryDate.getFullYear() === selectedDate.getFullYear() &&
      entryDate.getMonth() === selectedDate.getMonth() &&
      entryDate.getDate() === selectedDate.getDate()
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEntries.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <Card 
                  key={entry.id} 
                  className={cn(
                    "overflow-hidden transition-all",
                    isSelectedDate(entry) && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <div 
                    className="h-2" 
                    style={{ backgroundColor: getMoodColor(entry.level) }}
                  ></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formatDate(entry.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEntrySelect(new Date(entry.date))}
                          className="h-7 px-2 flex gap-1 items-center"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span className="text-xs">View</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ 
                        backgroundColor: `${getMoodColor(entry.level)}20`,
                        color: getMoodColor(entry.level)
                      }}>
                        {getMoodLabel(entry.level)}
                      </span>
                    </div>
                    
                    {entry.notes && (
                      <div className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                        {entry.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No journal entries yet.</p>
            <p className="text-sm mt-2">Start tracking your mood today!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodJournalEntries;
