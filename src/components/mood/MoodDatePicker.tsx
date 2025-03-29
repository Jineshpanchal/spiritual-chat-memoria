
import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getMoodEntries } from "@/utils/moodUtils";

interface MoodDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const MoodDatePicker = ({ selectedDate, onDateChange }: MoodDatePickerProps) => {
  const entries = getMoodEntries();
  
  // Get dates that have entries
  const datesWithEntries = entries.map(entry => {
    const date = new Date(entry.date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });

  // Function to check if a date has an entry
  const hasEntry = (date: Date) => {
    return datesWithEntries.some(entryDate => 
      entryDate.getTime() === new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">Select Date</h3>
        <span className="text-xs text-muted-foreground">
          {hasEntry(selectedDate) ? "Entry exists" : "No entry"}
        </span>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              "border border-input",
              hasEntry(selectedDate) && "bg-primary/10"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedDate, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
            modifiers={{
              hasEntry: datesWithEntries,
            }}
            modifiersClassNames={{
              hasEntry: "bg-primary/20 text-primary font-medium",
            }}
            components={{
              DayContent: ({ date }) => (
                <div className="relative">
                  <div>{date.getDate()}</div>
                  {hasEntry(date) && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                  )}
                </div>
              ),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MoodDatePicker;
