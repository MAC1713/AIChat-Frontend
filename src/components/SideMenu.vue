<template>
  <div class="side-menu" :class="{ 'open': isOpen }">
    <h2>Menu</h2>
    <ul>
      <li>AI Chat</li>
      <li>Settings</li>
      <li>Notes</li>
      <li>Prompts</li>
      <li>API Key</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'SideMenu',
  setup() {
    const isOpen = ref(false);

    onMounted(() => {
      setTimeout(() => {
        isOpen.value = true;
      }, 50);
    });

    return {
      isOpen,
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
  transition: left 0.3s ease;
  z-index: 999;
}

.side-menu.open {
  left: 0;
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
</style>