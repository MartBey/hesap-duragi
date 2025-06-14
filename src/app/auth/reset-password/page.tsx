"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Geçersiz veya eksik bağlantı.");
      return;
    }
    if (!password || password.length < 8) {
      toast.error("Şifre en az 8 karakter olmalı.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.error || "Bir hata oluştu");
      }
    } catch (err) {
      toast.error("Sunucu hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Yeni Şifre Belirle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Yeni Şifre</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Yeni şifreniz"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Yeni şifrenizi tekrar yazın"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
} 