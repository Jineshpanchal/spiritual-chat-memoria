
import { useState, useEffect } from "react";
import { ChatHistory, Message } from "@/types/chat";
import { toast } from "sonner";
import {
  getChats,
  saveChats,
  getCurrentChatId,
  saveCurrentChatId,
  getUserContext,
  updateUserContext,
  getDifyApiKey,
  getDifyApiBaseUrl,
} from "@/utils/storage";
import {
  createNewChat,
  generateChatId,
  generateChatTitle,
  extractUserContext,
} from "@/utils/chatUtils";
import { sendMessageToDify } from "@/utils/difyApi";

export const useChat = () => {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState({});

  // Initialize from localStorage
  useEffect(() => {
    const storedChats = getChats();
    const storedCurrentChatId = getCurrentChatId();
    const storedUserContext = getUserContext();
    
    // Load API configuration
    getDifyApiKey();
    getDifyApiBaseUrl();

    setChatHistories(storedChats);
    setCurrentChatId(storedCurrentChatId);
    setUserContext(storedUserContext);
  }, []);

  // Get current chat
  const currentChat = currentChatId
    ? chatHistories.find((chat) => chat.id === currentChatId) || null
    : null;

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

  return {
    chatHistories,
    currentChatId,
    currentChat,
    isLoading,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleSendMessage,
  };
};
