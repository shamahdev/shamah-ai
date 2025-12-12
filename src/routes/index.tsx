import { createFileRoute } from "@tanstack/react-router";
import { ChatContainer } from "@/components/chat-container";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <section className="flex h-screen w-full flex-col bg-background bg-linear-to-b p-4">
      <SidebarTrigger />
      <ChatContainer />
    </section>
  );
}
