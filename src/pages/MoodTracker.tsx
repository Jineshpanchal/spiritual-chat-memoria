
import React, { useState, useEffect } from "react";
import { getMoodEntries, getMoodSummary, getEntriesForPastDays } from "@/utils/moodUtils";
import { MoodEntry } from "@/types/mood";
import Navigation from "@/components/Navigation";
import MoodEntryForm from "@/components/mood/MoodEntryForm";
import MoodSummaryCard from "@/components/mood/MoodSummaryCard";
import MoodChart from "@/components/mood/MoodChart";
import MoodJournalEntries from "@/components/mood/MoodJournalEntries";
import ExportDataButton from "@/components/mood/ExportDataButton";
import MoodAnalyticsInfo from "@/components/mood/MoodAnalyticsInfo";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";

const MoodTracker = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [activeTab, setActiveTab] = useState<string>("journal");
  const [timeRange, setTimeRange] = useState<number>(30);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const isMobile = useIsMobile();
  
  // Load mood entries from storage
  const loadEntries = () => {
    const allEntries = getMoodEntries();
    setEntries(allEntries);
  };
  
  useEffect(() => {
    loadEntries();
  }, []);
  
  // Get entries for chart based on selected time range
  const chartEntries = getEntriesForPastDays(timeRange);
  
  // Get mood summary
  const summary = getMoodSummary();

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Check if the selected date has an entry
  const hasEntryForSelectedDate = entries.some(entry => {
    const entryDate = new Date(entry.date);
    const selected = new Date(selectedDate);
    return (
      entryDate.getFullYear() === selected.getFullYear() &&
      entryDate.getMonth() === selected.getMonth() &&
      entryDate.getDate() === selected.getDate()
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      
      <div className={`container max-w-4xl flex-1 ${isMobile ? 'px-2 py-2' : 'py-4'} flex flex-col gap-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Spiritual Mood Tracker</h1>
            <div className="ml-2 px-2 py-1 bg-purple-100 rounded-full text-xs font-medium text-purple-800 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {hasEntryForSelectedDate ? "Entry Exists" : "No Entry"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ExportDataButton />
            <MoodAnalyticsInfo />
          </div>
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
          {/* Left column - Entry form and summary */}
          <div className={`${isMobile ? '' : 'col-span-1'} space-y-4`}>
            <MoodEntryForm 
              onSave={loadEntries} 
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
            <MoodSummaryCard summary={summary} />
          </div>
          
          {/* Right column - Chart and journal entries */}
          <div className={`${isMobile ? '' : 'col-span-2'} flex flex-col gap-4`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="journal">Journal</TabsTrigger>
                  <TabsTrigger value="chart">Progress Chart</TabsTrigger>
                </TabsList>
                
                {activeTab === "chart" && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTimeRange(7)}
                      className={timeRange === 7 ? "bg-primary text-primary-foreground" : ""}
                    >
                      7 Days
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTimeRange(30)}
                      className={timeRange === 30 ? "bg-primary text-primary-foreground" : ""}
                    >
                      30 Days
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTimeRange(90)}
                      className={timeRange === 90 ? "bg-primary text-primary-foreground" : ""}
                    >
                      90 Days
                    </Button>
                  </div>
                )}
              </div>
              
              <TabsContent value="journal" className="mt-0">
                <MoodJournalEntries 
                  entries={entries} 
                  onEntrySelect={handleDateChange} 
                  selectedDate={selectedDate}
                />
              </TabsContent>
              
              <TabsContent value="chart" className="mt-0">
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Mood History</h2>
                    <div className="text-xs text-muted-foreground">
                      {entries.length} total entries
                    </div>
                  </div>
                  <MoodChart entries={chartEntries} days={timeRange} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
