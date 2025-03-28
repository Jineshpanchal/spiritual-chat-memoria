
import { Button } from "@/components/ui/button";
import { ChatHistory } from "@/types/chat";
import { PlusIcon } from "lucide-react";

interface ChatHeaderProps {
  currentChat: ChatHistory | null;
  onNewChat: () => void;
}

const ChatHeader = ({
  currentChat,
  onNewChat,
}: ChatHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-2xl spiritual-shadow border border-border/40">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold text-foreground">
          Spiritual Helper
        </h1>
        <span className="text-sm text-muted-foreground">by Brahma Kumaris</span>
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
      </div>
    </header>
  );
};

export default ChatHeader;
