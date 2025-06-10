'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

const emojiCategories = {
  'Teknoloji': [
    '📱', '💻', '🖥️', '⌨️', '🖱️', '🖨️', '📷', '📹', '📺', '📻',
    '☎️', '📞', '📟', '📠', '🔌', '🔋', '💾', '💿', '📀', '💽',
    '🎮', '🕹️', '📡', '🛰️', '🔭', '🔬', '💡', '🔦', '🏮', '🪔'
  ],
  'Sosyal Medya': [
    '📷', '📸', '📹', '🎥', '📺', '📻', '🎵', '🎶', '🎤', '🎧',
    '📢', '📣', '📯', '🔔', '🔕', '📬', '📭', '📮', '🗳️', '✉️',
    '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭'
  ],
  'Oyunlar': [
    '🎮', '🕹️', '🎯', '🎲', '🃏', '🀄', '🎰', '🎳', '🏀', '⚽',
    '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓',
    '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹'
  ],
  'İş & Finans': [
    '💰', '💳', '💎', '⚖️', '🏦', '🏢', '🏪', '🏬', '🏭', '🏗️',
    '📊', '📈', '📉', '💹', '💱', '💲', '🧾', '💴', '💵', '💶',
    '💷', '💸', '🪙', '💰', '🎯', '📋', '📌', '📍', '📎', '🖇️'
  ],
  'Eğitim': [
    '📚', '📖', '📝', '✏️', '✒️', '🖊️', '🖋️', '🖌️', '🖍️', '📏',
    '📐', '📌', '📍', '📎', '🖇️', '📋', '📄', '📃', '📑', '📊',
    '📈', '📉', '🗂️', '📂', '📁', '📰', '🗞️', '📓', '📔', '📒'
  ],
  'Güvenlik': [
    '🔒', '🔓', '🔐', '🔑', '🗝️', '🔨', '⚒️', '🛠️', '⚙️', '🔧',
    '🔩', '⚖️', '🛡️', '⚔️', '🗡️', '🏹', '🛠️', '🔫', '💣', '🧨',
    '🔥', '💥', '⚡', '🌟', '💫', '⭐', '🌠', '☄️', '🔆', '💡'
  ],
  'Eğlence': [
    '🎭', '🎨', '🎪', '🎨', '🖼️', '🎬', '🎞️', '📽️', '🎥', '📹',
    '🎤', '🎧', '🎵', '🎶', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸',
    '🪕', '🎻', '🎲', '🎯', '🎳', '🎮', '🕹️', '🎰', '🎪', '🎠'
  ],
  'Yemek & İçecek': [
    '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒',
    '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬',
    '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠'
  ]
};

export default function EmojiPicker({ isOpen, onClose, onSelect, selectedEmoji }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState('Teknoloji');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Emoji Seç</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Kategori Sekmeler */}
        <div className="flex flex-wrap gap-2 mb-4 max-h-20 overflow-y-auto">
          {Object.keys(emojiCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                activeCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="grid grid-cols-8 gap-2 max-h-60 overflow-y-auto">
          {emojiCategories[activeCategory as keyof typeof emojiCategories].map((emoji, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className={`p-2 rounded-lg text-2xl hover:bg-gray-700 transition-colors ${
                selectedEmoji === emoji ? 'bg-orange-500/20 ring-2 ring-orange-500' : ''
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Seçili Emoji */}
        {selectedEmoji && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedEmoji}</span>
              <span className="text-white">Seçili Emoji</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 