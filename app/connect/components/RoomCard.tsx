'use client';

import { useRouter } from 'next/navigation';

interface Room {
  id: string;
  name: string;
  org_id: string;
  created_at: string;
}

export function RoomCard({ room }: { room: Room }) {
  const router = useRouter();

  const handleJoin = () => {
    router.push(`/connect/room/${room.id}`);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold text-lg">{room.name}</h2>
      <p className="text-sm text-gray-600">
        Org: {room.org_id}
      </p>
      <button
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={handleJoin}
      >
        Join Room
      </button>
    </div>
  );
}