<template>
  <div class="chat-container" :class="{ 'menu-open': isMenuOpen }">
    <div class="menu-button" @click="toggleMenu">
      <img src="/menu.jpg" alt="Menu" />
    </div>
    <side-menu v-if="isMenuOpen" @close-menu="closeMenu" />
    <div class="chat-content" @click="closeMenu">
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
        <textarea
          v-model="userInput"
          @keydown.enter.prevent="handleEnter"
          @keydown.ctrl.enter="handleCtrlEnter"
          @keydown.meta.enter="handleMetaEnter"
          @keydown.shift.enter="handleShiftEnter"
          placeholder="Type your message here..."
        ></textarea>
        <button @click="sendMessage">Send</button>
      </div>
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
    const isComposing = ref(false);

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

    const handleEnter = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        // 不阻止默认行为，允许换行
        return;
      }
      sendMessage();
    };

    const handleCtrlEnter = () => {
      userInput.value += '\n';
    };

    const handleMetaEnter = () => {
      userInput.value += '\n';
    };

    const handleShiftEnter = () => {
      userInput.value += '\n';
    };

    const closeMenu = () => {
      if (isMenuOpen.value) {
        isMenuOpen.value = false;
      }
    };

    onMounted(() => {
      scrollToBottom();
      if (chatMessages.value) {
        chatMessages.value.addEventListener('compositionstart', () => {
          isComposing.value = true;
        });
        chatMessages.value.addEventListener('compositionend', () => {
          isComposing.value = false;
        });
      }
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
      handleEnter,
      handleCtrlEnter,
      handleMetaEnter,
      handleShiftEnter,
      closeMenu,
    };
  },
});
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: padding-left 0.3s ease;
}

.chat-container.menu-open {
  padding-left: 180px;
}

.menu-button {
  position: fixed;
  top: 10px;
  left: 16px;
  cursor: pointer;
  z-index: 1000;
}

.menu-button img {
  width: 61px;
  height: 61px;
}

.chat-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  padding-left: 50px;
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
  word-wrap: break-word;
  overflow-wrap: break-word;
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
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0; /* 这行很重要，允许flex item缩小到比其内容更小 */
}

.chat-input {
  display: flex;
  margin-top: 20px;
}

.chat-input textarea {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  min-height: 40px;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.chat-input button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.chat-input button:hover {
  background-color: #45a049;
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