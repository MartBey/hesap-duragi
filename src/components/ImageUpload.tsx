'use client';

import { useState, useRef } from 'react';
import { XMarkIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`En fazla ${maxImages} fotoğraf yükleyebilirsiniz.`);
      return;
    }

    setUploading(true);

    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Dosya boyutu kontrolü (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} dosyası çok büyük. Maksimum 5MB olmalıdır.`);
          continue;
        }

        // Dosya türü kontrolü
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} geçerli bir resim dosyası değil.`);
          continue;
        }

        // Base64'e çevir (gerçek projede cloud storage kullanılmalı)
        const base64 = await convertToBase64(file);
        newImages.push(base64);
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      alert('Fotoğraf yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          Fotoğraflar ({images.length}/{maxImages})
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
        >
          <PhotoIcon className="h-4 w-4" />
          {uploading ? 'Yükleniyor...' : 'Fotoğraf Ekle'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Fotoğraf Önizlemeleri */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                <img
                  src={image}
                  alt={`Fotoğraf ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay Butonları */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    title="Sola taşı"
                  >
                    ←
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  title="Sil"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
                
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    title="Sağa taşı"
                  >
                    →
                  </button>
                )}
              </div>

              {/* Ana Fotoğraf İşareti */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  Ana
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Boş Durum */}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <PhotoIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Henüz fotoğraf eklenmedi</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Yükleniyor...' : 'İlk Fotoğrafı Ekle'}
          </button>
        </div>
      )}

      {/* Yardım Metni */}
      <div className="text-xs text-gray-500">
        <p>• Maksimum {maxImages} fotoğraf yükleyebilirsiniz</p>
        <p>• Desteklenen formatlar: JPG, PNG, GIF</p>
        <p>• Maksimum dosya boyutu: 5MB</p>
        <p>• İlk fotoğraf ana fotoğraf olarak kullanılır</p>
      </div>
    </div>
  );
} 