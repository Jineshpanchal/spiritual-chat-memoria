
// This is a configuration file for the application
// In a production environment, this would be handled by environment variables

export const DIFY_CONFIG = {
  // Default API key for public access - this would be replaced with an environment variable in production
  API_KEY: "app-xuCbTKZQt2ASjXU6treUHu91", 
  API_URL: "https://api.dify.ai/v1/chat-messages",
}

// Customize storage keys
export const STORAGE_KEYS = {
  CHATS: "bk_spiritual_chat_histories",
  CURRENT_CHAT: "bk_spiritual_current_chat",
  USER_CONTEXT: "bk_spiritual_user_context",
  API_KEY: "bk_spiritual_dify_api_key",
}
