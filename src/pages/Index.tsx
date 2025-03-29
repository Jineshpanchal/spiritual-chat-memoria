
import React from "react";
import ChatInput from "@/components/ChatInput";
import ChatHeader from "@/components/ChatHeader";
import EmptyState from "@/components/EmptyState";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import ChatContainer from "@/components/ChatContainer";
import Navigation from "@/components/Navigation";
import { useChat } from "@/hooks/use-chat";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const {
    chatHistories,
    currentChatId,
    currentChat,
    isLoading,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleSendMessage,
  } = useChat();
  
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      
      <div className={`container max-w-4xl flex-1 ${isMobile ? 'px-2 py-2' : 'py-4'} flex flex-col`}>
        <ChatHeader
          currentChat={currentChat}
          onNewChat={handleNewChat}
        />

        <div className="flex-1 my-2 overflow-hidden flex flex-col">
          {!currentChat ? (
            <EmptyState onNewChat={handleNewChat} />
          ) : (
            <>
              <ChatContainer 
                currentChat={currentChat} 
                isLoading={isLoading}
                onSuggestedQuestionSelect={handleSendMessage}
              />
              <div className={`${isMobile ? 'mt-2' : 'mt-4'}`}>
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      <ChatHistorySidebar
        chatHistories={chatHistories}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />
    </div>
  );
};

export default Index;
