<template>
  <div class="chat-container">
    <div class="menu-button" @click="toggleMenu">
      <img src="/menu.jpg" alt="Menu" />
    </div>
    <side-menu v-if="isMenuOpen" />
    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="(message, index) in showMessage"
        :key="index"
        :class="['message', message.role]"
      >
        <img
          v-if="message.role === 'assistant'"
          src="/Emma.png"
          alt="AI Avatar"
          class="avatar"
        />
        <div class="message-content" v-html="formatMessage(message.content)"></div>
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
import SideMenu from './SideMenu.vue';
import { formatSpecialText } from '../utils/textFormatter';

export default defineComponent({
  name: 'AIChatComponent',
  components: {
    SideMenu,
  },
  setup() {
    const userInput = ref('');
    const conversationHistory = ref<Message[]>([]);
    const showMessage = ref<Message[]>([]);
    const messageCount = ref(0);
    const chatMessages = ref<HTMLDivElement | null>(null);
    const isMenuOpen = ref(false);

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

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const formatMessage = (content: string) => {
      return formatSpecialText(content);
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
      isMenuOpen,
      toggleMenu,
      formatMessage,
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
  position: relative;
}

.menu-button {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
}

.menu-button img {
  width: 24px;
  height: 24px;
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
  display: flex;
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

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.message-content {
  flex: 1;
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

/* 添加特殊格式文本的样式 */
.code-block {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
}

.highlight {
  background-color: yellow;
  padding: 2px 4px;
  border-radius: 2px;
}
</style>