import type { Dispatch, SetStateAction } from "react";
import type { ChatMessage } from "./chat";

/**
 * Props for the ChatSideBar component.
 */
export interface ChatSideBarProps {
  /**
   * Callback function to handle chat selection.
   * @param currentChatId - The ID of the selected chat.
   */
  handleChatClick: (currentChatId: string) => void;

  /**
   * The ID of the currently selected chat.
   * Optional.
   */
  currentChatId?: string;

  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>
}
