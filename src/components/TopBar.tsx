'use client';

import { useEffect, useState } from 'react';
import styles from './TopBar.module.css';

const DEFAULT_ANNOUNCEMENTS = [
  "🔥 Yeni Valorant hesapları stoklarda!",
  "💫 CS:GO Prime hesaplarında %20 indirim!",
  "🎮 League of Legends Elmas hesapları geldi!",
  "🌟 7/24 Canlı Destek hizmetimiz aktif!",
];

export default function TopBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcements, setAnnouncements] = useState<string[]>(DEFAULT_ANNOUNCEMENTS);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        setAnnouncements(data.data);
        setCurrentIndex(0); // Reset index when announcements change
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Keep default announcements on error
    }
  };

  if (announcements.length === 0) {
    return null; // Don't render if no announcements
  }

  return (
    <div className={`${styles.promoSlider} sticky top-0 z-50`}>
      {announcements.map((announcement, index) => (
        <div
          key={index}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
        >
          <p>{announcement}</p>
        </div>
      ))}
    </div>
  );
} 