
import { DifyResponse, Message } from "@/types/chat";
import { toast } from "sonner";
import { DIFY_CONFIG, getDifyApiUrl } from "./config";
import { getDifyApiKey, getDifyApiBaseUrl } from "./storage";

export interface DifyApiConfig {
  conversationId?: string;
  userContext?: Record<string, any>;
}

export async function sendMessageToDify(
  message: string,
  config: DifyApiConfig
): Promise<DifyResponse> {
  try {
    const { conversationId, userContext } = config;
    
    // Ensure we have the latest settings
    getDifyApiKey();
    getDifyApiBaseUrl();
    
    // Get the full API URL
    const apiUrl = getDifyApiUrl();
    
    console.log("Sending message to Dify API", { 
      message, 
      conversationId,
      apiUrl
    });
    
    if (!DIFY_CONFIG.API_KEY) {
      toast.error("API key is missing. Please set your API key in settings.");
      throw new Error("API key is required");
    }
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIFY_CONFIG.API_KEY}`,
      },
      body: JSON.stringify({
        inputs: userContext || {},
        query: message,
        response_mode: "blocking",
        conversation_id: conversationId,
        user: "public-user", // Generic user ID for public access
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Dify API error:", errorText);
      
      // Handle unauthorized error more gracefully
      if (response.status === 401) {
        toast.error("API authentication failed. Please check your API key.");
        throw new Error("API authentication failed");
      }
      
      toast.error(`Error: ${response.statusText}`);
      throw new Error(`Error connecting to Dify API: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      answer: data.answer,
      query: message,
      conversation_id: data.conversation_id,
      message_id: data.id,
      created_at: Date.now(),
    };
  } catch (error) {
    console.error("Error sending message to Dify:", error);
    if (!(error instanceof Error) || !error.message.includes("API authentication failed")) {
      toast.error("Failed to get a response. Please try again.");
    }
    throw error;
  }
}
