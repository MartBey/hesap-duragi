'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Hoş Geldiniz</h2>
          <p className="text-text-muted">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-danger/10 text-danger p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
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
                placeholder="ornek@mail.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <div className="loading-spinner" />
              ) : (
                'Giriş Yap'
              )}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-text-muted">Hesabınız yok mu?</span>{' '}
            <Link href="/auth/register" className="text-primary hover:text-accent">
              Hemen Kayıt Olun
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 