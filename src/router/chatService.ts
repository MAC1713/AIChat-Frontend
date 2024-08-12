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

      const [chatResponse, notebookResponse] = await Promise.all([
        axios.post<{
          head: { status: string };
          result: ChatResponse;
        }>('http://localhost:8080/api/chat/send', requestData, requestConfig),
        axios.post<{
          head: { status: string };
          result: any; // 根据实际返回数据类型调整
        }>('http://localhost:8080/api/chat/updateNotebook', requestData, requestConfig)
      ]);

      if (chatResponse.data.head.status === '200' || chatResponse.data.head.status === 'OPTIONS') {
        // 如果需要处理 updateNotebook 的响应，可以在这里添加逻辑
        console.log('Notebook update response:', notebookResponse.data);
        return chatResponse.data.result;
      } else {
        throw new Error(`API返回了一个非200状态: ${chatResponse.data.head.status}`);
      }
    } catch (error) {
      console.error('Error sending message or updating notebook:', error);
      throw error;
    }
};