<template>
  <div class="chat-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="chat-header">
      <button class="menu-button" @click="toggleMenu">
        <img :src="isDarkMode ? '/menu-dark.jpg' : '/menu-light.jpg'" alt="Menu" />
      </button>
      <h1>AI Chat</h1>
      <button class="theme-toggle" @click="toggleTheme">
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
    </header>

    <side-menu />

    <main class="chat-main" @click="closeMenu">
      <div class="chat-messages" ref="chatMessages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.role]"
        >
          <img
            v-if="message.role === 'assistant'"
            :src="isDarkMode ? '/Emma-dark.png' : '/Emma-light.png'"
            alt="AI Avatar"
            class="avatar"
          />
          <div class="message-content" v-html="formatMessage(message.content)"></div>
        </div>
      </div>
    </main>

    <footer class="chat-footer">
      <div class="chat-input">
        <textarea
          v-model="userInput"
          @keydown="handleKeyDown"
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
          placeholder="Type your message here..."
          rows="1"
          ref="textarea"
        ></textarea>
        <button @click="sendMessage" :disabled="!userInput.trim()">Send</button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, watch, computed } from 'vue';
import { sendChatMessage, type Message, type ChatResponse } from '../router/chatService';
import SideMenu from '../components/SideMenu.vue';
import { formatSpecialText } from '../utils/textFormatter';
import { useThemeStore } from '../stores/themeStore';
import { useUIStore } from '../stores/uiStore';

export default defineComponent({
  name: 'AIChat',
  components: {
    SideMenu,
  },
  setup() {
    const themeStore = useThemeStore();
    const uiStore = useUIStore();
    const isDarkMode = computed(() => themeStore.isDarkMode);
    const isMenuOpen = computed(() => uiStore.isMenuOpen);

    const userInput = ref('');
    const messages = ref<Message[]>([]);
    const messageCount = ref(0);
    const chatMessages = ref<HTMLDivElement | null>(null);
    const isComposing = ref(false);
    const textarea = ref<HTMLTextAreaElement | null>(null);

    const sendMessage = async () => {
      if (!userInput.value.trim()) return;

      const userMessage: Message = { role: 'user', content: userInput.value.trim() };
      userInput.value = '';
      messages.value.push(userMessage);
      try {
        const response: ChatResponse = await sendChatMessage(
          messageCount.value,
          userMessage.content,
          messages.value
        );
        const aiMessage: Message = { role: 'assistant', content: response.aiMessage};
        messages.value.push(aiMessage);
        messageCount.value = response.messageCount;

        await nextTick();
        scrollToBottom();
      } catch (error) {
        console.error('Error sending message:', error);
        messages.value.push({
          role: 'system',
          content: 'An error occurred while sending the message. Please try again.'
        });
      }
    };

    const scrollToBottom = () => {
      if (chatMessages.value) {
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
      }
    };

    const toggleMenu = () => {
      uiStore.toggleMenu();
    };

    const closeMenu = () => {
      uiStore.closeMenu();
    };

    const formatMessage = (content: string) => {
      const escapedContent = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      
      const contentWithLineBreaks = escapedContent.replace(/\n/g, '<br>');
      
      return formatSpecialText(contentWithLineBreaks);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey && !isComposing.value) {
        event.preventDefault();
        sendMessage();
      }
    };

    const adjustTextareaHeight = () => {
      if (textarea.value) {
        textarea.value.style.height = 'auto';
        textarea.value.style.height = `${textarea.value.scrollHeight}px`;
      }
    };

    const toggleTheme = () => {
      themeStore.toggleTheme();
    };

    onMounted(() => {
      scrollToBottom();
      if (textarea.value) {
        textarea.value.addEventListener('input', adjustTextareaHeight);
      }
    });

    watch(messages, () => {
      nextTick(() => {
        scrollToBottom();
      });
    });

    return {
      userInput,
      messages,
      sendMessage,
      chatMessages,
      isMenuOpen,
      toggleMenu,
      closeMenu,
      formatMessage,
      handleKeyDown,
      isComposing,
      textarea,
      isDarkMode,
      toggleTheme,
    };
  },
});
</script>

<style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 100%;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    background-color: #f0f4f8;
    color: #333;
    transition: background-color 0.3s, color 0.3s;
  }

  .chat-container.dark-mode {
    background-color: #1a1a2e;
    color: #e0e0e0;
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: #e0e0e0;
    border-bottom: 1px solid #ccc;
    transition: background-color 0.3s, border-color 0.3s;
  }

  .dark-mode .chat-header {
    background-color: #16213e;
    border-bottom-color: #444;
  }

  .menu-button, .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    transition: opacity 0.3s;
  }

  .menu-button:hover, .theme-toggle:hover {
    opacity: 0.8;
  }

  .menu-button img {
    width: 61px;
    height: 61px;
    transition: filter 0.3s ease;
  }

  .chat-main {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .chat-main, .chat-footer {
  transition: background-color 0.3s, border-color 0.3s;
  }

  .message-content {
    transition: background-color 0.3s, color 0.3s;
  }

  .chat-input textarea, .chat-input button {
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  }

  .chat-messages {
    display: flex;
    flex-direction: column;
  }

  .message {
    display: flex;
    margin-bottom: 1rem;
    max-width: 80%;
  }

  .user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .assistant {
    align-self: flex-start;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 0.5rem;
  }

  .message-content {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .dark-mode .message-content {
    background-color: #0f3460;
  }

  .user .message-content {
    background-color: #007bff;
    color: white;
  }

  .dark-mode .user .message-content {
    background-color: #4a69bd;
  }

  .chat-footer {
    padding: 1rem;
    background-color: #e0e0e0;
    border-top: 1px solid #ccc;
  }

  .dark-mode .chat-footer {
    background-color: #16213e;
    border-top-color: #444;
  }

  .chat-input {
    display: flex;
    gap: 0.5rem;
  }

  .chat-input textarea {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    resize: none;
    overflow-y: auto;
    min-height: 20px;
    max-height: 150px;
  }

  .dark-mode .chat-input textarea {
    background-color: #2c3e50;
    color: #e0e0e0;
    border-color: #444;
  }

  .chat-input button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .chat-input button:hover {
    background-color: #0056b3;
  }

  .chat-input button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .dark-mode .chat-input button {
    background-color: #4a69bd;
  }

  .dark-mode .chat-input button:hover {
    background-color: #3498db;
  }

  .dark-mode .chat-input button:disabled {
    background-color: #34495e;
  }

  /* 特殊格式文本样式 */
  :deep(.code-block) {
    background-color: #f8f8f8;
    padding: 1rem;
    border-radius: 0.5rem;
    font-family: monospace;
    white-space: pre-wrap;
    overflow-x: auto;
  }

  .dark-mode :deep(.code-block) {
    background-color: #2c3e50;
  }

  :deep(.highlight) {
    background-color: #ffff00;
    padding: 0.2rem 0.4rem;
    border-radius: 0.2rem;
  }

  .dark-mode :deep(.highlight) {
    background-color: #ffa502;
    color: #1a1a2e;
  }
</style>