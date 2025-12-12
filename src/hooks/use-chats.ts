import { useCallback, useEffect, useState } from "react";
import {
  type Chat,
  createChat,
  deleteChat,
  getChats,
  getCurrentChatId,
  setCurrentChatId,
} from "@/lib/storage";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatIdState] = useState<string | null>(null);

  const loadChats = useCallback(() => {
    const loadedChats = getChats();
    setChats(loadedChats);
    setCurrentChatIdState(getCurrentChatId());
  }, []);

  useEffect(() => {
    loadChats();
    const handleStorageChange = () => {
      loadChats();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("chat-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("chat-updated", handleStorageChange);
    };
  }, [loadChats]);

  const handleNewChat = useCallback(() => {
    const newChat = createChat();
    setCurrentChatId(newChat.id);
    loadChats();
    window.dispatchEvent(new Event("chat-updated"));
  }, [loadChats]);

  const handleSelectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
    setCurrentChatIdState(chatId);
    window.dispatchEvent(
      new CustomEvent("chat-selected", { detail: { chatId } }),
    );
  }, []);

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      deleteChat(chatId);
      loadChats();

      if (currentChatId === chatId) {
        const remainingChats = getChats();
        if (remainingChats.length > 0) {
          handleSelectChat(remainingChats[0].id);
        } else {
          handleNewChat();
        }
      }

      window.dispatchEvent(new Event("chat-updated"));
    },
    [currentChatId, handleSelectChat, handleNewChat, loadChats],
  );

  return {
    chats,
    currentChatId,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
  };
}
