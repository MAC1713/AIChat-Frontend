import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface PromptsType {
  id: string;
  promptsType: string;
  description: string;
  updateTime: string;
}

export interface Prompt {
  id: string;
  promptType: string;
  promptData: string;
  tokens: number;
}

export const PromptsService = {
  async getPromptsTypeList(promptsType: Partial<PromptsType> = {}): Promise<PromptsType[]> {
    const response = await axios.post(`${API_URL}/promptsType/getPromptsTypeList`, promptsType);
    return response.data.result;
  },

  async getPromptsById(id: string): Promise<Prompt> {
    const response = await axios.get(`${API_URL}/prompts/getPromptsById/${id}`);
    return response.data.result;
  },

  async savePrompts(prompt: Prompt): Promise<number> {
    const response = await axios.post(`${API_URL}/prompts/savePrompts`, prompt);
    return response.data.result;
  }
};