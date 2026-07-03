export const dynamicParams = false;

export function generateStaticParams() {
  return [{ stationId: 'main' }];
}

export default function StationPage({ params }: { params: { stationId: string } }) {
  return <h1>Station {params.stationId} Works</h1>;
}