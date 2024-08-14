import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { getChatHistory, syncChatHistory, type Message } from '../router/chatService';

export const useChatStore = defineStore('chat', () => {
    const conversationId = ref(localStorage.getItem('conversationId') || '');
    const messages = ref<Message[]>([]);
    const messageCount = ref(parseInt(localStorage.getItem('messageCount') || '0'));

    if (!conversationId.value) {
        conversationId.value = generateUUID();
        localStorage.setItem('conversationId', conversationId.value);
    }

    watch(conversationId, (newId) => {
        localStorage.setItem('conversationId', newId);
    });

    const setMessages = (newMessages: Message[]) => {
        messages.value = newMessages;
        messageCount.value = newMessages.length;
        syncChatHistory(conversationId.value, newMessages);
    };

    const addMessage = (message: Message) => {
        messages.value.push(message);
        messageCount.value++;
        syncChatHistory(conversationId.value, messages.value);
    };

    const setMessageCount = (count: number) => {
        messageCount.value = count;
        localStorage.setItem('messageCount', count.toString());
    };

    const loadChatHistory = async () => {
        try {
            const history = await getChatHistory(conversationId.value);
            if (Array.isArray(history)) {
                setMessages(history);
            } else if (history && typeof history === 'object' && 'result' in history) {
                setMessages(history.result);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setMessages([]);
        }
    };

    const clearChat = () => {
        setMessages([]);
        conversationId.value = generateUUID();
    };

    return {
        conversationId,
        messages,
        messageCount,
        setMessages,
        addMessage,
        setMessageCount,
        clearChat,
        loadChatHistory,
    };
});

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}