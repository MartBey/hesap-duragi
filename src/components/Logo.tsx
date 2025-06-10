import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <Link href="/" className="flex items-center space-x-2">
      <img 
        src="/images/logo.png" 
        alt="HesapDurağı Logo" 
        className={`w-auto transition-all duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`}
      />
    </Link>
  );
};

export default Logo; 