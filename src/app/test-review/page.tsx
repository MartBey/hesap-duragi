'use client';

import { useState } from 'react';

export default function TestReviewPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCreateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-test-user' })
      });
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const testCreateReview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create-test-review',
          userId: '676b8e5c123456789abcdef0', // Test user ID
          accountId: '684b8e5c123456789abcdef1', // Test account ID
          rating: 5,
          comment: 'Bu bir test yorumudur!'
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const testListReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'list-reviews',
          accountId: '684b8e5c123456789abcdef1'
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const testRealReview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          accountId: '684b8e5c123456789abcdef1',
          orderId: 'test_order_123',
          rating: 4,
          comment: 'Gerçek API ile test yorumu',
          isAnonymous: false
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const fixReviewIndex = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/fix-review-index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const clearReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clear-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const updateRatings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/accounts/update-ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Review Test Sayfası</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={clearReviews}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 font-bold"
          >
            🗑️ Review&apos;ları Temizle & Index Düzelt
          </button>
          
          <button
            onClick={fixReviewIndex}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 font-bold"
          >
            🔧 Index Hatası Düzelt
          </button>
          
          <button
            onClick={testCreateUser}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Test Kullanıcısı Oluştur
          </button>
          
          <button
            onClick={testCreateReview}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Test Review Oluştur
          </button>
          
          <button
            onClick={testListReviews}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Review&apos;ları Listele
          </button>
          
          <button
            onClick={testRealReview}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Gerçek API Test
          </button>
          
          <button
            onClick={updateRatings}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 font-bold"
          >
            ⭐ Rating&apos;leri Güncelle
          </button>
        </div>

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-2">Yükleniyor...</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Sonuç:</h2>
            <pre className="text-green-400 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Debug Bilgileri:</h2>
          <div className="text-gray-300 space-y-2">
            <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Mevcut' : 'Yok'}</p>
            <p><strong>URL:</strong> {window.location.origin}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 