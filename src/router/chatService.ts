import axios from 'axios';

export interface Message {
  role: string;
  content: string;
  error?: boolean;
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
      const requestData = {
        messageCount,
        aiMessage: null,
        userMessage,
        fullConversationHistory: conversationHistory,
      };

      const requestConfig = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const [chatResponse] = await Promise.all([
        axios.post<{
          head: { status: string };
          result: ChatResponse;
        }>('http://localhost:8080/api/chat/send', requestData, requestConfig),
      ]);

      if (chatResponse.data.head.status === '200' || chatResponse.data.head.status === 'OPTIONS') {
        return chatResponse.data.result;
      } else {
        throw new Error(`API returned a non-200 status: ${chatResponse.data.head.status}`);
      }
    } catch (error) {
      console.error('Error sending message or updating notebook:', error);
      throw error;
    }
};

export const sendToCheck = async (conversationHistory: Message[]): Promise<Message[]> => {
  try {
    const requestData = {
      fullConversationHistory: conversationHistory,
    };

    const requestConfig = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post<{
      head: { status: string };
      result: Message[];
    }>('http://localhost:8080/api/chat/updateNotebook', requestData, requestConfig);

    if (response.data.head.status === '200') {
      return response.data.result;
    } else {
      throw new Error(`API returned a non-200 status: ${response.data.head.status}`);
    }
  } catch (error) {
    console.error('Error updating notebook:', error);
    throw error;
  }
};

export const getChatHistory = async (conversationId: string): Promise<Message[] | { result: Message[] }> => {
  try {
    const response = await axios.get<{ head: { status: string }, result: Message[] }>(`http://localhost:8080/api/chat/history/${conversationId}`);
    if (response.data.head.status === '200') {
      return response.data;
    } else {
      throw new Error(`API returned a non-200 status: ${response.data.head.status}`);
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export const syncChatHistory = async (conversationId: string, conversationHistory: Message[]): Promise<void> => {
  try {
    const requestData = {
      id: conversationId,
      historyChat: JSON.stringify(conversationHistory),
    };

    const requestConfig = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post('http://localhost:8080/api/chat/syncHistory', requestData, requestConfig);
    if (response.data.head.status !== '200') {
      throw new Error(`API returned a non-200 status: ${response.data.head.status}`);
    }
  } catch (error) {
    console.error('Error syncing chat history:', error);
    throw error;
  }
};