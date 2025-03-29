
// This is a configuration file for the application
// In a production environment, this would be handled by environment variables

export const DIFY_CONFIG = {
  // Default API key for public access - this would be replaced with an environment variable in production
  API_KEY: "", // Empty by default, will be provided by user
  API_BASE_URL: "https://api.dify.ai/v1", // Default Dify API URL
  API_PATH: "/chat-messages", // Endpoint path
}

// Get full API URL
export const getDifyApiUrl = () => {
  return `${DIFY_CONFIG.API_BASE_URL}${DIFY_CONFIG.API_PATH}`;
}

// Customize storage keys
export const STORAGE_KEYS = {
  CHATS: "bk_spiritual_chat_histories",
  CURRENT_CHAT: "bk_spiritual_current_chat",
  USER_CONTEXT: "bk_spiritual_user_context",
  API_KEY: "bk_spiritual_dify_api_key",
  API_BASE_URL: "bk_spiritual_dify_api_base_url",
  MOOD_ENTRIES: "bk_spiritual_mood_entries",
  EXPORTED_DATA: "bk_spiritual_exported_data",
}

// Storage mechanism - currently using localStorage
// This could be extended to use IndexedDB for larger storage needs
export const STORAGE_TYPE = {
  LOCAL_STORAGE: "localStorage",
  INDEXED_DB: "indexedDB",
}

export const CURRENT_STORAGE = STORAGE_TYPE.LOCAL_STORAGE;
