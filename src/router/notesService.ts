import axios from 'axios';

export interface Notebook {
  content: string;
  tag: string;
  importance: number;
  timestamp: string;
  isPermanent: boolean;
  permanent: boolean;
}

export interface NotesResponse {
  head: {
    message: string;
    status: string;
  };
  result: Notebook[];
}

const API_BASE_URL = 'http://localhost:8080/api';

// 辅助函数：将日期字符串转换为包含时间的完整格式
function formatDateTimeString(dateString: string): string {
  // 如果已经是完整的日期时间格式，则直接返回
  if (dateString.includes('T')) {
    return dateString;
  }
  // 否则，添加时间部分
  return `${dateString}T00:00:00`;
}

export const notesService = {
  async getNotebook(): Promise<Notebook[]> {
    try {
      const response = await axios.post<NotesResponse>(`${API_BASE_URL}/note/getNotebook`, {
        withCredentials: true,
      });
      if (response.data.head.status === '200') {
        return response.data.result;
      } else {
        throw new Error(`API返回了一个非200状态: ${response.data.head.status}`);
      }
    } catch (error) {
      console.error('Error fetching notebook:', error);
      throw error;
    }
  },

  async saveNotebook(notes: Notebook[]): Promise<Notebook[]> {
    try {
      const response = await axios.post<NotesResponse>(
        `${API_BASE_URL}/note/saveNotebook`,
        notes,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.head.status === '200') {
        return response.data.result;
      } else {
        throw new Error(`API返回了一个非200状态: ${response.data.head.status}`);
      }
    } catch (error) {
      console.error('Error saving notebook:', error);
      throw error;
    }
  },

  async cleanNotebook(importance: number, timestamp: string): Promise<Notebook[]> {
    try {
      const formattedTimestamp = formatDateTimeString(timestamp);
      const response = await axios.post<NotesResponse>(
        `${API_BASE_URL}/note/cleanNotebook`,
        {
          content: '',
          tag: '',
          importance,
          timestamp: formattedTimestamp,
          isPermanent: false,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.head.status === '200') {
        return response.data.result;
      } else {
        throw new Error(`API返回了一个非200状态: ${response.data.head.status}`);
      }
    } catch (error) {
      console.error('Error cleaning notebook:', error);
      throw error;
    }
  },
};