'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  admin_id: string;
  reason: string;
  room_id?: string;
  direct_chat_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    admin_id: '',
    reason: '',
    room_id: '',
    direct_chat_id: '',
  });

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading reviews:', error);
      return;
    }
    setReviews(data ?? []);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { admin_id, reason, room_id, direct_chat_id } = newReview;

    if (!admin_id || !reason) {
      alert('Admin ID and reason are required');
      return;
    }

    const { error } = await supabase
      .from('reviews')
      .insert({
        admin_id,
        reason,
        room_id: room_id || null,
        direct_chat_id: direct_chat_id || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating review:', error);
      return;
    }

    setNewReview({ admin_id: '', reason: '', room_id: '', direct_chat_id: '' });
    loadReviews();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Reviews</h1>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Pending Reviews ({reviews.length})</h2>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={loadReviews}
        >
          Refresh
        </button>
      </div>

      {/* Review Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-sm font-semibold mb-2">Create New Review</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block text-sm font-medium">
              Admin ID
            </label>
            <input
              type="text"
              name="admin_id"
              value={newReview.admin_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Reason
            </label>
            <textarea
              name="reason"
              value={newReview.reason}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Room ID (optional)
            </label>
            <input
              type="text"
              name="room_id"
              value={newReview.room_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Direct Chat ID (optional)
            </label>
            <input
              type="text"
              name="direct_chat_id"
              value={newReview.direct_chat_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        {reviews.length === 0 ? (
          <p>No pending reviews.</p>
        ) : (
          <ul className="space-y-2">
            {reviews.map((review) => (
              <li key={review.id} className="border-b pb-2 mt-2">
                <p className="font-medium">
                  Admin: {review.admin_id} | Reason: {review.reason}
                </p>
                <p className="text-sm text-gray-600">
                  Room ID: {review.room_id || '—'} | Direct Chat ID: {review.direct_chat_id || '—'}
                </p>
                <p className="text-xs text-gray-500">
                  Created: {new Date(review.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}