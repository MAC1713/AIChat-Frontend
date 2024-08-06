// types/chat.ts

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }
  
  export interface ChatResponse {
    aiMessage: string;
    messageCount: number;
  }
  
  export interface ChatService {
    sendChatMessage: (
      messageCount: number,
      userMessage: string,
      conversationHistory: Message[]
    ) => Promise<ChatResponse>;
  }