import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ReviewPayload {
  admin_id: string;
  reason: string;
  // Optional: room_id or direct_chat_id to indicate what is being reviewed
  room_id?: string;
  direct_chat_id?: string;
}

// POST: Admin creates a review (audit event)
export async function POST(request: Request) {
  const payload = await request.json();
  const { admin_id, reason, room_id, direct_chat_id } = payload as ReviewPayload;

  if (!admin_id || !reason) {
    return new NextResponse(
      JSON.stringify({ error: 'admin_id and reason are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      admin_id,
      reason,
      room_id,
      direct_chat_id,
      status: 'pending',
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