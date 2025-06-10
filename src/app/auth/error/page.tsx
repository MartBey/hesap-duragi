'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'Bir hata oluştu';
  if (error === 'CredentialsSignin') {
    errorMessage = 'Email adresi veya şifre hatalı';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4">Oops!</h2>
        <div className="bg-danger/10 text-danger p-4 rounded-lg mb-6">
          {errorMessage}
        </div>
        <Link href="/auth/login" className="btn btn-primary">
          Tekrar Deneyin
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ErrorContent />
    </Suspense>
  );
} 