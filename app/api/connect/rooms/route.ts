import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Types
interface Room {
  id: string;
  name: string;
  org_id: string;
  created_at: string;
}

interface CreateRoomPayload {
  name: string;
  org_id: string;
}

// GET: List rooms (public)
export async function GET() {
  const { data, error } = await supabase
    .from('rooms')
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

// POST: Create a new room
export async function POST(request: Request) {
  const payload = await request.json();
  const { name, org_id } = payload as CreateRoomPayload;

  if (!name || !org_id) {
    return new NextResponse(
      JSON.stringify({ error: 'Name and org_id are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { data, error } = await supabase
    .from('rooms')
    .insert({ name, org_id })
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