'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageForm } from '../../components/MessageForm';

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface RoomClientProps {
  roomId: string;
}

export function RoomClient({ roomId }: RoomClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages whenever roomId changes
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      setMessages(data ?? []);
    };

    fetchMessages();
  }, [roomId]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel('room-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` }, (payload) => {
        const message = payload.new as Message;
        setMessages((prev) => [...prev, message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const handleSend = async (content: string) => {
    if (!roomId || !content.trim()) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        sender_id: 'current_user_id', // placeholder
        content: content.trim(),
      })
      .select('id, room_id, sender_id, content, created_at')
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
    setMessages((prev) => [
      ...prev,
      data ?? {
        id: crypto.randomUUID(),
        room_id: roomId,
        sender_id: 'current_user_id',
        content: content.trim(),
        created_at: new Date().toISOString(),
      },
    ]);
  };

  if (!roomId) {
    return <p>Room ID not provided.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Room: {roomId}</h1>
      <div className="flex-1 border-b py-2 mb-4">
        <MessageForm
          roomId={roomId}
          onMessageChange={setNewMessage}
          onSend={handleSend}
        />
      </div>

      <div className="space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 bg-gray-100 rounded">
            <p className="font-medium">{msg.content}</p>
            <small className="text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}