import { Loader } from "lucide-react";
import { ChatPromptInput } from "@/components/chat-prompt-input";
import { useMessage } from "@/hooks/use-message";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import { ChatMessageList } from "./chat-message-list";

export function ChatContainer() {
  const { messages, sendMessage, regenerate, status } = useMessage();

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <Conversation className="h-full">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState />
          ) : (
            <ChatMessageList
              messages={messages}
              status={status}
              onRegenerate={regenerate}
            />
          )}
          {status === "submitted" && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <ChatPromptInput onSubmit={sendMessage} />
    </div>
  );
}
