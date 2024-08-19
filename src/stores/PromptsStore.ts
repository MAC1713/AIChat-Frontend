import { defineStore } from 'pinia';
import { PromptsService, type PromptsType, type Prompt } from '../router/PromptsService';

export const usePromptsStore = defineStore('prompts', {
  state: () => ({
    promptsTypeList: [] as PromptsType[],
    currentPrompt: null as Prompt | null,
  }),

  actions: {
    async fetchPromptsTypeList(filter: Partial<PromptsType> = {}) {
      try {
        this.promptsTypeList = await PromptsService.getPromptsTypeList(filter);
      } catch (error) {
        console.error('Error fetching prompts type list:', error);
      }
    },

    async fetchPromptById(id: string) {
      try {
        this.currentPrompt = await PromptsService.getPromptsById(id);
      } catch (error) {
        console.error('Error fetching prompt by id:', error);
      }
    },

    async savePrompt(prompt: Prompt) {
      try {
        await PromptsService.savePrompts(prompt);
        await this.fetchPromptsTypeList(); // Refresh the list after saving
      } catch (error) {
        console.error('Error saving prompt:', error);
      }
    },
  },
});