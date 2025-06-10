'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { gameAvatars, getAllCategories, getAvatarsByCategory, Avatar } from '@/data/avatars';
import Image from 'next/image';

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: Avatar) => void;
  currentAvatar?: string;
}

export default function AvatarSelector({ isOpen, onClose, onSelect, currentAvatar }: AvatarSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Valorant');
  const categories = getAllCategories();

  if (!isOpen) return null;

  const handleAvatarSelect = (avatar: Avatar) => {
    onSelect(avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Avatar Seç</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-700 bg-gray-900/50">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-4 whitespace-nowrap font-medium transition-colors ${
                selectedCategory === category
                  ? 'text-orange-400 border-b-2 border-orange-400 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Avatar Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {getAvatarsByCategory(selectedCategory).map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => handleAvatarSelect(avatar)}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  currentAvatar === avatar.imageUrl
                    ? 'ring-2 ring-orange-400 shadow-lg shadow-orange-400/25'
                    : 'hover:ring-2 hover:ring-gray-400'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  {avatar.imageUrl.startsWith('data:image/svg+xml') ? (
                    <img
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Image
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  )}
                </div>
                
                {/* Avatar Name Tooltip */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1 text-center opacity-0 hover:opacity-100 transition-opacity">
                  {avatar.name}
                </div>
                
                {/* Selected Indicator */}
                {currentAvatar === avatar.imageUrl && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {getAvatarsByCategory(selectedCategory).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">Bu kategoride henüz avatar bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-900/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Toplam {gameAvatars.length} avatar mevcut
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 