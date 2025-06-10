'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
}

export default function EditUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (session?.user.role !== 'admin') {
      router.push('/dashboard');
    } else {
      fetchUser();
    }
  }, [status, session]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      setUser(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        balance: parseFloat(formData.get('balance') as string),
      };

      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Bir hata oluştu');
      }

      router.push('/dashboard/admin/users');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
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

  if (!session || session.user.role !== 'admin' || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-dark p-8">
      <div className="container-width">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Kullanıcı Düzenle</h1>

          {error && (
            <div className="bg-danger/10 text-danger p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="form-label">
                Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input"
                defaultValue={user.name}
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                defaultValue={user.email}
              />
            </div>

            <div>
              <label htmlFor="role" className="form-label">
                Rol
              </label>
              <select
                id="role"
                name="role"
                required
                className="input"
                defaultValue={user.role}
              >
                <option value="user">Kullanıcı</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="balance" className="form-label">
                Bakiye
              </label>
              <input
                id="balance"
                name="balance"
                type="number"
                step="0.01"
                required
                className="input"
                defaultValue={user.balance}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-1"
              >
                {saving ? (
                  <div className="loading-spinner" />
                ) : (
                  'Değişiklikleri Kaydet'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/admin/users')}
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