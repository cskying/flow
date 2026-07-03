'use client';

import { useState } from 'react';

const INVENTORY = [
  { id: '1', name: 'Rice', quantity: 50, unit: 'kg', expiry: '2026-12-31', status: 'OK' },
  { id: '2', name: 'Chicken', quantity: 15, unit: 'kg', expiry: '2026-07-10', status: 'OK' },
  { id: '3', name: 'Beef', quantity: 5, unit: 'kg', expiry: '2026-07-05', status: 'Low' },
  { id: '4', name: 'Coffee Beans', quantity: 3, unit: 'kg', expiry: '2026-09-01', status: 'Low' },
  { id: '5', name: 'Milk', quantity: 2, unit: 'liters', expiry: '2026-07-04', status: 'Expiring' },
];

export default function InventoryPage() {
  const [inventory] = useState(INVENTORY);

  const getStatus = (status: string) => {
    switch (status) {
      case 'OK': return { bg: '#d1fae5', text: '#065f46', label: ' In Stock' };
      case 'Low': return { bg: '#fef3c7', text: '#92400e', label: ' Low Stock' };
      case 'Expiring': return { bg: '#fee2e2', text: '#991b1b', label: ' Expiring Soon' };
      default: return { bg: '#f3f4f6', text: '#6b7280', label: 'Unknown' };
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}> Inventory</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>Item</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Quantity</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Unit</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Expiry</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const status = getStatus(item.status);
            return (
              <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px' }}>{item.name}</td>
                <td style={{ padding: '8px' }}>{item.quantity}</td>
                <td style={{ padding: '8px' }}>{item.unit}</td>
                <td style={{ padding: '8px' }}>{item.expiry}</td>
                <td style={{ padding: '8px' }}>
                  <span style={{ background: status.bg, color: status.text, padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                    {status.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
