import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { CopyIcon, Loader, RefreshCcwIcon } from "lucide-react";
import { ChatPromptInput } from "@/components/chat-prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "./ai-elements/message";
import type { PromptInputMessage } from "./ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "./ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "./ai-elements/sources";

export function ChatContainer() {
  const { messages, sendMessage, regenerate, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (error) => {
      console.error(error);
    },
  });
  function handleSendMessage(message: PromptInputMessage) {
    sendMessage(message);
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <Conversation className="h-full">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState />
          ) : (
            messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" &&
                  message.parts.filter((part) => part.type === "source-url")
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === "source-url",
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === "source-url")
                        .map((part, i) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Message key={`${message.id}-${i}`} from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                          {message.role === "assistant" &&
                            i === messages.length - 1 && (
                              <MessageActions>
                                <MessageAction
                                  onClick={() => regenerate()}
                                  label="Retry"
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </MessageAction>
                                <MessageAction
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </MessageAction>
                              </MessageActions>
                            )}
                        </Message>
                      );
                    case "reasoning":
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === "streaming" &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))
          )}
          {status === "submitted" && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <ChatPromptInput onSubmit={handleSendMessage} />
    </div>
  );
}
