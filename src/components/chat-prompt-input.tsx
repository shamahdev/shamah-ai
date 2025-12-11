"use client";

import { useRef, useState } from "react";
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

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

type ChatPromptInputProps = {
  onSubmit: (message: PromptInputMessage) => void;
};

export function ChatPromptInput({ onSubmit }: ChatPromptInputProps) {
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");
    onSubmit(message);

    setTimeout(() => {
      setStatus("streaming");
    }, SUBMITTING_TIMEOUT);

    setTimeout(() => {
      setStatus("ready");
    }, STREAMING_TIMEOUT);
  };

  return (
    <PromptInputProvider>
      <PromptInput multiple onSubmit={handleSubmit}>
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
          <PromptInputSubmit status={status} />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  );
}
