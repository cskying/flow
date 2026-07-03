'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Menu items with their ingredient requirements
const MENU_ITEMS = [
  { name: 'Nasi Lemak', ingredients: [{ name: 'Rice', amount: 0.5 }, { name: 'Chicken', amount: 0.2 }] },
  { name: 'Chicken Rice', ingredients: [{ name: 'Rice', amount: 0.5 }, { name: 'Chicken', amount: 0.3 }] },
  { name: 'Beef Burger', ingredients: [{ name: 'Beef', amount: 0.3 }, { name: 'Flour', amount: 0.2 }] },
  { name: 'Fried Noodles', ingredients: [{ name: 'Noodles', amount: 0.5 }, { name: 'Eggs', amount: 2 }] },
  { name: 'Coffee', ingredients: [{ name: 'Coffee Beans', amount: 0.05 }, { name: 'Milk', amount: 0.1 }] },
  { name: 'Tea', ingredients: [{ name: 'Sugar', amount: 0.05 }] },
  { name: 'Fresh Juice', ingredients: [{ name: 'Sugar', amount: 0.1 }] },
];

const TABLES = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6'];

// Inventory tracking
let inventory: Record<string, number> = {
  'Rice': 50,
  'Chicken': 15,
  'Beef': 5,
  'Noodles': 20,
  'Coffee Beans': 3,
  'Sugar': 10,
  'Flour': 8,
  'Eggs': 60,
  'Milk': 2,
};

// Check if item is available
const checkAvailability = (itemName: string): boolean => {
  const menuItem = MENU_ITEMS.find(m => m.name === itemName);
  if (!menuItem) return false;
  for (const ingredient of menuItem.ingredients) {
    const stock = inventory[ingredient.name] || 0;
    if (stock < ingredient.amount) return false;
  }
  return true;
};

// Deduct stock
const deductStock = (itemName: string): boolean => {
  const menuItem = MENU_ITEMS.find(m => m.name === itemName);
  if (!menuItem) return false;
  for (const ingredient of menuItem.ingredients) {
    const stock = inventory[ingredient.name] || 0;
    if (stock < ingredient.amount) return false;
  }
  for (const ingredient of menuItem.ingredients) {
    inventory[ingredient.name] = (inventory[ingredient.name] || 0) - ingredient.amount;
  }
  return true;
};

export default function CreateOrderPage() {
  const router = useRouter();
  const [table, setTable] = useState('');
  const [items, setItems] = useState<{ name: string; quantity: number }[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableItems = MENU_ITEMS.filter(item => checkAvailability(item.name)).map(item => item.name);

  const addItem = () => {
    if (selectedItem) {
      setError('');
      const existing = items.find(i => i.name === selectedItem);
      if (existing) {
        existing.quantity += quantity;
      } else {
        setItems([...items, { name: selectedItem, quantity }]);
      }
      setSelectedItem('');
      setQuantity(1);
    }
  };

  const removeItem = (name: string) => {
    setItems(items.filter(i => i.name !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!table || items.length === 0) {
      setError('Please select table and add items');
      return;
    }
    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        if (!deductStock(item.name)) {
          setError(`❌ Not enough stock for ${item.name}!`);
          return;
        }
      }
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert(`✅ Order submitted for ${table}! Stock updated.`);
    setLoading(false);
    router.push('/app/orders');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>🆕 New Order</h1>
      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Table</label>
          <select
            value={table}
            onChange={e => setTable(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
            required
          >
            <option value="">Select table</option>
            {TABLES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Add Items</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={selectedItem}
              onChange={e => setSelectedItem(e.target.value)}
              style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
            >
              <option value="">Select item</option>
              {availableItems.map(item => (
                <option key={item} value={item}>{item} ✅</option>
              ))}
              {MENU_ITEMS.filter(item => !availableItems.includes(item.name)).map(item => (
                <option key={item.name} value={item.name} disabled style={{ color: '#999' }}>
                  {item.name} ❌ (Out of stock)
                </option>
              ))}
            </select>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              min="1"
              max="10"
              style={{ width: '60px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
            <button
              type="button"
              onClick={addItem}
              style={{ background: '#2563eb', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Add
            </button>
          </div>
        </div>

        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #f3f4f6' }}>
            <span>{item.name} x{item.quantity}</span>
            <button type="button" onClick={() => removeItem(item.name)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: '#2563eb',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
}
