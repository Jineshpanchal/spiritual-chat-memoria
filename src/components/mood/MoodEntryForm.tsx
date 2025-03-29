
import React, { useState, useEffect } from "react";
import { MoodLevel, MoodEntry } from "@/types/mood";
import { addMoodEntry, getMoodEntries } from "@/utils/moodUtils";
import { toast } from "sonner";
import MoodSelector from "./MoodSelector";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MoodDatePicker from "./MoodDatePicker";

interface MoodEntryFormProps {
  onSave: () => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const MoodEntryForm = ({ onSave, selectedDate, onDateChange }: MoodEntryFormProps) => {
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<MoodEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Check if there's an entry for the selected date
  useEffect(() => {
    const entries = getMoodEntries();
    
    // Format date to YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    // Find entry for selected date
    const entry = entries.find(e => e.date.startsWith(formattedDate));
    
    if (entry) {
      setCurrentEntry(entry);
      setSelectedMood(entry.level);
      setNotes(entry.notes);
      setIsEditing(true);
    } else {
      setCurrentEntry(null);
      setSelectedMood(null);
      setNotes("");
      setIsEditing(false);
    }
  }, [selectedDate]);

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMood === null) {
      toast.error("Please select your mood level");
      return;
    }

    setIsSubmitting(true);
    try {
      // Use the selected date when adding the entry
      const selectedDateIso = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        new Date().getHours(),
        new Date().getMinutes()
      ).toISOString();
      
      addMoodEntry(selectedMood, notes, [], selectedDateIso);
      toast.success(`Your mood entry has been ${isEditing ? 'updated' : 'saved'}!`);
      onSave();
    } catch (error) {
      console.error("Error saving mood entry:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'save'} your mood entry`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isToday(selectedDate) ? "Today's" : "Edit"} Spiritual Journey</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <MoodDatePicker 
            selectedDate={selectedDate} 
            onDateChange={onDateChange}
          />
          
          <MoodSelector 
            selectedMood={selectedMood} 
            onChange={setSelectedMood} 
          />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Reflections</h3>
            <Textarea
              placeholder="Share your thoughts, reflections, or spiritual insights from today..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isSubmitting || selectedMood === null}
            className="w-full"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Journal Entry" : "Save Journal Entry"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MoodEntryForm;
