<template>
  <div class="chat-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="chat-header">
      <div class="left-section">
        <button class="menu-button" @click="toggleMenu">
          <img :src="isDarkMode ? '/menu-dark.jpg' : '/menu-light.jpg'" alt="Menu" />
        </button>
        <h1>AI Chat</h1>
      </div>
      <div class="right-section">
        <button class="icon-button clear-chat" @click="clearChat" title="Clear Chat">🗑️</button>
        <button class="icon-button theme-toggle" @click="toggleTheme" title="Toggle Theme">
          {{ isDarkMode ? '🌙' : '☀️' }}
        </button>
      </div>
    </header>

    <side-menu />

    <main class="chat-main" @click="closeMenu">
      <div class="chat-messages" ref="chatMessages">
        <div
          v-for="(message, index) in chatStore.allMessages"
          :key="index"
          :class="['message', message.role, { 'error': message.error }]"
        >
          <img
            v-if="message.role === 'assistant'"
            :src="isDarkMode ? '/Emma-dark.png' : '/Emma-light.png'"
            alt="AI Avatar"
            class="avatar"
          />
          <div class="message-content" v-html="formatMessage(message.content)"></div>
          <button v-if="message.error" @click="resendMessage(index)" class="resend-button">🔄</button>
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
import { sendChatMessage, type Message, type ChatResponse, syncChatHistory } from '../router/chatService';
import SideMenu from '../components/SideMenu.vue';
import { formatSpecialText } from '../utils/textFormatter';
import { useThemeStore } from '../stores/themeStore';
import { useUIStore } from '../stores/uiStore';
import { useChatStore } from '../stores/chatStore';

export default defineComponent({
  name: 'AIChat',
  components: {
    SideMenu,
  },
  setup() {
    const themeStore = useThemeStore();
    const uiStore = useUIStore();
    const chatStore = useChatStore();
    const isDarkMode = computed(() => themeStore.isDarkMode);
    const isMenuOpen = computed(() => uiStore.isMenuOpen);

    const userInput = ref('');
    const chatMessages = ref<HTMLDivElement | null>(null);
    const isComposing = ref(false);
    const textarea = ref<HTMLTextAreaElement | null>(null);

    const sendMessage = async () => {
      if (!userInput.value.trim()) return;

      const userMessage: Message = { role: 'user', content: userInput.value.trim() };
      chatStore.addPendingMessage(userMessage);
      userInput.value = '';

      try {
        const response: ChatResponse = await sendChatMessage(
          chatStore.messageCount,
          userMessage.content,
          chatStore.confirmedMessages
        );
        chatStore.confirmPendingMessage();
        const aiMessage: Message = { role: 'assistant', content: response.aiMessage };
        chatStore.addAIMessage(aiMessage);
        chatStore.setMessageCount(response.messageCount);
        chatStore.updateNotebook(response.fullConversationHistory);
      } catch (error) {
        console.error('Error sending message:', error);
        chatStore.setMessageError(chatStore.confirmedMessages.length - 1, true);
      }

      await nextTick();
      scrollToBottom();
    };

    const resendMessage = async (index: number) => {
      const message = chatStore.confirmedMessages[index];
      if (message.role !== 'user') return;

      chatStore.setMessageError(index, false);
      try {
        const response: ChatResponse = await sendChatMessage(
          chatStore.messageCount,
          message.content,
          chatStore.confirmedMessages.slice(0, index)
        );
        const aiMessage: Message = { role: 'assistant', content: response.aiMessage };
        chatStore.addAIMessage(aiMessage);
        chatStore.setMessageCount(response.messageCount);
        chatStore.updateNotebook(response.fullConversationHistory);
      } catch (error) {
        console.error('Error resending message:', error);
        chatStore.setMessageError(index, true);
      }

      await nextTick();
      scrollToBottom();
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

    const clearChat = () => {
      chatStore.clearChat();
    };

    onMounted(async () => {
      await chatStore.loadChatHistory();
      scrollToBottom();
      if (textarea.value) {
        textarea.value.addEventListener('input', adjustTextareaHeight);
      }
    });

    watch(() => chatStore.allMessages, () => {
      nextTick(() => {
        scrollToBottom();
      });
    }, { deep: true });

    return {
      userInput,
      chatStore,
      sendMessage,
      resendMessage,
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
      clearChat,
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

  .left-section, .right-section {
    display: flex;
    align-items: center;
  }

  .icon-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: 10px;
    padding: 5px;
    border-radius: 50%;
    transition: background-color 0.3s;
  }

  .icon-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
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

  .clear-chat, .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .resend-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 5px;
    border-radius: 50%;
    transition: background-color 0.3s;
    margin-left: 10px;
  }

  .resend-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .message.error {
    border-left: 3px solid #ff4d4f;
    background-color: rgba(255, 77, 79, 0.1);
  }

  .message.error .message-content {
    color: #cf1322;
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