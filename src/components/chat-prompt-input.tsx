import type { ChatStatus } from "ai";
import { useEffect, useRef } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

type ChatPromptInputProps = {
  onSubmit: (message: PromptInputMessage) => void;
  className?: string;
  status?: ChatStatus;
};

export function ChatPromptInput({
  onSubmit,
  className,
  status,
}: ChatPromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    onSubmit(message);
  };

  const isDisabled = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (status === "streaming") {
      window.onbeforeunload = () =>
        "You have an active chat session. Are you sure you want to leave?";
    } else {
      window.onbeforeunload = null;
    }
  }, [status]);

  return (
    <PromptInputProvider>
      <PromptInput multiple onSubmit={handleSubmit} className={className}>
        <PromptInputBody>
          <PromptInputTextarea ref={textareaRef} />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools></PromptInputTools>
          <PromptInputSubmit status={status} disabled={isDisabled} />
        </PromptInputFooter>
      </PromptInput>
      <p className="text-muted-foreground text-xs">
        Your chats are saved locally.
      </p>
    </PromptInputProvider>
  );
}
