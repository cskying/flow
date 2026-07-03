'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DirectMessageForm } from '../../components/DirectMessageForm';

interface DirectChat {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message?: string;
  updated_at: string;
}

interface DirectChatClientProps {
  directChatId: string;
}

export function DirectChatClient({ directChatId }: DirectChatClientProps) {
  const [directChats, setDirectChats] = useState<DirectChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<DirectChat | null>(null);

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

      const chats = data ?? [];
      setDirectChats(chats);
      setSelectedChat(chats.find((chat) => chat.id === directChatId) ?? null);
    };
    fetchChats();
  }, [directChatId]);

  // Load messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const loadMessages = async () => {
      const { error } = await supabase
        .from('direct_messages')
        .select('*')
        .eq('direct_chat_id', selectedChat.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading direct messages:', error);
      }
    };
    loadMessages();
  }, [selectedChat]);

  // Real-time subscription for direct chat messages
  useEffect(() => {
    if (!selectedChat) return;

    const channel = supabase
      .channel(`direct-chat:${selectedChat.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages', filter: `direct_chat_id=eq.${selectedChat.id}` }, (payload) => {
        console.log('New direct message:', payload.new);
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
              <p className="font-semibold">{chat.participant1_id} / {chat.participant2_id}</p>
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
        Direct Chat: {selectedChat.participant1_id} / {selectedChat.participant2_id}
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
            <p className="font-semibold">{chat.participant1_id} / {chat.participant2_id}</p>
            <p className="text-sm text-gray-600">
              {chat.last_message || 'No messages'}
            </p>
          </div>
        ))}
      </div>

      <DirectMessageForm directChatId={selectedChat.id} />
    </div>
  );
}