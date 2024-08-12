<template>
    <div v-if="show" class="modal" @click.self="closeModal">
      <div class="modal-content" :class="{ 'dark-mode': isDarkMode }">
        <h2>编辑笔记</h2>
        <textarea v-model="editedNote.content" rows="10"></textarea>
        <div class="modal-actions">
          <button @click="saveNote">保存</button>
          <button @click="closeModal">取消</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, watch } from 'vue';
  import { useNotesStore } from '../../src/stores/notesStore';
  
  export default defineComponent({
    name: 'NoteModal',
    props: {
      show: Boolean,
      note: Object,
      isDarkMode: Boolean,
    },
    emits: ['update:show', 'save'],
    setup(props, { emit }) {
      const notesStore = useNotesStore();
      const editedNote = ref({ ...props.note });
  
      watch(() => props.note, (newNote) => {
        editedNote.value = { ...newNote };
      });
  
      const closeModal = () => {
        emit('update:show', false);
      };
  
      const saveNote = async () => {
        emit('save', editedNote.value);
        closeModal();
      };
  
      return {
        editedNote,
        closeModal,
        saveNote,
      };
    },
  });
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 80%;
    max-width: 600px;
  }
  
  .modal-content.dark-mode {
    background-color: #333;
    color: white;
  }
  
  .modal-content textarea {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .modal-content.dark-mode textarea {
    background-color: #444;
    color: white;
    border-color: #666;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .modal-actions button {
    margin-left: 10px;
  }
  </style>