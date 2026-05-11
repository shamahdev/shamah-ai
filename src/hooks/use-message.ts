import { useChat as useAiChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import React, { useEffect } from "react";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";

export const STORAGE_KEY = "shamah_ai_conversation";

export function useMessage() {
  const [initialMessages, setInitialMessages] = React.useState<unknown[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        localStorage.removeItem(STORAGE_KEY);
        setInitialMessages(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const { messages, sendMessage, regenerate, status } = useAiChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    messages: initialMessages as any,
  });

  // Save messages to localStorage on every batch (skip streaming/error)
  useEffect(() => {
    if (status === "streaming" || status === "error") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, status]);

  const handleSendMessage = async (message: PromptInputMessage) => {
    await sendMessage(message as unknown as Parameters<typeof sendMessage>[0]);
  };

  return {
    messages,
    sendMessage: handleSendMessage,
    regenerate,
    status,
  };
}
