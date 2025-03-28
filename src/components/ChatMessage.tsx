
import { Message } from "@/types/chat";
import { formatTimestamp } from "@/utils/chatUtils";
import { cn } from "@/lib/utils";
import { MessageCircle, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex animate-slide-in py-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className="flex max-w-[80%] items-start gap-3">
        {!isUser && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-spiritual-softBlue text-primary-foreground">
            <MessageCircle size={16} />
          </div>
        )}
        
        <div
          className={cn(
            isUser ? "user-message" : "bot-message",
            "space-y-1"
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
