import React, { useState } from 'react';
import { IndexDB } from '../utils';
import { Plus } from 'lucide-react';
import type { CreateChatProps } from '../types';

const CreateChat: React.FC<CreateChatProps> = ({ onChatCreated }) => {
  const [chatName, setChatName] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(event.target.value);
  };

  const handleCreateChat = async () => {
    if (chatName.trim() === '') {
      setError('Name required');
      return;
    }

    try {
      const indexDB = IndexDB.getInstance();
      const chatId = await indexDB.createNewChat(chatName);
      console.log(`New chat created with ID: ${chatId}`);
      setChatName('');
      setError('');
      setIsCreating(false);

      if (onChatCreated) {
        onChatCreated();
      }
    } catch (err) {
      setError('Failed');
    }
  };

  if (!isCreating) {
    return (
      <button
        onClick={() => setIsCreating(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#00E6E6] text-[#001F1F] font-semibold hover:bg-[#00CCCC] transition-colors shadow-lg shadow-[#00E6E640]"
      >
        <Plus size={20} />
        New Chat
      </button>
    )
  }

  return (
    <div className="bg-[#1D1D1D] p-4 rounded-xl border border-[#2A2A2A] shadow-lg">
      <h3 className="text-sm font-bold text-[#E0E0E0] mb-3">New Chat</h3>

      <input
        type="text"
        value={chatName}
        onChange={handleInputChange}
        placeholder="Chat Name"
        className="w-full px-3 py-2 mb-3 rounded-lg bg-[#0A0A0A] text-white border border-[#2A2A2A] focus:border-[#00E6E6] focus:ring-1 focus:ring-[#00E6E6] text-sm outline-none transition-all"
        autoFocus
      />

      <div className="flex gap-2">
        <button
          onClick={() => setIsCreating(false)}
          className="flex-1 px-3 py-2 rounded-lg border border-[#2A2A2A] text-[#E0E0E0] text-sm hover:bg-[#2A2A2A] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateChat}
          className="flex-1 px-3 py-2 rounded-lg bg-[#00E6E6] text-[#001F1F] text-sm font-semibold hover:bg-[#00CCCC] transition-colors"
        >
          Create
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
};

export default CreateChat;
