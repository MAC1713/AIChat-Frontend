<template>
    <div class="prompts-container" :class="{ 'dark-mode': isDarkMode }">
      <header class="prompts-header">
        <button class="menu-button" @click="toggleMenu">
          <img :src="isDarkMode ? '/menu-dark.jpg' : '/menu-light.jpg'" alt="Menu" />
        </button>
        <h1>Prompts</h1>
        <button class="theme-toggle" @click="toggleTheme">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </header>
  
      <side-menu />
  
      <main class="prompts-main" @click="closeMenu">
        <div v-if="!currentPrompt" class="prompt-list">
          <PromptCard
            v-for="prompt in promptsTypeList"
            :key="prompt.id"
            :prompt="prompt"
            @click="openPrompt(prompt.promptsType)"
          />
        </div>
        <PromptEditor
          v-else
          :prompt="currentPrompt"
          @save="savePrompt"
          @cancel="closePrompt"
        />
      </main>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, computed, ref } from 'vue';
  import { usePromptsStore } from '../stores/PromptsStore';
  import { useThemeStore } from '../stores/themeStore';
  import { useUIStore } from '../stores/uiStore';
  import SideMenu from '../components/SideMenu.vue';
  import PromptCard from '../components/PromptCard.vue';
  import PromptEditor from '../components/PromptEditor.vue';
  import { Prompt } from '../router/PromptsService';
  
  export default defineComponent({
    name: 'PromptsView',
    components: {
      SideMenu,
      PromptCard,
      PromptEditor,
    },
    setup() {
      const promptsStore = usePromptsStore();
      const themeStore = useThemeStore();
      const uiStore = useUIStore();
  
      const promptsTypeList = computed(() => promptsStore.promptsTypeList);
      const currentPrompt = computed(() => promptsStore.currentPrompt);
      const isDarkMode = computed(() => themeStore.isDarkMode);
  
      onMounted(() => {
        promptsStore.fetchPromptsTypeList();
      });
  
      const openPrompt = async (id: string) => {
        await promptsStore.fetchPromptById(id);
      };
  
      const savePrompt = async (prompt: Prompt) => {
        await promptsStore.savePrompt(prompt);
        closePrompt();
      };
  
      const closePrompt = () => {
        promptsStore.currentPrompt = null;
      };
  
      const toggleTheme = () => {
        themeStore.toggleTheme();
      };
  
      const toggleMenu = () => {
        uiStore.toggleMenu();
      };
  
      const closeMenu = () => {
        if (uiStore.isMenuOpen) {
          uiStore.toggleMenu();
        }
      };
  
      return {
        promptsTypeList,
        currentPrompt,
        isDarkMode,
        openPrompt,
        savePrompt,
        closePrompt,
        toggleTheme,
        toggleMenu,
        closeMenu,
      };
    },
  });
  </script>
  
  <style scoped>
  .prompts-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .prompts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f0f0f0;
  }
  
  .dark-mode .prompts-header {
    background-color: #333;
    color: #fff;
  }
  
  .menu-button, .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
  }

  .menu-button img {
    width: 61px;
    height: 61px;
    transition: filter 0.3s ease;
  }
  
  .prompts-main {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }
  
  .prompt-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .dark-mode {
    background-color: #1a1a1a;
    color: #fff;
  }
  </style>