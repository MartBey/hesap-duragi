'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface Account {
  _id: string;
  title: string;
  game: string;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  seller: {
    _id: string;
    name: string;
  };
  buyer?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function AdminAccountsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (session?.user.role !== 'admin') {
      router.push('/dashboard');
    } else {
      fetchAccounts();
    }
  }, [status, session, page, search]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (search) params.append('search', search);

      const response = await fetch(`/api/accounts?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      setAccounts(data.accounts);
      setPagination(data.pagination);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm('Bu hesabı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      fetchAccounts();
    } catch (error: any) {
      setError(error.message);
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

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-dark p-8">
      <div className="container-width">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Hesap Yönetimi</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Hesap ara..."
              className="input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <button
              onClick={() => router.push('/dashboard/admin/accounts/new')}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Yeni Hesap
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-danger/10 text-danger p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-4">Başlık</th>
                <th className="text-left p-4">Oyun</th>
                <th className="text-left p-4">Fiyat</th>
                <th className="text-left p-4">Durum</th>
                <th className="text-left p-4">Satıcı</th>
                <th className="text-left p-4">Alıcı</th>
                <th className="text-left p-4">Tarih</th>
                <th className="text-right p-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account._id} className="border-t border-primary">
                  <td className="p-4">{account.title}</td>
                  <td className="p-4">{account.game}</td>
                  <td className="p-4">
                    {account.price.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="p-4">
                    <span
                      className={`badge ${
                        account.status === 'available'
                          ? 'badge-success'
                          : account.status === 'sold'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {account.status === 'available'
                        ? 'Satışta'
                        : account.status === 'sold'
                        ? 'Satıldı'
                        : 'Rezerve'}
                    </span>
                  </td>
                  <td className="p-4">{account.seller.name}</td>
                  <td className="p-4">
                    {account.buyer ? account.buyer.name : '-'}
                  </td>
                  <td className="p-4">
                    {new Date(account.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/admin/accounts/${account._id}/edit`)
                      }
                      className="btn btn-icon btn-secondary mr-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(account._id)}
                      className="btn btn-icon btn-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`btn ${
                    pageNum === pagination.currentPage
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
} 