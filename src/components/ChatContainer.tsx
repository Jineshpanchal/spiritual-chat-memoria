
import React, { useRef, useEffect } from "react";
import { Message, ChatHistory } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatContainerProps {
  currentChat: ChatHistory | null;
  isLoading: boolean;
  onSuggestedQuestionSelect: (question: string) => void;
}

const ChatContainer = ({ 
  currentChat, 
  isLoading, 
  onSuggestedQuestionSelect 
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages]);

  if (!currentChat) return null;

  return (
    <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-2' : 'p-4'} scrollbar-thin rounded-2xl bg-chat-gradient spiritual-shadow`}>
      {currentChat.messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <p className="text-muted-foreground max-w-md mb-8">
            Start your spiritual journey by sending a message.
          </p>
          <SuggestedQuestions onSelect={onSuggestedQuestionSelect} />
        </div>
      ) : (
        <>
          {currentChat.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {currentChat.messages.length > 0 && 
            currentChat.messages[currentChat.messages.length - 1].role === "assistant" && (
            <SuggestedQuestions onSelect={onSuggestedQuestionSelect} />
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatContainer;
