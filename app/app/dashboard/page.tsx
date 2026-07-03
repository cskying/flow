'use client';

import { useState } from 'react';

const DASHBOARD_DATA = {
  revenue: 2845.50,
  orders: 42,
  avgOrderValue: 67.75,
  channelSplit: { waiter: 18, counter: 12, qr: 8, online: 4 },
  orderFunnel: { submitted: 8, preparing: 5, ready: 3, completed: 26 },
  kitchenBacklog: 6,
  oldestTicket: '12 min',
  tableOccupancy: '7/12',
  stockRisk: 3,
};

export default function DashboardPage() {
  const [data] = useState(DASHBOARD_DATA);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>📊 Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Today's Revenue</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>RM {data.revenue.toFixed(2)}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Orders</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{data.orders}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Avg Order Value</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>RM {data.avgOrderValue.toFixed(2)}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Table Occupancy</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{data.tableOccupancy}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Order Funnel</h3>
          <div>Submitted: {data.orderFunnel.submitted}</div>
          <div>Preparing: {data.orderFunnel.preparing}</div>
          <div>Ready: {data.orderFunnel.ready}</div>
          <div>Completed: {data.orderFunnel.completed}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Channel Split</h3>
          <div>Waiter: {data.channelSplit.waiter}</div>
          <div>Counter: {data.channelSplit.counter}</div>
          <div>QR: {data.channelSplit.qr}</div>
          <div>Online: {data.channelSplit.online}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>👨‍🍳 Kitchen</h3>
          <div>Backlog: {data.kitchenBacklog} tickets</div>
          <div>Oldest ticket: {data.oldestTicket}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>📦 Stock Risk</h3>
          <div style={{ color: '#991b1b' }}>{data.stockRisk} items low in stock</div>
        </div>
      </div>
    </div>
  );
}
