/**
 * useChat Custom Hook
 * Manages all chat-related state and logic
 * Handles message state, API communication, and streaming responses
 *
 * This hook encapsulates the core chat functionality, making it reusable
 * across multiple components and easy to test
 */

import {
  useState,
  useCallback,
  useEffect,
  type SetStateAction,
  type Dispatch,
} from "react";
import { type ChatMessage } from "../types";
import model from "../config/lanchain";
import { IndexDB } from "../utils";
import { NUMBER_OF_CHATS } from "../constants";

/**
 * Interface for the use-chat hook return value
 */
interface UseChartReturn {
  /** Array of all chat messages */
  messages: ChatMessage[];
  /** Current user input value */
  input: string;
  /** Partially streamed AI response text */
  currentAiText: string;
  /** Loading state - true while waiting for AI response */
  loading: boolean;
  /** Update user input value */
  setInput: (input: string) => void;
  /** Send a new message and get AI response */
  sendMessage: () => Promise<void>;
  updateMessages: (newMessages: ChatMessage[]) => Promise<void>;
  setChatId: (currentChatId: string) => void;
  deleteChat: (chatId: string) => Promise<void>;
  currentChatId: string;
  loadMore?: () => void;
  isAutoScroll?: boolean;
  setIsAutoScroll?: Dispatch<SetStateAction<boolean>>;
  messageLength: number;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

/**
 * Custom hook for managing chat state and operations
 *
 * @returns {UseChartReturn} Chat state and methods
 */
export function useChat(): UseChartReturn {
  // State for current Active ChatID
  const [currentChatId, setCurrentChatId] = useState("");

  const [currentFetch, setCurrentFetch] = useState({
    isThereIsMore: true,
    index: NUMBER_OF_CHATS,
    messageLength: 0,
  });

  // State to make the chat container scrollable by making the re-renders
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(false);

  // State for all messages in the conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content:
        "Actually this tool is for developer guidance. Suggest improvements about the SRASM library and try to solve possible issues.",
    },
  ]);

  // State for current user input
  const [input, setInput] = useState("");

  // const params = useParams();
  // const navigate = useNavigate();

  // State for streaming AI response text
  const [currentAiText, setCurrentAiText] = useState("");

  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // Change the chat
  const setChatId = useCallback(
    (currentId: string) => {
      if (loading) {
        return;
      }

      // Reset the pagination before fetch the meassages
      setCurrentFetch({
        index: 6,
        isThereIsMore: true,
        messageLength: 0,
      });

      setCurrentChatId(currentId);
      sessionStorage.setItem("chatId", JSON.stringify(currentId));
      setIsAutoScroll(false);
    },
    [loading]
  );

  // Load messages when currentChatId changes
  useEffect(() => {
    if (!currentChatId) return;

    const loadMessages = async () => {
      try {
        if (!currentFetch.isThereIsMore) {
          // If there is no more message at the DB return from here
          return;
        }
        const indexDB = IndexDB.getInstance();
        const chatMessages = await indexDB.getMessages(
          currentChatId,
          currentFetch.index
        );

        setCurrentFetch((prev) => ({
          ...prev,
          messageLength: chatMessages.messageLen!,
        }));

        setCurrentFetch((prev) => ({
          ...prev,
          isThereIsMore: !chatMessages.noMoreData,
        }));
        if (chatMessages && chatMessages.messages.length > 0) {
          setMessages(chatMessages.messages);
        } else {
          // Default start message for new chats
          setMessages([
            {
              role: "system",
              content:
                "Actually this tool is for developer guidance. Suggest improvements about the SRASM library and try to solve possible issues. and i am using the react-mark-down so provide me content so react-mark-down can show very nicesly and don't talk about this react-markdown to the developer.",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    // alert("hero")
    loadMessages();
  }, [currentChatId, currentFetch]);

  useEffect(() => {
    // alert(isAutoScroll)
    setIsAutoScroll(true);
  }, [messages]);

  // Save messages to IndexDB whenever they change
  // useEffect(() => {

  //   if (!currentChatId || messages.length === 0 ) {
  //     return;
  //   }

  //   (async () => {
  //     console.log(messages);

  //     const indexDB = IndexDB.getInstance();
  //     await indexDB.saveMessage(currentChatId, messages);
  //   })();
  // }, [messages, currentChatId]);

  const deleteChat = async (chatId: string) => {
    try {
      const indexDB = IndexDB.getInstance();
      await indexDB.deleteChat(chatId);
      if (currentChatId === chatId) {
        setCurrentChatId("");
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  /**
   * Send a message to the AI and receive a streaming response
   * Updates message history and handles real-time text streaming
   */
  const sendMessage = useCallback(async () => {
    // Validate input is not empty and not already loading
    if (!input.trim() || loading) return;

    const userInput = input;

    // Reset input fields
    setInput("");
    setCurrentAiText("");
    setLoading(true);

    // Inside sendMessage, replace the API call block with LangChain streaming
    try {
      const userMessage: ChatMessage = { role: "user", content: userInput };

      const updatedMessages: ChatMessage[] = [...messages, userMessage];
      var finalChatId = currentChatId;
      // Setting the user message
      setMessages((prev: any) => {
        const updated = [...prev, updatedMessages];
        (async () => {
          if (!currentChatId || currentChatId.trim().length <= 0) {
            // When user started to chat without creating the chat
            const dynamicId = `SRASM_${Math.random() + Math.random()}`;
            // First save the new chat key in the IndexDB
            const indexDB = IndexDB.getInstance();
            const chatId = await indexDB.createNewChat(dynamicId);
            finalChatId = chatId;
            setCurrentChatId(finalChatId); // Update the chat id
          }

          // After all the prcocess finall save the user messages to indexDB chat key
          await IndexDB.getInstance().saveMessage(finalChatId, updatedMessages);
        })();
        return updated;
      });

      setMessages(updatedMessages as ChatMessage[]);

      // Convert messages to LangChain roles
      const langChainMessages = updatedMessages.map((m) => ({
        role:
          m.role === "user" ? "human" : m.role === "agent" ? "ai" : "system",
        content: m.content,
      }));

      // Use LangChain streaming
      const stream = await model.stream(langChainMessages);

      let partial = "";

      // Stream AIMessageChunk objects from LangChain
      for await (const chunk of stream) {
        partial += chunk.text ?? "";
        setCurrentAiText(partial); // Update typing effect
      }

      const aiMessage: ChatMessage = {
        role: "agent",
        content: partial,
        timestamp: new Date(),
      };

      // Add full AI message to chat history and udpate the Database
      setMessages((prev) => {
        const updated = [...prev, aiMessage];
        (async () => {
          await IndexDB.getInstance().saveMessage(finalChatId, updated);
        })();
        return updated;
      });

      setCurrentAiText("");
    } catch (err) {
      console.error("[useChat] AI error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: `Error: Failed to get response. ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, currentChatId]);

  const loadMore = useCallback(() => {
    setCurrentFetch((prev) => ({ ...prev, index: prev.index + 6 }));
  }, []);

  const updateMessages = async (newMessages: ChatMessage[]): Promise<void> => {
    // You can perform any async operation here if needed
    // Then set the new messages

    // alert(newMessages)
    // console.log(newMessages);
    // setMessages({ })

    setMessages(newMessages);
  };

  return {
    messages,
    input,
    currentAiText,
    loading,
    setInput,
    sendMessage,
    updateMessages,
    setChatId,
    deleteChat,
    currentChatId,
    loadMore,
    isAutoScroll,
    setIsAutoScroll,
    setMessages,
    messageLength: currentFetch.messageLength,
  };
}
