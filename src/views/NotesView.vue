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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(note, index) in paginatedNotes" :key="note.timestamp">
          <td><input v-model="note.tag" @input="noteChanged(index)"></td>
          <td><input v-model.number="note.importance" type="number" step="0.1" min="0" max="1" @input="noteChanged(index)"></td>
          <td>
            <div class="content-preview" @click="openModal(note)">
              {{ note.content.slice(0, 50) }}{{ note.content.length > 50 ? '...' : '' }}
            </div>
          </td>
          <td>{{ formatDate(note.timestamp) }}</td>
          <td>
            <button @click="deleteNote(note.timestamp)" class="delete-btn">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="goToPage(1)" :disabled="currentPage === 1">首页</button>
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
      <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
      <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">末页</button>
    </div>
    <button @click="saveNotes" :disabled="!hasChanges">Save Changes</button>
  </div>
      <!-- 使用新的 NoteModal 组件 -->
      <NoteModal
      v-model:show="showModal"
      :note="currentEditNote"
      :isDarkMode="isDarkMode"
      @save="saveEditedNote"
    />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed} from 'vue';
import { useThemeStore } from '../../src/stores/themeStore';
import { useNotesStore } from '../../src/stores/notesStore';
import { useUIStore } from '../../src/stores/uiStore';
import SideMenu from '../../src/components/SideMenu.vue';
import NoteModal from '../../src/components/NoteModal.vue';

// 定义 Note 接口
interface Note {
  timestamp: string;
  importance: number;
  content: string;
  tag: string;
}

export default defineComponent({
  name: 'NotesPage',
  components: {
    SideMenu,
    NoteModal,
  },
  setup() {
    const themeStore = useThemeStore();
    const notesStore = useNotesStore();
    const uiStore = useUIStore();
    const isDarkMode = computed(() => themeStore.isDarkMode);
    const notes = ref<Note[]>(notesStore.notes);
    const hasChanges = ref(false);
    const importanceFilter = ref(0);
    const timestampFilter = ref('');
    const currentPage = ref(1);
    const pageSize = 5;
    const showModal = ref(false);
    const currentEditNote = ref<Note | null>(null);

    const filteredNotes = computed(() => {
      return notes.value.filter((note) => 
        note.importance >= importanceFilter.value &&
        (!timestampFilter.value || new Date(note.timestamp) >= new Date(timestampFilter.value))
      );
    });

    const totalPages = computed(() => Math.ceil(filteredNotes.value.length / pageSize));

    const paginatedNotes = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return filteredNotes.value.slice(startIndex, endIndex);
    });

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

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const openModal = (note: Note) => {
      currentEditNote.value = { ...note };
      showModal.value = true;
    };

    const saveEditedNote = async (editedNote: Note) => {
      const index = notes.value.findIndex((n) => n.timestamp === editedNote.timestamp);
      if (index !== -1) {
        notes.value[index] = { ...editedNote };
        hasChanges.value = true;
        await saveNotes();
      }
    };

    // 新增：删除笔记
    const deleteNote = async (timestamp: any) => {
      notes.value = notes.value.filter((note: { timestamp: any; }) => note.timestamp !== timestamp);
      hasChanges.value = true;
      await saveNotes();
    };

    onMounted(async () => {
      await notesStore.getNotebook();
      notes.value = notesStore.notes;
    });

    return {
      isDarkMode,
      notes,
      paginatedNotes,
      hasChanges,
      importanceFilter,
      timestampFilter,
      currentPage,
      totalPages,
      showModal,
      currentEditNote,
      toggleTheme,
      toggleMenu,
      noteChanged,
      saveNotes,
      cleanNotebook,
      formatDate,
      goToPage,
      openModal,
      saveEditedNote,
      deleteNote,
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

  .pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}

.notes-container.dark-mode .pagination button {
  background-color: #444;
  color: #fff;
  border-color: #666;
}
  </style>