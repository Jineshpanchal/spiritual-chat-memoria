
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChatHistory } from "@/types/chat";
import { formatTimestamp } from "@/utils/chatUtils";
import { ListIcon, MessageCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHistorySidebarProps {
  chatHistories: ChatHistory[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

const ChatHistorySidebar = ({
  chatHistories,
  currentChatId,
  onSelectChat,
  onDeleteChat,
}: ChatHistorySidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed bottom-20 left-4 z-10 h-10 w-10 rounded-full bg-white shadow-md"
        >
          <ListIcon size={16} />
          <span className="sr-only">Chat History</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Chat History</SheetTitle>
          <SheetDescription>
            Your previous conversations are saved locally.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin">
          {chatHistories.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <MessageCircle className="mx-auto h-10 w-10 opacity-20" />
              <p className="mt-2">No chat history yet</p>
            </div>
          ) : (
            chatHistories
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-center justify-between rounded-md p-3 text-sm",
                    "hover:bg-accent transition-colors duration-200",
                    currentChatId === chat.id && "bg-accent"
                  )}
                >
                  <div
                    className="flex-1 cursor-pointer truncate"
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="font-medium truncate">{chat.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {chat.messages.length} messages · Updated {formatTimestamp(chat.updatedAt)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => onDeleteChat(chat.id)}
                  >
                    <Trash2 size={16} />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatHistorySidebar;
