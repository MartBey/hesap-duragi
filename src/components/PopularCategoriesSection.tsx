'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PopularCategory {
  _id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  isActive: boolean;
  order: number;
}

export default function PopularCategoriesSection() {
  const [categories, setCategories] = useState<PopularCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularCategories();
  }, []);

  const fetchPopularCategories = async () => {
    try {
      const response = await fetch('/api/admin/popular-categories');
      const data = await response.json();
      
      if (data.success && data.data) {
        setCategories(data.data.filter((cat: PopularCategory) => cat.isActive).sort((a: PopularCategory, b: PopularCategory) => a.order - b.order));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching popular categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Kategoriler yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" style={{backgroundColor: 'rgba(255, 102, 0, 0.11)'}}>
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          Popüler Kategoriler
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={category.buttonLink}
              className="group relative overflow-hidden rounded-2xl h-64 md:h-80 transition-transform hover:scale-105"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${category.backgroundImage})`,
                }}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} opacity-80`} />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-8">
                <div>
                  <h4 className={`text-2xl md:text-3xl font-bold ${category.textColor} mb-4 leading-tight`}>
                    {category.title}
                  </h4>
                  <p className={`${category.textColor} opacity-90 text-lg`}>
                    {category.description}
                  </p>
                </div>
                
                <div className="flex justify-start">
                  <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg transition-colors transform group-hover:scale-105">
                    {category.buttonText}
                  </button>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 