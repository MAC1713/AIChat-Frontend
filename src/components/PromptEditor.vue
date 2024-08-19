<template>
    <div class="prompt-editor">
      <h2>Edit Prompt: {{ prompt.promptType }}</h2>
      <textarea v-model="editedPromptData" rows="10"></textarea>
      <div class="button-group">
        <button @click="save">Save</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
  import { Prompt } from '../router/PromptsService';
  
  export default defineComponent({
    name: 'PromptEditor',
    props: {
      prompt: {
        type: Object as PropType<Prompt>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const editedPromptData = ref(props.prompt.promptData);
  
      const save = () => {
        const updatedPrompt: Prompt = {
          ...props.prompt,
          promptData: editedPromptData.value,
        };
        emit('save', updatedPrompt);
      };
  
      const cancel = () => {
        emit('cancel');
      };
  
      return { editedPromptData, save, cancel };
    },
  });
  </script>
  
  <style scoped>
  .prompt-editor {
    padding: 16px;
  }
  
  textarea {
    width: 100%;
    margin-bottom: 16px;
  }
  
  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  </style>