<template>
  <div class="notes-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="notes-header">
      <button class="menu-button" @click="toggleMenu">
        <img :src="isDarkMode ? '/menu-dark.jpg' : '/menu-light.jpg'" alt="Menu" />
      </button>
      <h1>Notes</h1>
      <button class="theme-toggle" @click="toggleTheme">
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
    </header>
    
    <side-menu />

    <div class="filter-controls">
      <input v-model="importanceFilter" type="number" step="0.1" min="0" max="1" placeholder="Importance">
      <input v-model="timestampFilter" type="date" placeholder="Timestamp">
      <button @click="cleanNotebook">Clean Notebook</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Tag</th>
          <th>Importance</th>
          <th>Content</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(note, index) in notes" :key="index">
          <td><input v-model="note.tag" @input="noteChanged(index)"></td>
          <td><input v-model.number="note.importance" type="number" step="0.1" min="0" max="1" @input="noteChanged(index)"></td>
          <td><input v-model="note.content" @input="noteChanged(index)"></td>
          <td>{{ formatDate(note.timestamp) }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="saveNotes" :disabled="!hasChanges">Save Changes</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useThemeStore } from '@/stores/themeStore';
import { useNotesStore } from '@/stores/notesStore';
import { useUIStore } from '@/stores/uiStore';
import SideMenu from '@/components/SideMenu.vue';

export default defineComponent({
  name: 'NotesPage',
  components: {
    SideMenu,
  },
  setup() {
    const themeStore = useThemeStore();
    const notesStore = useNotesStore();
    const uiStore = useUIStore();
    const isDarkMode = computed(() => themeStore.isDarkMode);
    const notes = ref(notesStore.notes);
    const hasChanges = ref(false);
    const importanceFilter = ref(0);
    const timestampFilter = ref('');

    const toggleTheme = () => {
      themeStore.toggleTheme();
    };

    const toggleMenu = () => {
      uiStore.toggleMenu();
    };

    const noteChanged = (index: number) => {
      hasChanges.value = true;
      notes.value[index].timestamp = new Date().toISOString();
    };

    const saveNotes = async () => {
      await notesStore.saveNotebook(notes.value);
      hasChanges.value = false;
    };

    const cleanNotebook = async () => {
      await notesStore.cleanNotebook(importanceFilter.value, timestampFilter.value);
      notes.value = notesStore.notes;
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString();
    };

    onMounted(async () => {
      await notesStore.getNotebook();
      notes.value = notesStore.notes;
    });

    return {
      isDarkMode,
      notes,
      hasChanges,
      importanceFilter,
      timestampFilter,
      toggleTheme,
      toggleMenu,
      noteChanged,
      saveNotes,
      cleanNotebook,
      formatDate,
    };
  },
});
</script>
  
<style scoped>
  .notes-container {
    padding: 20px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .notes-container.dark-mode {
    background-color: #333;
    color: #fff;
  }

  .notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .menu-button, .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    transition: opacity 0.3s;
  }

  .menu-button img {
    width: 61px;
    height: 61px;
    transition: filter 0.3s ease;
  }

  .dark-mode .menu-button img {
    filter: invert(1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  .notes-container.dark-mode th {
    background-color: #444;
  }
  
  input {
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
  }
  
  button {
    margin-top: 10px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .filter-controls {
    margin-bottom: 20px;
  }
  
  .filter-controls input {
    margin-right: 10px;
    width: auto;
  }
  </style>