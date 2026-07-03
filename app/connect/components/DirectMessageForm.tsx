'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DirectMessageFormProps {
  directChatId: string;
}

export function DirectMessageForm({ directChatId }: DirectMessageFormProps) {
  const [messages, setMessages] = useState<Array<{ id: string; content: string; created_at: string }>>([]);
  const [draft, setDraft] = useState('');

  // Load messages whenever directChatId changes
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .eq('direct_chat_id', directChatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching direct messages:', error);
        return;
      }
      setMessages(data ?? []);
    };
    fetchMessages();
  }, [directChatId]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content) return;

    const { data, error } = await supabase
      .from('direct_messages')
      .insert([
        {
          direct_chat_id: directChatId,
          sender_id: 'current_user_id', // placeholder
          content,
        },
      ])
      .select('id, content, created_at')
      .single();

    if (error) {
      console.error('Error sending direct message:', error);
      return;
    }

    const sentMessage = data ?? {
      id: crypto.randomUUID(),
      content,
      created_at: new Date().toISOString(),
    };

    setDraft('');
    setMessages((prev) => [...prev, sentMessage]);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSend();
    }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-600">You:</span>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      <ul className="space-y-1">
        {messages.map((msg) => (
          <li key={msg.id} className="p-2 bg-gray-100 rounded">
            <span className="font-medium">{msg.content}</span>
            <small className="block text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleTimeString()}
            </small>
          </li>
        ))}
      </ul>
    </form>
  );
}