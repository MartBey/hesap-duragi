'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { CartTrackingSystem } from '@/components/CartTracking';

export default function CartTrackingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <ShoppingCartIcon className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-white">Sepet Takibi</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-8">
        <CartTrackingSystem />
      </div>
    </div>
  );
} 