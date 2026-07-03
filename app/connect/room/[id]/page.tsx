import { RoomClient } from './RoomClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function RoomPage({ params }: { params: { id: string } }) {
  return <RoomClient roomId={params.id} />;
}