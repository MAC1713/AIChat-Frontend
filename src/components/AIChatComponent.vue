<template>
    <div class="chat-container">
      <div class="chat-messages" ref="chatMessages">
        <div
          v-for="(message, index) in showMessage"
          :key="index"
          :class="['message', message.role]"
        >
          {{ message.content }}
        </div>
      </div>
      <div class="chat-input">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Type your message here..."
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, nextTick } from 'vue';
  import { sendChatMessage, Message } from '../router/chatService';
  
  export default defineComponent({
    name: 'AIChatComponent',
    setup() {
        const userInput = ref('');
        const conversationHistory = ref<Message[]>([]);
        const showMessage = ref<Message[]>([]);
        const messageCount = ref(0);
        const chatMessages = ref<HTMLDivElement | null>(null); 
  
      const sendMessage = async () => {
        if (!userInput.value.trim()) return;
  
        const userMessage = userInput.value;
        showMessage.value.push({ role: 'user', content: userMessage });
        userInput.value = '';
  
        try {
          const response = await sendChatMessage(
            messageCount.value,
            userMessage,
            conversationHistory.value
          );
  
          conversationHistory.value.push({
            role: 'assistant',
            content: response.aiMessage,
          });
          showMessage.value.push({
            role: 'assistant',
            content: response.aiMessage
          });

          messageCount.value = response.messageCount;
  
          await nextTick();
          scrollToBottom();
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };
  
      const scrollToBottom = () => {
        if (chatMessages.value) {
          chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
        }
      };
  
      onMounted(() => {
        scrollToBottom();
      });
  
      return {
        userInput,
        conversationHistory,
        showMessage,
        sendMessage,
        chatMessages,
      };
    },
  });
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 8px;
    max-width: 70%;
  }
  
  .user {
    background-color: #e3f2fd;
    align-self: flex-end;
    margin-left: auto;
  }
  
  .assistant {
    background-color: #f0f4c3;
    align-self: flex-start;
  }
  
  .chat-input {
    display: flex;
    gap: 10px;
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>