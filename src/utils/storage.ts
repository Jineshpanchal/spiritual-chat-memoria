
import { ChatHistory, Message, UserContext } from "@/types/chat";

const CHATS_STORAGE_KEY = "spiritual_chat_histories";
const CURRENT_CHAT_KEY = "spiritual_current_chat";
const USER_CONTEXT_KEY = "spiritual_user_context";
const API_KEY_STORAGE_KEY = "spiritual_dify_api_key";

// Chat History Storage
export function saveChats(chats: ChatHistory[]): void {
  try {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Error saving chats to localStorage:", error);
  }
}

export function getChats(): ChatHistory[] {
  try {
    const storedChats = localStorage.getItem(CHATS_STORAGE_KEY);
    return storedChats ? JSON.parse(storedChats) : [];
  } catch (error) {
    console.error("Error getting chats from localStorage:", error);
    return [];
  }
}

export function saveCurrentChatId(chatId: string): void {
  try {
    localStorage.setItem(CURRENT_CHAT_KEY, chatId);
  } catch (error) {
    console.error("Error saving current chat ID to localStorage:", error);
  }
}

export function getCurrentChatId(): string | null {
  try {
    return localStorage.getItem(CURRENT_CHAT_KEY);
  } catch (error) {
    console.error("Error getting current chat ID from localStorage:", error);
    return null;
  }
}

// User Context Storage
export function saveUserContext(context: UserContext): void {
  try {
    localStorage.setItem(USER_CONTEXT_KEY, JSON.stringify(context));
  } catch (error) {
    console.error("Error saving user context to localStorage:", error);
  }
}

export function getUserContext(): UserContext {
  try {
    const storedContext = localStorage.getItem(USER_CONTEXT_KEY);
    return storedContext ? JSON.parse(storedContext) : {};
  } catch (error) {
    console.error("Error getting user context from localStorage:", error);
    return {};
  }
}

export function updateUserContext(updates: Partial<UserContext>): UserContext {
  const currentContext = getUserContext();
  const updatedContext = { ...currentContext, ...updates };
  saveUserContext(updatedContext);
  return updatedContext;
}

// API Key Storage
export function saveDifyApiKey(apiKey: string): void {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  } catch (error) {
    console.error("Error saving API key to localStorage:", error);
  }
}

export function getDifyApiKey(): string | null {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error("Error getting API key from localStorage:", error);
    return null;
  }
}
