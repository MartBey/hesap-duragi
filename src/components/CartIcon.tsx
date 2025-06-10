'use client';

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartIcon() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Link href="/cart" className="relative p-2 text-gray-300 hover:text-orange-500 transition-colors">
      <ShoppingCartIcon className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
} 