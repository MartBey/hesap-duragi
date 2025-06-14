"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
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
    <div 
      className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative flex items-center justify-center px-4 py-2 overflow-hidden"
      style={{
        backgroundImage: 'url("/public/arka%20plan%202.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo ve açıklama */}
        <div className="text-center mb-6">
          <a href="/" className="inline-flex items-center justify-center">
            <img src="/images/logo.png" alt="HesapDurağı" className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-200" />
          </a>
          <p className="text-gray-400 mt-2 text-sm">Şifre sıfırlama bağlantısı almak için e-posta adresinizi girin.</p>
        </div>
        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Şifremi Unuttum</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-posta adresiniz</label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="ornek@mail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 