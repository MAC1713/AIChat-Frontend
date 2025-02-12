import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getChatHistory, syncChatHistory, sendToCheck, type Message } from '../router/chatService';

export const useChatStore = defineStore('chat', () => {
    const conversationId = ref(localStorage.getItem('conversationId') || '');
    const confirmedMessages = ref<Message[]>([]);
    const pendingMessage = ref<Message | null>(null);
    const messageCount = ref(parseInt(localStorage.getItem('messageCount') || '0'));

    const allMessages = computed(() => {
        return pendingMessage.value 
            ? [...confirmedMessages.value, pendingMessage.value] 
            : confirmedMessages.value;
    });

    if (!conversationId.value) {
        conversationId.value = generateUUID();
        localStorage.setItem('conversationId', conversationId.value);
    }

    const setMessages = (newMessages: Message[]) => {
        confirmedMessages.value = newMessages;
        messageCount.value = newMessages.length;
        syncChatHistory(conversationId.value, newMessages);
    };

    const addPendingMessage = (message: Message) => {
        pendingMessage.value = message;
    };

    const confirmPendingMessage = () => {
        if (pendingMessage.value) {
            confirmedMessages.value.push(pendingMessage.value);
            pendingMessage.value = null;
            messageCount.value++;
            syncChatHistory(conversationId.value, confirmedMessages.value);
        }
    };

    const addAIMessage = (message: Message) => {
        confirmedMessages.value.push(message);
        messageCount.value++;
        syncChatHistory(conversationId.value, confirmedMessages.value);
    };

    const setMessageError = (index: number, isError: boolean) => {
        if (index >= 0 && index < confirmedMessages.value.length) {
            confirmedMessages.value[index] = { 
                ...confirmedMessages.value[index], 
                error: isError 
            };
        }
    };

    const setMessageCount = (count: number) => {
        messageCount.value = count;
        localStorage.setItem('messageCount', count.toString());
    };

    const updateNotebook = (newMessages: Message[]) => {
        confirmedMessages.value = newMessages;
        sendToCheck(newMessages);
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
        pendingMessage.value = null;
        conversationId.value = generateUUID();
        localStorage.removeItem('messageCount');
        messageCount.value = 0;
    };

    return {
        conversationId,
        allMessages,
        confirmedMessages,
        pendingMessage,
        messageCount,
        setMessages,
        addPendingMessage,
        confirmPendingMessage,
        addAIMessage,
        setMessageError,
        setMessageCount,
        clearChat,
        loadChatHistory,
        updateNotebook,
    };
});

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}