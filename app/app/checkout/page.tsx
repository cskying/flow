'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MOCK_ORDER = {
  id: '1',
  table: 'Table 3',
  items: [
    { name: 'Nasi Lemak', price: 12.90, quantity: 2 },
    { name: 'Coffee', price: 4.50, quantity: 1 },
  ],
};

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const total = MOCK_ORDER.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/app/payment/success');
    }, 1500);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>💳 Checkout</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', margin: '16px 0' }}>
        <p><strong>Order #{MOCK_ORDER.id}</strong></p>
        <p>{MOCK_ORDER.table}</p>
        {MOCK_ORDER.items.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span>{item.name} x{item.quantity}</span>
            <span>RM {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
          <span>Total</span>
          <span>RM {total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: loading ? '#999' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        disabled={loading}
      >
        {loading ? 'Processing...' : '💰 Pay Now'}
      </button>

      <Link href="/app/orders" style={{ display: 'block', textAlign: 'center', marginTop: '12px', color: '#666' }}>
        ← Back to Orders
      </Link>
    </div>
  );
}
