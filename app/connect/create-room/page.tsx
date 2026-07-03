'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface CreateRoomPayload {
  name: string;
  org_id: string;
}

export default function CreateRoomPage() {
  const [name, setName] = useState('');
  const [orgId, setOrgId] = useState('org_123'); // placeholder
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateRoomPayload = { name: name.trim(), org_id: orgId };
    if (!payload.name) {
      alert('Room name is required');
      return;
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room');
      return;
    }

    router.push(`/connect/room/${data.id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Room</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Room Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Organization ID
          </label>
          <input
            type="text"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Room
        </button>
      </form>
    </div>
  );
}