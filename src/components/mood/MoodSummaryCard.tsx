
import React from "react";
import { MoodSummary } from "@/types/mood";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Heart, Star } from "lucide-react";

interface MoodSummaryCardProps {
  summary: MoodSummary;
}

const MoodSummaryCard = ({ summary }: MoodSummaryCardProps) => {
  const { averageLevel, totalEntries, streakDays, improvementRate } = summary;
  
  // Calculate average mood as percentage (1-5 scale to 0-100%)
  const moodPercentage = (averageLevel / 5) * 100;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Spiritual Journey Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Average Mood</span>
            <span className="font-medium">{averageLevel.toFixed(1)} / 5</span>
          </div>
          <Progress value={moodPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <CalendarCheck className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium">{totalEntries}</span>
            <span className="text-xs text-muted-foreground">Entries</span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium">{streakDays}</span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium">{improvementRate > 0 ? '+' : ''}{improvementRate.toFixed(1)}%</span>
            <span className="text-xs text-muted-foreground">Improvement</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodSummaryCard;
