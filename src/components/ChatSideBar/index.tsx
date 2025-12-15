import React, { useEffect, useState } from "react";
import { IndexDB } from "../../utils";
import CreateChat from "../CreateChat";
import { MessageSquare, Trash2 } from "lucide-react";
import type { ChatSideBarProps } from "../../types";

const ChatSidebar: React.FC<ChatSideBarProps> = ({
    handleChatClick,
    currentChatId,
    setChatMessages,
}) => {
    const [chats, setChats] = useState<{ chatId: string; name: string }[]>([]);

    const fetchChats = async () => {
        try {
            const indexDB = IndexDB.getInstance();
            const db = await indexDB.getChats();
            // Reverse to show latest first (assuming append order)
            const reversedChats = db.reverse();
            setChats(reversedChats);

            const chatIdCache = sessionStorage.getItem("chatId");
            if (chatIdCache) {
                handleChatClick(JSON.parse(chatIdCache));
                return;
            }

            // Default select latest if none selected and chats exist
            if (reversedChats.length > 0 && !currentChatId) {
                handleChatClick(reversedChats[0].chatId);
            }
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, [currentChatId]);

    const handleDelete = async (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this chat?")) return;

        const indexDB = IndexDB.getInstance();
        await indexDB.deleteChat(chatId);

        // Refresh list
        const db = await indexDB.getChats();
        const reversedChats = db.reverse();

        setChats(reversedChats);

        // If deleted active chat, select another
        if (chatId === currentChatId) {
            if (reversedChats.length > 0) {
                handleChatClick(reversedChats[0].chatId);
            } else {
                handleChatClick("");
            }
        }

        // alert(reversedChats.length)

        // if (reversedChats.length <= 0) {
        setChatMessages([]);
        sessionStorage.removeItem("chatId");
        // return;
        // }
    };

    return (
        <div className="flex flex-col gap-6 h-full p-4 bg-[#181818] border-r border-[#2A2A2A]">
            <CreateChat onChatCreated={fetchChats} />

            <div className="flex-1 overflow-auto bg-[#1D1D1D] rounded-2xl p-4 border border-[#2A2A2A] shadow-inner">
                <h3 className="text-lg font-bold text-[#E0E0E0] mb-3 border-b border-[#2A2A2A] pb-2 flex items-center gap-2">
                    <MessageSquare size={20} className="text-[#00E6E6]" />
                    Chats
                </h3>
                <ul className="space-y-2">
                    {chats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-center">
                            <MessageSquare size={40} className="mb-2 opacity-20" />
                            <p className="text-sm italic">No chats yet</p>
                            <p className="text-xs mt-1 opacity-60">
                                Create one to get started!
                            </p>
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <li
                                key={chat.chatId}
                                onClick={() => handleChatClick(chat.chatId)}
                                className={`cursor-pointer p-3 rounded-xl hover:bg-[#2A2A2A] text-[#E0E0E0] transition-all border border-transparent hover:border-[#333] flex items-center gap-3 group justify-between ${currentChatId === chat.chatId
                                        ? "bg-[#2A2A2A] border-[#333]"
                                        : ""
                                    }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div
                                        className={`w-2 h-2 rounded-full bg-[#00E6E6] transition-opacity ${currentChatId === chat.chatId
                                                ? "opacity-100"
                                                : "opacity-50 group-hover:opacity-100"
                                            }`}
                                    />
                                    <span className="truncate">{chat.name}</span>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(e, chat.chatId)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all"
                                    title="Delete chat"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ChatSidebar;
