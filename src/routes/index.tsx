import { createFileRoute } from "@tanstack/react-router";
import { ChatContainer } from "@/components/chat-container";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <section className="flex h-screen w-full flex-col bg-background bg-linear-to-b p-2">
      <ChatContainer />
    </section>
  );
}
