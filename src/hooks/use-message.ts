import { useChat as useAiChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";

export function useMessage() {
  const { messages, sendMessage, regenerate, status } = useAiChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
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
