
import React, { useState, useEffect } from "react";
import { MoodLevel, MoodEntry } from "@/types/mood";
import { addMoodEntry, getMoodEntries } from "@/utils/moodUtils";
import { toast } from "sonner";
import MoodSelector from "./MoodSelector";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MoodDatePicker from "./MoodDatePicker";
import { AlertCircle, Calendar, Edit } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  // Check if the selected date is in the future
  const isFutureDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
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

  // Determine if the form should be readonly
  const isReadOnly = !isToday(selectedDate);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {isToday(selectedDate) 
              ? "Today's Spiritual Journey" 
              : isFutureDate(selectedDate)
                ? "Future Date"
                : "Past Reflection"}
          </CardTitle>
          {currentEntry && !isToday(selectedDate) && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(currentEntry.date).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <MoodDatePicker 
            selectedDate={selectedDate} 
            onDateChange={onDateChange}
          />
          
          {isFutureDate(selectedDate) ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You cannot create entries for future dates.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <MoodSelector 
                selectedMood={selectedMood} 
                onChange={setSelectedMood}
                readOnly={isReadOnly}
              />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Reflections</h3>
                  {isReadOnly && currentEntry && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Edit className="h-3 w-3 mr-1" />
                      View only
                    </div>
                  )}
                </div>
                <Textarea
                  placeholder={isReadOnly 
                    ? "You can only view past reflections" 
                    : "Share your thoughts, reflections, or spiritual insights from today..."}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                  readOnly={isReadOnly}
                />
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter>
          {isToday(selectedDate) && !isFutureDate(selectedDate) && (
            <Button 
              type="submit" 
              disabled={isSubmitting || selectedMood === null}
              className="w-full"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Journal Entry" : "Save Journal Entry"}
            </Button>
          )}
          {!isToday(selectedDate) && !isFutureDate(selectedDate) && currentEntry && (
            <Button 
              type="button" 
              variant="outline"
              className="w-full"
              onClick={() => {
                const today = new Date();
                onDateChange(today);
                toast.info("Switched to today for editing");
              }}
            >
              Switch to Today to Create Entry
            </Button>
          )}
          {!isToday(selectedDate) && !isFutureDate(selectedDate) && !currentEntry && (
            <Button 
              type="button" 
              variant="outline"
              className="w-full"
              onClick={() => {
                const today = new Date();
                onDateChange(today);
                toast.info("Switched to today for creating a new entry");
              }}
            >
              Switch to Today to Create Entry
            </Button>
          )}
          {isFutureDate(selectedDate) && (
            <Button 
              type="button" 
              variant="outline"
              className="w-full"
              onClick={() => {
                const today = new Date();
                onDateChange(today);
                toast.info("Switched to today");
              }}
            >
              Switch to Today's Date
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default MoodEntryForm;
