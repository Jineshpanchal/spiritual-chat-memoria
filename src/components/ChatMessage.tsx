
import { Message } from "@/types/chat";
import { formatTimestamp } from "@/utils/chatUtils";
import { cn } from "@/lib/utils";
import { MessageCircle, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isMobile = useIsMobile();
  
  return (
    <div
      className={cn(
        "flex animate-slide-in py-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex items-start gap-3",
        isMobile ? "max-w-[90%]" : "max-w-[80%]"
      )}>
        {!isUser && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-spiritual-softBlue text-primary-foreground">
            <MessageCircle size={16} />
          </div>
        )}
        
        <div
          className={cn(
            isUser ? "user-message" : "bot-message",
            "space-y-1",
            isMobile ? (isUser ? "ml-6" : "mr-6") : (isUser ? "ml-12" : "mr-12")
          )}
        >
          <div className="break-words text-sm">{message.content}</div>
          <div className="text-xs text-muted-foreground text-right">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
        
        {isUser && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
