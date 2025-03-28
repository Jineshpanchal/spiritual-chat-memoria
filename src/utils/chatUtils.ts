
import { ChatHistory, Message } from "@/types/chat";

export function generateChatId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function createNewChat(): ChatHistory {
  const timestamp = Date.now();
  return {
    id: generateChatId(),
    title: "New Conversation",
    messages: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function generateChatTitle(messages: Message[]): string {
  if (messages.length === 0) return "New Conversation";
  
  // Use the first user message as a basis for the title
  const firstUserMessage = messages.find(m => m.role === "user");
  if (firstUserMessage) {
    // Limit to first 30 characters and add ellipsis if longer
    const content = firstUserMessage.content;
    return content.length > 30 ? `${content.substring(0, 30)}...` : content;
  }
  
  return "Conversation " + new Date().toLocaleDateString();
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function extractUserContext(messages: Message[]): Record<string, any> {
  // This is a simple implementation that could be enhanced with NLP in the future
  const context: Record<string, any> = {};
  
  // Extract potential name mentions
  const nameRegex = /my name is ([A-Za-z]+)/i;
  for (const message of messages) {
    if (message.role === "user") {
      const nameMatch = message.content.match(nameRegex);
      if (nameMatch && nameMatch[1]) {
        context.name = nameMatch[1];
      }
    }
  }
  
  return context;
}
