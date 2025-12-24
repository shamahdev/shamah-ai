import { createFileRoute } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <section className="flex h-screen w-full flex-col bg-background bg-linear-to-b p-2">
      <SidebarTrigger />
    </section>
  );
}
