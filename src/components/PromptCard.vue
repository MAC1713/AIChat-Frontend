<template>
    <div class="prompt-card">
      <h3>{{ prompt.description }}</h3>
      <p>Tokens : {{ prompt.tokens }}</p>
      <p>Last updated: {{ prompt.updateTime }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { PromptAll} from '../router/PromptsService';
  
  export default defineComponent({
    name: 'PromptCard',
    props: {
      prompt: {
        type: Object as PropType<PromptAll>,
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