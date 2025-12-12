import { MessageSquare, Plus, Trash2 } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { useChats } from "@/hooks/use-chats";
import { formatRelativeTime } from "@/lib/date-utils";

export function AppSidebar() {
  const {
    chats,
    currentChatId,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
  } = useChats();

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    handleDeleteChat(chatId);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Shamah AI</SidebarGroupLabel>
        </SidebarGroup>
        <SidebarGroup>
          <div className="flex items-center justify-between py-1">
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleNewChat}
              className="h-6 w-6"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.length === 0 ? (
                <SidebarMenuItem>
                  <div className="px-2 py-1.5 text-muted-foreground text-sm">
                    No chats yet
                  </div>
                </SidebarMenuItem>
              ) : (
                chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      onClick={() => handleSelectChat(chat.id)}
                      isActive={currentChatId === chat.id}
                      className="group relative w-full"
                      size="lg"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm">{chat.title}</div>
                        <div className="text-muted-foreground text-xs">
                          {formatRelativeTime(chat.updatedAt)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => handleDeleteClick(e, chat.id)}
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        title="Delete chat"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
