
import React from "react";
import { MoodLevel } from "@/types/mood";
import { getMoodLabel, getMoodColor } from "@/utils/moodUtils";
import { Smile, Frown, Meh } from "lucide-react";

interface MoodSelectorProps {
  selectedMood: MoodLevel | null;
  onChange: (level: MoodLevel) => void;
}

const MoodSelector = ({ selectedMood, onChange }: MoodSelectorProps) => {
  const moods: { level: MoodLevel; icon: React.ReactNode }[] = [
    { level: 1, icon: <Frown className="w-6 h-6" /> },
    { level: 2, icon: <Frown className="w-6 h-6" /> },
    { level: 3, icon: <Meh className="w-6 h-6" /> },
    { level: 4, icon: <Smile className="w-6 h-6" /> },
    { level: 5, icon: <Smile className="w-6 h-6" /> },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">How do you feel today?</h3>
      <div className="flex justify-between items-center">
        {moods.map(({ level, icon }) => (
          <button
            key={level}
            className={`flex flex-col items-center p-2 rounded-full w-16 h-16 transition-all ${
              selectedMood === level
                ? `ring-2 ring-offset-2 bg-${level === 1 ? 'red' : level === 2 ? 'orange' : level === 3 ? 'yellow' : level === 4 ? 'lime' : 'green'}-100`
                : "hover:bg-slate-100"
            }`}
            onClick={() => onChange(level)}
            style={{ color: selectedMood === level ? getMoodColor(level) : undefined }}
          >
            {icon}
            <span className="text-xs mt-1">{getMoodLabel(level)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
