import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface MessagePayload {
  content: string;
}

// POST: Send a message in a room
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id: roomId } = params;
  const payload = await request.json();
  const { content } = payload as MessagePayload;

  if (!content) {
    return new NextResponse(
      JSON.stringify({ error: 'Message content is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: roomId,
      sender_id: 'current_user_id', // placeholder
      content,
    })
    .single();

  if (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new NextResponse(JSON.stringify(data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}