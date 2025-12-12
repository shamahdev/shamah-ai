import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef } from "react";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useCurrentChat } from "./use-current-chat";

export function useChatMessages() {
  const { currentChat, currentChatId, saveMessages, ensureChatExists } =
    useCurrentChat();

  const { messages, sendMessage, regenerate, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    messages: currentChat?.messages || [],
    onError: (error) => {
      console.error(error);
    },
  });

  const previousChatIdRef = useRef<string | null>(null);
  const isUpdatingFromChatRef = useRef(false);
  const previousMessagesRef = useRef<string>("");
  const hasInitializedRef = useRef(false);
  const currentChatMessagesRef = useRef<UIMessage[]>([]);

  // Store current chat messages in ref to avoid dependency issues
  useEffect(() => {
    if (currentChat) {
      currentChatMessagesRef.current = currentChat.messages || [];
    }
  }, [currentChat]);

  // Update messages when chat ID changes or when chat first loads
  useEffect(() => {
    const chatId = currentChat?.id;

    // Handle initial load or chat ID change
    if (chatId) {
      const isChatChange = chatId !== previousChatIdRef.current;
      const isInitialLoad = !hasInitializedRef.current;

      if (isChatChange || isInitialLoad) {
        // Get messages from ref (which is updated separately)
        const chatMessages = currentChatMessagesRef.current;
        const messagesHash = chatMessages.map((m) => m.id).join(",");

        previousChatIdRef.current = chatId;
        hasInitializedRef.current = true;
        isUpdatingFromChatRef.current = true;

        // Only update if messages are different
        if (messagesHash !== previousMessagesRef.current) {
          previousMessagesRef.current = messagesHash;
          setMessages(chatMessages);
        }

        // Reset flag after a tick
        setTimeout(() => {
          isUpdatingFromChatRef.current = false;
        }, 0);
      }
    }
  }, [currentChat?.id, setMessages]);

  // Save messages to localStorage whenever they change
  // But skip if we're updating from chat (to avoid loops)
  useEffect(() => {
    if (isUpdatingFromChatRef.current) return;
    if (!currentChatId) return;

    const messagesHash = messages.map((m) => m.id).join(",");

    // Only save if messages actually changed
    if (messagesHash === previousMessagesRef.current) return;

    previousMessagesRef.current = messagesHash;

    // Only save non-empty messages
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages, saveMessages, currentChatId]);

  const handleSendMessage = (message: PromptInputMessage) => {
    ensureChatExists();
    sendMessage(message);
  };

  return {
    messages,
    sendMessage: handleSendMessage,
    regenerate,
    status,
  };
}
