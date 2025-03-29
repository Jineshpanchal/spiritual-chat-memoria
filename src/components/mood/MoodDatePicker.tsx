
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

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Disable future dates
  const disabledDays = { after: new Date() };

  return (
    <div className="flex flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              "border border-input bg-spiritual-softGray/20 hover:bg-spiritual-softGray/30"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            {format(selectedDate, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
            disabled={disabledDays}
            className={cn("p-3 pointer-events-auto bg-white")}
            modifiers={{
              hasEntry: datesWithEntries,
              today: [new Date()]
            }}
            modifiersClassNames={{
              hasEntry: "bg-primary/10 font-medium",
              today: "bg-spiritual-softBlue text-primary font-bold"
            }}
            components={{
              DayContent: ({ date }) => (
                <div className="relative flex items-center justify-center w-full h-full">
                  <div>{date.getDate()}</div>
                  {hasEntry(date) && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
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
