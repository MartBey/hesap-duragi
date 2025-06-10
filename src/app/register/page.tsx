'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false
  });

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password)
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Ad alanı zorunludur');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Soyad alanı zorunludur');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Kullanıcı adı zorunludur');
      return false;
    }
    if (formData.username.length < 3 || formData.username.length > 20) {
      setError('Kullanıcı adı 3-20 karakter olmalıdır');
      return false;
    }
    if (!formData.email.trim()) {
      setError('E-posta adresi zorunludur');
      return false;
    }
    if (!formData.password) {
      setError('Şifre zorunludur');
      return false;
    }
    if (!passwordRequirements.minLength || !passwordRequirements.hasUppercase || !passwordRequirements.hasNumber) {
      setError('Şifre gereksinimlerini karşılamıyor');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kayıt işlemi başarısız');
      }

      setSuccess('Hesabınız başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...');
      
      // 2 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative flex items-center justify-center px-4 py-2 overflow-hidden"
      style={{
        backgroundImage: 'url("/public/arka plan 2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-3">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="HesapDurağı"
              width={1000}
              height={1000}
              className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-200"
              priority
            />
          </Link>
          <p className="text-gray-400 mt-1 text-sm">Yeni hesap oluşturun</p>
        </div>

        {/* Register Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-2xl">
          {/* Success Message */}
          {success && (
            <div className="mb-3 bg-green-900/20 border border-green-500/30 rounded-lg p-2.5">
              <p className="text-xs text-green-400 flex items-center">
                <svg className="h-3 w-3 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-3 bg-red-900/20 border border-red-500/30 rounded-lg p-2.5">
              <p className="text-xs text-red-400 flex items-center">
                <svg className="h-3 w-3 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-0.5">
                  Ad
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Adınız"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-0.5">
                  Soyad
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Soyadınız"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-0.5">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="kullanici_adi"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-0.5">
                  3-20 karakter
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-0.5">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-0.5">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-1.5 pr-10 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200 focus:outline-none"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-3 w-3" />
                    ) : (
                      <EyeIcon className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-0.5">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-1.5 pr-10 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200 focus:outline-none"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-3 w-3" />
                    ) : (
                      <EyeIcon className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-800/50 rounded-lg p-2">
              <h4 className="text-xs font-medium text-gray-300 mb-1.5">Şifre Gereksinimleri</h4>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="flex items-center text-xs">
                  <CheckCircleIcon className={`h-3 w-3 mr-1 flex-shrink-0 ${passwordRequirements.minLength ? 'text-green-500' : 'text-gray-500'}`} />
                  <span className={passwordRequirements.minLength ? 'text-green-500' : 'text-gray-500'}>
                    8+ karakter
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircleIcon className={`h-3 w-3 mr-1 flex-shrink-0 ${passwordRequirements.hasUppercase ? 'text-green-500' : 'text-gray-500'}`} />
                  <span className={passwordRequirements.hasUppercase ? 'text-green-500' : 'text-gray-500'}>
                    Büyük harf
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircleIcon className={`h-3 w-3 mr-1 flex-shrink-0 ${passwordRequirements.hasNumber ? 'text-green-500' : 'text-gray-500'}`} />
                  <span className={passwordRequirements.hasNumber ? 'text-green-500' : 'text-gray-500'}>
                    Rakam
                  </span>
                </div>
              </div>
            </div>

            {/* Password Match Warning */}
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-1.5">
                <p className="text-xs text-red-400 flex items-center">
                  <svg className="h-3 w-3 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Şifreler eşleşmiyor
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-start space-x-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-3.5 w-3.5 text-orange-500 focus:ring-orange-500 border-gray-600 rounded bg-gray-800 mt-0.5 flex-shrink-0"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="block text-xs text-gray-300 leading-tight">
                  <Link href="/terms" className="text-orange-500 hover:text-orange-400">
                    Kullanım Şartları
                  </Link>{' '}
                  ve{' '}
                  <Link href="/privacy" className="text-orange-500 hover:text-orange-400">
                    Gizlilik Politikası
                  </Link>
                  &apos;nı okudum ve kabul ediyorum.
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  id="newsletter"
                  name="newsletter"
                  type="checkbox"
                  className="h-3.5 w-3.5 text-orange-500 focus:ring-orange-500 border-gray-600 rounded bg-gray-800 mt-0.5 flex-shrink-0"
                  disabled={isLoading}
                />
                <label htmlFor="newsletter" className="block text-xs text-gray-300 leading-tight">
                  Yeni ürünler ve kampanyalar hakkında e-posta almak istiyorum.
                </label>
              </div>
            </div>

            <div className="pt-0.5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Hesap Oluşturuluyor...
                  </div>
                ) : (
                  'Hesap Oluştur'
                )}
              </button>
            </div>
          </form>

          <div className="mt-2.5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gray-800/50 text-gray-400">veya</span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button 
                className="w-full inline-flex justify-center items-center py-1.5 px-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700/50 text-xs font-medium text-gray-300 hover:bg-gray-600/50 transition-all duration-200"
                disabled={isLoading}
              >
                <svg className="h-3 w-3 mr-1.5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              <button 
                className="w-full inline-flex justify-center items-center py-1.5 px-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700/50 text-xs font-medium text-gray-300 hover:bg-gray-600/50 transition-all duration-200"
                disabled={isLoading}
              >
                <svg className="h-3 w-3 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                Twitter
              </button>
            </div>
          </div>

          <div className="mt-2.5 text-center">
            <p className="text-gray-400 text-xs">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 leading-tight">
            Hesap oluşturarak güvenli ve doğrulanmış bir oyun hesabı alışveriş deneyimi yaşayacaksınız.
          </p>
        </div>
      </div>
    </div>
  );
} 