'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { DirectMessageForm } from '@/components/DirectMessageForm';

interface DirectChat {
  id: string;
  participant_id: string;
  last_message?: string;
  updated_at: string;
}

interface DirectMessage {
  id: string;
  direct_chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function DirectChatPage() {
  const [directChats, setDirectChats] = useState<DirectChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<DirectChat | null>(null);
  const searchParams = useSearchParams();
  const directChatId = searchParams.get('id');

  // Load direct chats
  useEffect(() => {
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from('direct_chats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching direct chats:', error);
        return;
      }
      setDirectChats(data);
    };
    fetchChats();
  }, []);

  // Load messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .eq('direct_chat_id', selectedChat.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading direct messages:', error);
        return;
      }
      // We could set messages state here if needed, but DirectMessageForm handles its own state.
    };
    loadMessages();
  }, [selectedChat]);

  // Real-time subscription for direct chat messages
  useEffect(() => {
    if (!selectedChat) return;

    const channel = supabase
      .channel(`direct-chat:${selectedChat.id}`)
      .on('message', { event: 'INSERT', channel: `direct_chat:${selectedChat.id}` }, (payload) => {
        const message = payload.new;
        // For simplicity, we could update a messages state, but DirectMessageForm manages its own.
        console.log('New direct message:', message);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat]);

  const handleSelectChat = (chat: DirectChat) => {
    setSelectedChat(chat);
  };

  if (!directChatId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Select Direct Chat</h1>
        <div className="space-y-2">
          {directChats.map((chat) => (
            <div key={chat.id} className="border p-2 rounded hover:bg-gray-100 cursor-pointer">
              <p className="font-semibold">{chat.participant_id}</p>
              <p className="text-sm text-gray-600">
                Last message: {chat.last_message || '—'}
              </p>
              <button
                className="mt-2 w-full bg-blue-600 text-white py-1 rounded"
                onClick={() => handleSelectChat(chat)}
              >
                Open Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedChat) {
    return (
      <div className="p-6">
        <p>Select a chat first.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Direct Chat with {selectedChat.participant_id}
      </h1>

      {/* Company notice */}
      <div className="mb-4 p-2 border border-red-300 bg-red-50 rounded">
        Company-managed workspace. Admins may review.
      </div>

      <div className="space-y-2">
        {directChats.map((chat) => (
          <div
            key={chat.id}
            className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelectChat(chat)}
          >
            <p className="font-semibold">{chat.participant_id}</p>
            <p className="text-sm text-gray-600">
              {chat.last_message || 'No messages'}
            </p>
          </div>
        ))}
      </div>

      <DirectMessageForm
        directChatId={selectedChat.id}
        onMessageChange={setNewMessage}
        onSend={handleSend}
      />
    </div>
  );
}

// Helper hook (could be expanded)
function useDirectChat() {
  // Placeholder
  return {};
}