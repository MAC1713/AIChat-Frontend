<template>
  <div class="side-menu" :class="{ 'open': isMenuOpen, 'dark-mode': isDarkMode }">
    <h2>Menu</h2>
    <ul>
      <li @click="navigateTo('ai-chat')">AI Chat</li>
      <li @click="navigateTo('notes')">Notes</li>
      <li>Settings</li>
      <li>Prompts</li>
      <li>API Key</li>
    </ul>
    <button class="theme-toggle" @click="toggleTheme">
      {{ isDarkMode ? '☀️' : '🌙' }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '../../src/stores/themeStore';
import { useUIStore } from '../../src/stores/uiStore';

export default defineComponent({
  name: 'SideMenu',
  setup() {
    const router = useRouter();
    const themeStore = useThemeStore();
    const uiStore = useUIStore();
    const isDarkMode = computed(() => themeStore.isDarkMode);
    const isMenuOpen = computed(() => uiStore.isMenuOpen);

    const navigateTo = (route: string) => {
      router.push({ name: route });
      uiStore.toggleMenu();
    };

    const toggleTheme = () => {
      themeStore.toggleTheme();
    };

    return {
      isMenuOpen,
      isDarkMode,
      navigateTo,
      toggleTheme,
    };
  },
});
</script>

<style scoped>
.side-menu {
  position: fixed;
  top: 0;
  left: -250px;
  width: 180px;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
  padding-top: 80px;
  box-shadow: 6px 0 5px rgba(0, 0, 0, 0.2);
  transition: left 0.3s ease, background-color 0.3s ease;
  z-index: 999;
}

.side-menu.open {
  left: 0;
}

.side-menu.dark-mode {
  background-color: #333;
  color: #fff;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  cursor: pointer;
}

li:hover {
  color: #4caf50;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  position: absolute;
  bottom: 20px;
  left: 20px;
}
</style>