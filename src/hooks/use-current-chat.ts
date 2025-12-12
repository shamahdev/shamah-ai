import type { UIMessage } from "ai";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  type Chat,
  createChat,
  getChat,
  getCurrentChatId,
  setCurrentChatId,
  updateChatMessages,
} from "@/lib/storage";

export function useCurrentChat() {
  const [currentChatId, setCurrentChatIdState] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  useEffect(() => {
    const loadChat = () => {
      let chatId = getCurrentChatId();
      let chat: Chat | null = null;

      if (chatId) {
        chat = getChat(chatId);
      }
      if (!chat) {
        chat = createChat();
        chatId = chat.id;
        setCurrentChatId(chatId);
      }

      setCurrentChatIdState(chatId);
      setCurrentChat(chat);
    };

    loadChat();

    const handleChatSelected = (event: CustomEvent<{ chatId: string }>) => {
      const { chatId } = event.detail;
      const chat = getChat(chatId);
      if (chat) {
        setCurrentChatIdState(chatId);
        setCurrentChat(chat);
        setCurrentChatId(chatId);
      }
    };

    window.addEventListener(
      "chat-selected",
      handleChatSelected as EventListener,
    );
    window.addEventListener("chat-updated", loadChat);

    return () => {
      window.removeEventListener(
        "chat-selected",
        handleChatSelected as EventListener,
      );
      window.removeEventListener("chat-updated", loadChat);
    };
  }, []);

  const previousMessagesRef = useRef<string>("");

  const saveMessages = useCallback((messages: UIMessage[]) => {
    if (!currentChatId) return;
    
    // Create a simple hash to compare messages
    const messagesHash = messages.map(m => m.id).join(",");
    
    // Only save if messages actually changed
    if (messagesHash === previousMessagesRef.current) return;

    previousMessagesRef.current = messagesHash;
    updateChatMessages(currentChatId, messages);
    
    // Don't update currentChat state here - it will cause infinite loops
    // The chat will be reloaded when needed via the chat-updated event
  }, [currentChatId]);

  const ensureChatExists = () => {
    if (!currentChatId) {
      const newChat = createChat();
      setCurrentChatIdState(newChat.id);
      setCurrentChat(newChat);
      setCurrentChatId(newChat.id);
    }
  };

  return {
    currentChatId,
    currentChat,
    saveMessages,
    ensureChatExists,
  };
}
