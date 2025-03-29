
import React, { useState } from "react";
import { MoodLevel } from "@/types/mood";
import { addMoodEntry } from "@/utils/moodUtils";
import { toast } from "sonner";
import MoodSelector from "./MoodSelector";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface MoodEntryFormProps {
  onSave: () => void;
}

const MoodEntryForm = ({ onSave }: MoodEntryFormProps) => {
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMood === null) {
      toast.error("Please select your mood level");
      return;
    }

    setIsSubmitting(true);
    try {
      addMoodEntry(selectedMood, notes);
      toast.success("Your mood entry has been saved!");
      setSelectedMood(null);
      setNotes("");
      onSave();
    } catch (error) {
      console.error("Error saving mood entry:", error);
      toast.error("Failed to save your mood entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Today's Spiritual Journey</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
            {isSubmitting ? "Saving..." : "Save Journal Entry"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MoodEntryForm;
