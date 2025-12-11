import { createFileRoute } from "@tanstack/react-router";
import { ChatContainer } from "@/components/chat-container";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="flex h-screen items-center justify-center">
      <section className="flex h-full w-full max-w-3xl flex-col bg-background p-2">
        <ChatContainer />
      </section>
    </main>
  );
}
