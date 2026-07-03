'use client';

import { useState } from 'react';
import Link from 'next/link';

const MOCK_ROOMS = [
  { id: '1', name: '🏢 Organisation Hub', type: 'ORG_HUB', members: 8, lastMessage: 'Welcome everyone!' },
  { id: '2', name: '📢 Announcements', type: 'ANNOUNCEMENT', members: 12, lastMessage: 'Team meeting at 3pm' },
  { id: '3', name: '👨‍🍳 Kitchen', type: 'TEAM_ROOM', members: 5, lastMessage: 'Order #28 is ready' },
];

export default function ConnectPage() {
  const [rooms] = useState(MOCK_ROOMS);

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>💬 Flow Connect</h1>
        <Link href="/connect/create-room">
          <button style={{ background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            + Create Room
          </button>
        </Link>
      </div>

      {rooms.map((room) => (
        <div key={room.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '8px' }}>
          <div style={{ fontWeight: 'bold' }}>{room.name}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>{room.type} · {room.members} members</div>
          <div style={{ color: '#9ca3af', fontSize: '14px' }}>{room.lastMessage}</div>
        </div>
      ))}
    </div>
  );
}
