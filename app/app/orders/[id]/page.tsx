export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: '1' }];
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <h1>Order {params.id} Works</h1>;
}