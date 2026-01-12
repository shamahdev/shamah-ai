import { Loader } from "lucide-react";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { ChatPromptInput } from "@/components/chat-prompt-input";
import { useMessage } from "@/hooks/use-message";
import { cn } from "@/lib/utils";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import { ChatMessageList } from "./chat-message-list";

export function ChatContainer() {
  const { messages, sendMessage, regenerate, status } = useMessage();
  const hasMessages = messages.length > 0;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-4 px-4",
        hasMessages ? "mx-auto max-w-5xl py-6" : "items-center justify-center",
      )}
    >
      {hasMessages ? (
        <>
          <Conversation className="flex-1">
            <ConversationContent>
              <ChatMessageList
                messages={messages}
                status={status}
                onRegenerate={regenerate}
              />
              {status === "submitted" && <Loader className="mx-auto" />}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <ChatPromptInput
            onSubmit={sendMessage}
            className="w-full"
            status={status}
          />
        </>
      ) : (
        <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-8">
          <ChatWelcome onTemplateClick={sendMessage} />
          <ChatPromptInput
            onSubmit={sendMessage}
            className="w-full"
            status={status}
          />
        </div>
      )}
    </div>
  );
}

type ChatWelcomeProps = {
  onTemplateClick: (message: PromptInputMessage) => void;
};

function ChatWelcome({ onTemplateClick }: ChatWelcomeProps) {
  const templates = [
    "Provide a brief summary of Shaddam's professional background.",
    "What is Shaddam's expectation salary?",
    "What are Shaddam's core skills?",
  ];

  const handleTemplateClick = (template: string) => {
    onTemplateClick({ text: template, files: [] });
  };

  return (
    <div className="fade-in slide-in-from-bottom-4 flex animate-in flex-col items-center gap-6 text-center duration-500">
      <img
        src="/logo192.png"
        alt="Shamah AI"
        className="h-16 w-16 rounded-lg"
      />
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl tracking-tight">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground text-sm">
          Ask me anything — I&apos;m here to help
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {templates.map((template) => (
          <button
            key={template}
            type="button"
            onClick={() => handleTemplateClick(template)}
            className="group rounded-lg border bg-background px-4 py-2 text-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {template}
          </button>
        ))}
      </div>
    </div>
  );
}
