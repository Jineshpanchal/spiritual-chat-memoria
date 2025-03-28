
import { ChatHistory, Message, UserContext } from "@/types/chat";
import { STORAGE_KEYS, DIFY_CONFIG } from "./config";

// Chat History Storage
export function saveChats(chats: ChatHistory[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  } catch (error) {
    console.error("Error saving chats to localStorage:", error);
  }
}

export function getChats(): ChatHistory[] {
  try {
    const storedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
    return storedChats ? JSON.parse(storedChats) : [];
  } catch (error) {
    console.error("Error getting chats from localStorage:", error);
    return [];
  }
}

export function saveCurrentChatId(chatId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT, chatId);
  } catch (error) {
    console.error("Error saving current chat ID to localStorage:", error);
  }
}

export function getCurrentChatId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT);
  } catch (error) {
    console.error("Error getting current chat ID from localStorage:", error);
    return null;
  }
}

// User Context Storage
export function saveUserContext(context: UserContext): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_CONTEXT, JSON.stringify(context));
  } catch (error) {
    console.error("Error saving user context to localStorage:", error);
  }
}

export function getUserContext(): UserContext {
  try {
    const storedContext = localStorage.getItem(STORAGE_KEYS.USER_CONTEXT);
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
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    // Update the config
    DIFY_CONFIG.API_KEY = apiKey;
  } catch (error) {
    console.error("Error saving Dify API key to localStorage:", error);
  }
}

export function getDifyApiKey(): string | null {
  try {
    const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
    // Update the config
    if (apiKey) {
      DIFY_CONFIG.API_KEY = apiKey;
    }
    return apiKey;
  } catch (error) {
    console.error("Error getting Dify API key from localStorage:", error);
    return null;
  }
}

// API Base URL Storage
export function saveDifyApiBaseUrl(baseUrl: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.API_BASE_URL, baseUrl);
    // Update the config
    DIFY_CONFIG.API_BASE_URL = baseUrl;
  } catch (error) {
    console.error("Error saving Dify API base URL to localStorage:", error);
  }
}

export function getDifyApiBaseUrl(): string | null {
  try {
    const baseUrl = localStorage.getItem(STORAGE_KEYS.API_BASE_URL);
    // Update the config
    if (baseUrl) {
      DIFY_CONFIG.API_BASE_URL = baseUrl;
    }
    return baseUrl;
  } catch (error) {
    console.error("Error getting Dify API base URL from localStorage:", error);
    return null;
  }
}
