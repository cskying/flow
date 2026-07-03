import { DirectChatClient } from './DirectChatClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: '1' }];
}

export default function DirectChatPage({ params }: { params: { id: string } }) {
  return <DirectChatClient directChatId={params.id} />;
}