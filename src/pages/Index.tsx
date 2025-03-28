
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatHeader from "@/components/ChatHeader";
import ApiKeyDialog from "@/components/ApiKeyDialog";
import EmptyState from "@/components/EmptyState";
import { ChatHistory, Message } from "@/types/chat";
import { toast } from "sonner";
import {
  getChats,
  saveChats,
  getCurrentChatId,
  saveCurrentChatId,
  getDifyApiKey,
  getUserContext,
  updateUserContext,
} from "@/utils/storage";
import {
  createNewChat,
  generateChatId,
  generateChatTitle,
  extractUserContext,
} from "@/utils/chatUtils";
import { sendMessageToDify } from "@/utils/difyApi";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";

const Index = () => {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const [userContext, setUserContext] = useState({});

  // Initialize from localStorage
  useEffect(() => {
    const storedChats = getChats();
    const storedCurrentChatId = getCurrentChatId();
    const storedApiKey = getDifyApiKey();
    const storedUserContext = getUserContext();

    setChatHistories(storedChats);
    setCurrentChatId(storedCurrentChatId);
    setApiKey(storedApiKey);
    setUserContext(storedUserContext);

    // If no API key is set, show the dialog
    if (!storedApiKey) {
      setIsApiDialogOpen(true);
    }
  }, []);

  // Get current chat
  const currentChat = currentChatId
    ? chatHistories.find((chat) => chat.id === currentChatId) || null
    : null;

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages]);

  // Create a new chat
  const handleNewChat = () => {
    const newChat = createNewChat();
    setChatHistories((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    saveCurrentChatId(newChat.id);
    saveChats([...chatHistories, newChat]);
  };

  // Select a chat
  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    saveCurrentChatId(chatId);
  };

  // Delete a chat
  const handleDeleteChat = (chatId: string) => {
    const updatedHistories = chatHistories.filter((chat) => chat.id !== chatId);
    setChatHistories(updatedHistories);
    saveChats(updatedHistories);

    // If the current chat was deleted, select another one or set to null
    if (currentChatId === chatId) {
      const newCurrentId = updatedHistories.length > 0 ? updatedHistories[0].id : null;
      setCurrentChatId(newCurrentId);
      saveCurrentChatId(newCurrentId);
    }
  };

  // Send a message
  const handleSendMessage = async (content: string) => {
    if (!apiKey) {
      setIsApiDialogOpen(true);
      return;
    }

    // Create or get the current chat
    let chat: ChatHistory;
    if (!currentChatId || !currentChat) {
      chat = createNewChat();
      setChatHistories((prev) => [...prev, chat]);
      setCurrentChatId(chat.id);
      saveCurrentChatId(chat.id);
    } else {
      chat = { ...currentChat };
    }

    // Add user message
    const userMessage: Message = {
      id: generateChatId(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = [...chat.messages, userMessage];
    const updatedChat: ChatHistory = {
      ...chat,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    // Extract context from the message
    const newContextData = extractUserContext([userMessage]);
    if (Object.keys(newContextData).length > 0) {
      const updatedContext = updateUserContext(newContextData);
      setUserContext(updatedContext);
    }

    // Update UI immediately with user message
    const updatedHistories = chatHistories.map((c) =>
      c.id === updatedChat.id ? updatedChat : c
    );
    if (!currentChatId) {
      updatedHistories.push(updatedChat);
    }
    setChatHistories(updatedHistories);
    saveChats(updatedHistories);

    // Send message to API
    setIsLoading(true);
    try {
      const response = await sendMessageToDify(content, {
        apiKey,
        conversationId: chat.id,
        userContext: { ...userContext, ...newContextData },
      });

      const assistantMessage: Message = {
        id: response.message_id || generateChatId(),
        role: "assistant",
        content: response.answer,
        timestamp: Date.now(),
      };

      // Add response to chat
      const finalMessages = [...updatedMessages, assistantMessage];
      const finalChat: ChatHistory = {
        ...updatedChat,
        title: updatedChat.title === "New Conversation" 
          ? generateChatTitle(finalMessages)
          : updatedChat.title,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      // Update chat histories
      const finalHistories = updatedHistories.map((c) =>
        c.id === finalChat.id ? finalChat : c
      );
      setChatHistories(finalHistories);
      saveChats(finalHistories);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-4xl flex-1 py-4 flex flex-col">
        <ChatHeader
          currentChat={currentChat}
          onNewChat={handleNewChat}
          onOpenSettings={() => setIsApiDialogOpen(true)}
          hasApiKey={!!apiKey}
        />

        <div className="flex-1 my-4 overflow-hidden flex flex-col">
          {!currentChat ? (
            <EmptyState
              hasApiKey={!!apiKey}
              onNewChat={handleNewChat}
              onSetupApi={() => setIsApiDialogOpen(true)}
            />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin rounded-2xl bg-chat-gradient spiritual-shadow">
                {currentChat.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <p className="text-muted-foreground max-w-md">
                      Start your spiritual journey by sending a message.
                    </p>
                  </div>
                ) : (
                  <>
                    {currentChat.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
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
      
      <ApiKeyDialog
        isOpen={isApiDialogOpen}
        onClose={() => setIsApiDialogOpen(false)}
        currentApiKey={apiKey}
      />
    </div>
  );
};

export default Index;
