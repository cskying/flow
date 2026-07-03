import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface MemberPayload {
  user_id: string;
}

// POST: Add member to room
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const payload = await request.json();
  const { user_id } = payload as MemberPayload;

  if (!user_id) {
    return new NextResponse(
      JSON.stringify({ error: 'user_id is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { data, error } = await supabase
    .from('room_members')
    .insert({ room_id: id, user_id })
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