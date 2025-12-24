import { Link } from "@tanstack/react-router";
import { HomeIcon, Plus, SearchIcon, ToolboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="w-full">
                <Link to="/">
                  <HomeIcon className="size-4" />
                  Home
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full">
                <SearchIcon className="size-4" />
                Search
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild title="Tools">
                <Link to="/tools">
                  <ToolboxIcon className="size-4" />
                  Tools
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mb-1">
              <SidebarMenuItem className="flex items-center justify-between">
                <SidebarGroupLabel>Chats</SidebarGroupLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  title="New Chat"
                  asChild
                >
                  <Link to="/">
                    <Plus className="size-4" />
                    New Chat
                  </Link>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
            {/* <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarChatButton chat={chat} onDelete={deleteChatById} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu> */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
