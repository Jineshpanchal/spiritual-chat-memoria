
import { DifyResponse, Message } from "@/types/chat";
import { toast } from "sonner";

const API_URL = "https://api.dify.ai/v1/chat-messages";

export interface DifyApiConfig {
  apiKey: string;
  conversationId?: string;
  userContext?: Record<string, any>;
}

export async function sendMessageToDify(
  message: string,
  config: DifyApiConfig
): Promise<DifyResponse> {
  try {
    const { apiKey, conversationId, userContext } = config;
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: userContext || {},
        query: message,
        response_mode: "blocking",
        conversation_id: conversationId,
        user: "user-id", // You might want to generate a unique ID for users
      }),
    });

    if (!response.ok) {
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
    toast.error("Failed to get a response. Please try again.");
    throw error;
  }
}
