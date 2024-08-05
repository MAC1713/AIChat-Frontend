import axios from 'axios';

export interface Message {
  role: string;
  content: string;
}

export interface ChatResponse {
  aiMessage: string;
  messageCount: number;
  fullConversationHistory: Message[];
}

export const sendChatMessage = async (
    messageCount: number,
    userMessage: string,
    conversationHistory: Message[]
  ): Promise<ChatResponse> => {
    try {
      const response = await axios.post<{
        head: { status: string };
        result: ChatResponse;
      }>(
        'http://localhost:8080/api/chat/send',
        {
          messageCount,
          aiMessage: null,
          userMessage,
          fullConversationHistory: conversationHistory,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

    if (response.data.head.status === '200' || response.data.head.status === 'OPTIONS') {
      return response.data.result;
    } else {
      throw new Error(`API返回了一个非200状态: ${response.data.head.status}`);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};