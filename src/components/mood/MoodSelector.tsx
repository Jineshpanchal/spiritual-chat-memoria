
import React from "react";
import { MoodLevel } from "@/types/mood";
import { getMoodLabel } from "@/utils/moodUtils";
import { Smile, Frown, Meh } from "lucide-react";

interface MoodSelectorProps {
  selectedMood: MoodLevel | null;
  onChange: (level: MoodLevel) => void;
}

const MoodSelector = ({ selectedMood, onChange }: MoodSelectorProps) => {
  // Define moods with proper icons
  const moods: { level: MoodLevel; icon: React.ReactNode; label: string }[] = [
    { level: 1, icon: <Frown className="w-6 h-6" />, label: "Very Low" },
    { level: 2, icon: <Frown className="w-6 h-6" />, label: "Low" },
    { level: 3, icon: <Meh className="w-6 h-6" />, label: "Neutral" },
    { level: 4, icon: <Smile className="w-6 h-6" />, label: "Good" },
    { level: 5, icon: <Smile className="w-6 h-6" />, label: "Excellent" },
  ];

  // Map mood levels to colors from spiritual palette
  const getMoodColor = (level: MoodLevel): string => {
    switch (level) {
      case 1: return "text-red-500 bg-spiritual-softPink/30";
      case 2: return "text-orange-500 bg-spiritual-softPeach/30";
      case 3: return "text-yellow-500 bg-spiritual-softPeach/30";
      case 4: return "text-lime-500 bg-spiritual-softBlue/30";
      case 5: return "text-green-500 bg-spiritual-softBlue/30";
      default: return "text-gray-500 bg-spiritual-softGray/30";
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">How do you feel today?</h3>
      <div className="flex justify-between items-center">
        {moods.map(({ level, icon, label }) => (
          <button
            key={level}
            className={`flex flex-col items-center p-3 rounded-full w-16 h-16 transition-all ${
              selectedMood === level
                ? `ring-2 ring-offset-2 ${getMoodColor(level)}`
                : "hover:bg-spiritual-softGray/50"
            }`}
            onClick={() => onChange(level)}
          >
            <div className={selectedMood === level ? "" : "text-muted-foreground"}>{icon}</div>
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
