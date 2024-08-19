<template>
    <div class="prompt-card" @click="$emit('click')">
      <h3>{{ prompt.description }}</h3>
      <p>Last updated: {{ prompt.updateTime }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { PromptsType } from '../router/PromptsService';
  
  export default defineComponent({
    name: 'PromptCard',
    props: {
      prompt: {
        type: Object as PropType<PromptsType>,
        required: true,
      },
    },
  });
  </script>
  
  <style scoped>
  .prompt-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .prompt-card:hover {
    background-color: #f0f0f0;
  }
  </style>