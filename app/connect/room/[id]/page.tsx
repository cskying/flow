'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MessageForm } from '@/components/MessageForm';

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function RoomPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('id');

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
      setMessages(data);
    };

    fetchMessages();
  }, [roomId]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel('room-messages')
      .on('message', { event: 'INSERT', channel: `room:${roomId}` }, (payload) => {
        const message = payload.new;
        setMessages((prev) => [...prev, message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const handleSend = async () => {
    if (!roomId || newMessage.trim() === '') return;

    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          room_id: roomId,
          sender_id: 'current_user_id', // placeholder
          content: newMessage.trim(),
        },
      ]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
    // Optimistically add message
    setMessages((prev) => [...prev, { ...data?.[0], created_at: new Date().toISOString() }]);
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