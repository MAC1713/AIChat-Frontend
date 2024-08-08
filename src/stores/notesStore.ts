import { defineStore } from 'pinia';
import { notesService, type Notebook } from '@/router/notesService';

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Notebook[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async getNotebook() {
      this.loading = true;
      this.error = null;
      try {
        this.notes = await notesService.getNotebook();
      } catch (error) {
        this.error = 'Failed to fetch notebook';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async saveNotebook(notes: Notebook[]) {
      this.loading = true;
      this.error = null;
      try {
        this.notes = await notesService.saveNotebook(notes);
      } catch (error) {
        this.error = 'Failed to save notebook';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async cleanNotebook(importance: number, timestamp: string) {
      this.loading = true;
      this.error = null;
      try {
        this.notes = await notesService.cleanNotebook(importance, timestamp);
      } catch (error) {
        this.error = 'Failed to clean notebook';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});