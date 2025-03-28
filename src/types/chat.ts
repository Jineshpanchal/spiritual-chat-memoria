
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface UserContext {
  name?: string;
  preferences?: string[];
  lastInteractionDate?: number;
  topics?: string[];
  [key: string]: any;
}

export interface DifyResponse {
  answer: string;
  query: string;
  conversation_id?: string;
  message_id?: string;
  created_at?: number;
}
