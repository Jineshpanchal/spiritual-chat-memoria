
import React from "react";
import ChatInput from "@/components/ChatInput";
import ChatHeader from "@/components/ChatHeader";
import EmptyState from "@/components/EmptyState";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import ChatContainer from "@/components/ChatContainer";
import { useChat } from "@/hooks/use-chat";

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container max-w-4xl flex-1 py-4 flex flex-col">
        <ChatHeader
          currentChat={currentChat}
          onNewChat={handleNewChat}
        />

        <div className="flex-1 my-4 overflow-hidden flex flex-col">
          {!currentChat ? (
            <EmptyState onNewChat={handleNewChat} />
          ) : (
            <>
              <ChatContainer 
                currentChat={currentChat} 
                isLoading={isLoading}
                onSuggestedQuestionSelect={handleSendMessage}
              />
              <div className="mt-4">
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
