
import { DifyResponse, Message } from "@/types/chat";
import { toast } from "sonner";
import { DIFY_CONFIG } from "./config";

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
    
    console.log("Sending message to Dify API", { message, conversationId });
    
    const response = await fetch(DIFY_CONFIG.API_URL, {
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
