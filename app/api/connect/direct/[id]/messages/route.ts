import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: '1' }];
}

// GET: Fetch direct messages for a direct chat
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: directChatId } = params;

  const { data, error } = await supabase
    .from('direct_messages')
    .select('*')
    .eq('direct_chat_id', directChatId)
    .order('created_at', { ascending: true });

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