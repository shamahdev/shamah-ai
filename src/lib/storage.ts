import type { UIMessage } from "ai";

const STORAGE_KEY_CHATS = "shamah-ai-chats";
const STORAGE_KEY_CURRENT_CHAT_ID = "shamah-ai-current-chat-id";

export interface Chat {
  id: string;
  title: string;
  messages: UIMessage[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Get all chats from localStorage
 */
export function getChats(): Chat[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY_CHATS);
    if (!stored) return [];
    return JSON.parse(stored) as Chat[];
  } catch (error) {
    console.error("Error loading chats from localStorage:", error);
    return [];
  }
}

/**
 * Save all chats to localStorage
 */
export function saveChats(chats: Chat[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chats));
  } catch (error) {
    console.error("Error saving chats to localStorage:", error);
  }
}

/**
 * Get a specific chat by ID
 */
export function getChat(chatId: string): Chat | null {
  const chats = getChats();
  return chats.find((chat) => chat.id === chatId) || null;
}

/**
 * Save or update a chat
 */
export function saveChat(chat: Chat): void {
  const chats = getChats();
  const existingIndex = chats.findIndex((c) => c.id === chat.id);

  if (existingIndex >= 0) {
    chats[existingIndex] = chat;
  } else {
    chats.push(chat);
  }

  // Sort by updatedAt descending (most recent first)
  chats.sort((a, b) => b.updatedAt - a.updatedAt);

  saveChats(chats);
}

/**
 * Delete a chat by ID
 */
export function deleteChat(chatId: string): void {
  const chats = getChats();
  const filtered = chats.filter((chat) => chat.id !== chatId);
  saveChats(filtered);
}

/**
 * Get the current chat ID from localStorage
 */
export function getCurrentChatId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(STORAGE_KEY_CURRENT_CHAT_ID);
  } catch (error) {
    console.error("Error loading current chat ID:", error);
    return null;
  }
}

/**
 * Set the current chat ID in localStorage
 */
export function setCurrentChatId(chatId: string | null): void {
  if (typeof window === "undefined") return;

  try {
    if (chatId) {
      localStorage.setItem(STORAGE_KEY_CURRENT_CHAT_ID, chatId);
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_CHAT_ID);
    }
  } catch (error) {
    console.error("Error saving current chat ID:", error);
  }
}

/**
 * Create a new chat
 */
export function createChat(title?: string): Chat {
  const chat: Chat = {
    id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: title || "New Chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  saveChat(chat);
  setCurrentChatId(chat.id);

  return chat;
}

/**
 * Update chat messages
 */
export function updateChatMessages(
  chatId: string,
  messages: UIMessage[],
): void {
  const chat = getChat(chatId);
  if (!chat) return;

  chat.messages = messages;
  chat.updatedAt = Date.now();

  // Update title from first user message if no custom title
  if (messages.length > 0 && chat.title === "New Chat") {
    const firstUserMessage = messages.find((m) => m.role === "user");
    if (firstUserMessage) {
      const textPart = firstUserMessage.parts.find((p) => p.type === "text");
      if (textPart && "text" in textPart) {
        const title = textPart.text.slice(0, 50).trim();
        if (title) {
          chat.title = title + (textPart.text.length > 50 ? "..." : "");
        }
      }
    }
  }

  saveChat(chat);
}
