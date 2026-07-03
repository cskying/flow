import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface DirectChat {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  updated_at: string;
}

interface DirectChatPayload {
  participant1_id: string;
  participant2_id: string;
}

// GET: List direct chats (optional)
export async function GET() {
  const { data, error } = await supabase
    .from('direct_chats')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// POST: Find or create a direct chat between two participants
export async function POST(request: Request) {
  const payload = await request.json();
  const { participant1_id, participant2_id } = payload as DirectChatPayload;

  if (!participant1_id || !participant2_id) {
    return new NextResponse(
      JSON.stringify({ error: 'participant ids are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Check if a direct chat already exists (order agnostic)
  const { data, error } = await supabase
    .from('direct_chats')
    .select('id, participant1_id, participant2_id, created_at, updated_at')
    .or(
      `and(participant1_id.eq.${participant1_id},participant2_id.eq.${participant2_id}),and(participant1_id.eq.${participant2_id},participant2_id.eq.${participant1_id})`
    )
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means no rows found; we handle separately
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (data) {
    // Chat exists
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Create new direct chat
  const newChat: DirectChat = {
    id: crypto.randomUUID(),
    participant1_id,
    participant2_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: inserted, error: insertError } = await supabase
    .from('direct_chats')
    .insert(newChat)
    .select('*')
    .single();

  if (insertError) {
    return new NextResponse(
      JSON.stringify({ error: insertError.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new NextResponse(JSON.stringify(inserted), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}