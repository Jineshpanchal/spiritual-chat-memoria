
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Download, FileText } from "lucide-react";
import { 
  exportMoodData, 
  exportMoodDataAsCSV, 
  exportChatData, 
  exportAllData,
  downloadAsFile 
} from "@/utils/exportUtils";

const ExportDataButton = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (type: string) => {
    setIsExporting(true);
    
    try {
      let content: string;
      let filename: string;
      let fileType: string = 'application/json';
      
      switch (type) {
        case 'mood-json':
          content = exportMoodData();
          filename = `spiritual-mood-data-${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'mood-csv':
          content = exportMoodDataAsCSV();
          filename = `spiritual-mood-data-${new Date().toISOString().split('T')[0]}.csv`;
          fileType = 'text/csv';
          break;
        case 'chat':
          content = exportChatData();
          filename = `spiritual-chat-history-${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'all':
          content = exportAllData();
          filename = `spiritual-journey-data-${new Date().toISOString().split('T')[0]}.json`;
          break;
        default:
          throw new Error('Invalid export type');
      }
      
      downloadAsFile(content, filename, fileType);
      toast({
        title: "Export successful",
        description: `Your data has been exported to ${filename}`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting} className="flex items-center gap-1">
          <Download size={16} />
          <span>Export Data</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport('mood-json')}>
          <FileText size={14} className="mr-2" />
          Mood Data (JSON)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('mood-csv')}>
          <FileText size={14} className="mr-2" />
          Mood Data (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('chat')}>
          <FileText size={14} className="mr-2" />
          Chat History
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('all')}>
          <FileText size={14} className="mr-2" />
          All Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDataButton;
