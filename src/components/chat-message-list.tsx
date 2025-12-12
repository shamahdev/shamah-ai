import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import type { UIMessage } from "ai";
import type { ChatStatus } from "@ai-sdk/react";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "./ai-elements/message";
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

interface ChatMessageListProps {
  messages: UIMessage[];
  status: ChatStatus;
  onRegenerate: () => void;
}

export function ChatMessageList({
  messages,
  status,
  onRegenerate,
}: ChatMessageListProps) {
  return (
    <>
      {messages.map((message) => (
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
                            onClick={onRegenerate}
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
                      (status === "streaming" || status === "submitted") &&
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
      ))}
    </>
  );
}

