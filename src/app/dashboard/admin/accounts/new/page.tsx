'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function NewAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (session?.user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        game: formData.get('game'),
        price: parseFloat(formData.get('price') as string),
        originalPrice: parseFloat(formData.get('originalPrice') as string),
        category: formData.get('category'),
        features,
        status: 'available',
        seller: session?.user.id,
      };

      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Bir hata oluştu');
      }

      router.push('/dashboard/admin/accounts');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-secondary-dark p-8">
        <div className="container-width">
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-dark p-8">
      <div className="container-width">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Yeni Hesap Ekle</h1>

          {error && (
            <div className="bg-danger/10 text-danger p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="form-label">
                Başlık
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input"
                placeholder="Hesap başlığı"
              />
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Açıklama
              </label>
              <textarea
                id="description"
                name="description"
                required
                className="input min-h-[100px]"
                placeholder="Hesap açıklaması"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="game" className="form-label">
                  Oyun
                </label>
                <select id="game" name="game" required className="input">
                  <option value="">Oyun seçin</option>
                  <option value="Valorant">Valorant</option>
                  <option value="CS:GO">CS:GO</option>
                  <option value="League of Legends">League of Legends</option>
                  <option value="PUBG">PUBG</option>
                  <option value="Fortnite">Fortnite</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="form-label">
                  Kategori
                </label>
                <select id="category" name="category" required className="input">
                  <option value="">Kategori seçin</option>
                  <option value="FPS">FPS</option>
                  <option value="MOBA">MOBA</option>
                  <option value="Battle Royale">Battle Royale</option>
                  <option value="MMORPG">MMORPG</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="form-label">
                  Fiyat
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  className="input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="originalPrice" className="form-label">
                  İndirimli Fiyat
                </label>
                <input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  required
                  className="input"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Özellikler</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="hover:text-danger"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="input flex-1"
                  placeholder="Yeni özellik ekle"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="btn btn-secondary"
                >
                  Ekle
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-1"
              >
                {saving ? <div className="loading-spinner" /> : 'Hesap Oluştur'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/admin/accounts')}
                className="btn btn-secondary"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 