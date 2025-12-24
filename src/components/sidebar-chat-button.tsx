// import { Link, useMatchRoute } from "@tanstack/react-router";
// import { EllipsisIcon, Trash2 } from "lucide-react";
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { formatRelativeTime } from "@/lib/date-utils";
// import type { ChatEntity } from "@/lib/storage";
// import { cn } from "@/lib/utils";
// import { Button } from "./ui/button";
// import { SidebarMenuButton } from "./ui/sidebar";

// type SidebarChatButtonProps = Omit<
//   React.ComponentProps<typeof SidebarMenuButton>,
//   "onSelect" | "onDelete"
// > & {
//   chat: ChatEntity;
//   onDelete: (chatId: string) => void;
// };

// export function SidebarChatButton({ chat, onDelete }: SidebarChatButtonProps) {
//   const matchRoute = useMatchRoute();
//   const match = matchRoute({ to: "/$id", params: { id: chat.id } });
//   const isActive = !!match;

//   const [showDialog, setShowDialog] = useState(false);

//   return (
//     <>
//       <SidebarMenuButton
//         asChild
//         isActive={isActive}
//         className="group/chat-button relative w-full"
//         size="lg"
//       >
//         <Link to="/$id" params={{ id: chat.id }}>
//           <div className="min-w-0 flex-1">
//             <div className="truncate text-sm">{chat.title}</div>
//             <div className="text-[11px] text-muted-foreground">
//               {formatRelativeTime(chat.updatedAt)}
//             </div>
//           </div>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={(e) => e.stopPropagation()}
//                 className={cn(
//                   "size-6 opacity-0 transition-opacity group-hover/chat-button:opacity-100",
//                   "data-[state=open]:opacity-100",
//                 )}
//                 title="Chat actions"
//               >
//                 <EllipsisIcon className="size-3" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem
//                 variant="destructive"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowDialog(true);
//                 }}
//               >
//                 <Trash2 className="size-4" />
//                 Delete chat
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </Link>
//       </SidebarMenuButton>
//       <Dialog open={showDialog} onOpenChange={setShowDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete chat</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this chat? This action cannot be
//               undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowDialog(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={() => onDelete(chat.id)}>
//               Yes, delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
