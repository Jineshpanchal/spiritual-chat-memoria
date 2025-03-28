
import { Button } from "@/components/ui/button";
import { ChatHistory } from "@/types/chat";
import { PlusIcon, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  currentChat: ChatHistory | null;
  onNewChat: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

const ChatHeader = ({
  currentChat,
  onNewChat,
  onOpenSettings,
  hasApiKey,
}: ChatHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-2xl spiritual-shadow border border-border/40">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold text-foreground">
          Spiritual Guide
        </h1>
        {!hasApiKey && (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            API Key Needed
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          onClick={onNewChat}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
        >
          <PlusIcon size={16} />
          <span className="hidden sm:inline">New Chat</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Settings size={18} />
              <span className="sr-only">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenSettings}>
              API Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;
