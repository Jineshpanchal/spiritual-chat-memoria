
import React from "react";
import { cn } from "@/lib/utils";
import { MoodLevel } from "@/types/mood";
import { getMoodLabel } from "@/utils/moodUtils";

interface MoodSelectorProps {
  selectedMood: MoodLevel | null;
  onChange: (mood: MoodLevel) => void;
  readOnly?: boolean;
}

const MoodSelector = ({ selectedMood, onChange, readOnly = false }: MoodSelectorProps) => {
  const moods: MoodLevel[] = [1, 2, 3, 4, 5];

  const getEmoji = (level: MoodLevel) => {
    switch (level) {
      case 1: return "😞"; // Very Low
      case 2: return "😔"; // Low
      case 3: return "😐"; // Neutral
      case 4: return "🙂"; // Good 
      case 5: return "😊"; // Excellent
      default: return "😐";
    }
  };

  const getColor = (level: MoodLevel) => {
    switch (level) {
      case 1: return "bg-red-500 border-red-600 hover:bg-red-600";
      case 2: return "bg-orange-500 border-orange-600 hover:bg-orange-600";
      case 3: return "bg-yellow-500 border-yellow-600 hover:bg-yellow-600";
      case 4: return "bg-lime-500 border-lime-600 hover:bg-lime-600";
      case 5: return "bg-green-500 border-green-600 hover:bg-green-600";
      default: return "bg-gray-500 border-gray-600 hover:bg-gray-600";
    }
  };

  const getSelectedStyles = (level: MoodLevel) => {
    return level === selectedMood
      ? "ring-2 ring-offset-2 ring-primary"
      : "opacity-70";
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">How are you feeling today?</h3>
      <div className="flex justify-between items-center">
        {moods.map((mood) => (
          <button
            key={mood}
            type="button"
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg transition-all",
              "border-2",
              getColor(mood),
              getSelectedStyles(mood),
              readOnly && "cursor-default opacity-70 hover:bg-none pointer-events-none",
              !selectedMood && "opacity-90"
            )}
            onClick={() => !readOnly && onChange(mood)}
            disabled={readOnly}
          >
            <span className="text-2xl">{getEmoji(mood)}</span>
            <span className="mt-1 text-white text-xs font-medium">
              {getMoodLabel(mood)}
            </span>
          </button>
        ))}
      </div>
      {selectedMood && (
        <p className="text-center text-sm mt-2">
          You selected: <strong>{getMoodLabel(selectedMood)}</strong>
        </p>
      )}
    </div>
  );
};

export default MoodSelector;
