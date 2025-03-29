
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { getMoodAnalyticsInfo } from "@/utils/moodUtils";

const MoodAnalyticsInfo = () => {
  const analyticsInfo = getMoodAnalyticsInfo();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <AlertCircle size={16} />
          <span>How it works</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mood Tracking Methodology</DialogTitle>
          <DialogDescription>
            Our scientifically-backed methods for tracking and analyzing your emotional well-being.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4 pr-4">
          {analyticsInfo.map((info, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold text-primary">{info.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-2">{info.description}</p>
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Methodology</h4>
                <p className="text-sm">{info.methodology}</p>
              </div>
            </div>
          ))}
          <div className="my-4 p-4 border border-primary/20 bg-primary/5 rounded-md">
            <h3 className="text-md font-medium text-primary">Research-based approach</h3>
            <p className="text-sm mt-2">
              Our mood tracking system is based on positive psychology principles and habit formation research by experts like BJ Fogg (Stanford), 
              Charles Duhigg, and James Clear. We incorporate evidence-based metrics from cognitive behavioral therapy to help you understand patterns 
              in your emotional wellbeing.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MoodAnalyticsInfo;
