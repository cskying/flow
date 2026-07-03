'use client';

import { useState } from 'react';
import Link from 'next/link';

const MOCK_STAFF = [
  { id: '1', name: 'Alice Tan', role: 'Manager', email: 'alice@brewbite.com', active: true },
  { id: '2', name: 'Bob Lim', role: 'Waiter', email: 'bob@brewbite.com', active: true },
  { id: '3', name: 'Carol Lee', role: 'Kitchen', email: 'carol@brewbite.com', active: true },
  { id: '4', name: 'David Chong', role: 'Cashier', email: 'david@brewbite.com', active: false },
  { id: '5', name: 'Eve Wong', role: 'Storekeeper', email: 'eve@brewbite.com', active: true },
];

export default function StaffPage() {
  const [staff] = useState(MOCK_STAFF);

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>👥 Staff</h1>
        <Link href="/app/staff/create">
          <button style={{ background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            + Add Staff
          </button>
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '8px' }}>{member.name}</td>
              <td style={{ padding: '8px' }}>{member.role}</td>
              <td style={{ padding: '8px' }}>{member.email}</td>
              <td style={{ padding: '8px' }}>
                <span style={{
                  background: member.active ? '#d1fae5' : '#fee2e2',
                  color: member.active ? '#065f46' : '#991b1b',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                }}>
                  {member.active ? '✅ Active' : '❌ Inactive'}
                </span>
              </td>
              <td style={{ padding: '8px' }}>
                <Link href={`/app/staff/${member.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
