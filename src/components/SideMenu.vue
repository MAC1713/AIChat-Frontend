<template>
    <div class="side-menu">
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
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'SideMenu',
  });
  </script>
  
  <style scoped>
  .side-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100vh;
    background-color: #f0f0f0;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
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