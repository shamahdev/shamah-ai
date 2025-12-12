import { SidebarProvider } from "./ui/sidebar";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
