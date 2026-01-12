import type { ChatStatus } from "ai";
import { useRef } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSpeechButton,
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

  return (
    <PromptInputProvider>
      <PromptInput multiple onSubmit={handleSubmit} className={className}>
        {/* <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments> */}
        <PromptInputBody>
          <PromptInputTextarea ref={textareaRef} />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            {/* <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu> */}
            <PromptInputSpeechButton textareaRef={textareaRef} />
          </PromptInputTools>
          <PromptInputSubmit status={status} disabled={isDisabled} />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  );
}
