'use client';

import { useState } from 'react';

interface MessageFormProps {
  roomId: string;
  onMessageChange: (value: string) => void;
  onSend: (message: string) => void | Promise<void>;
}

export function MessageForm({ roomId, onMessageChange, onSend }: MessageFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = message.trim();
    if (!content) return;

    await onSend(content);
    setMessage('');
    onMessageChange('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          onMessageChange(e.target.value);
        }}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
}