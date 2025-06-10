import Link from 'next/link';

interface EmptyCartProps {
  title?: string;
  description?: string;
  showCategories?: boolean;
  imageSize?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function EmptyCart({ 
  title = "Maalesef sepetiniz boş",
  description = "Henüz sepetinize ürün eklemediniz. En iyi oyun hesaplarını keşfetmek için alışverişe başlayın!",
  showCategories = true,
  imageSize = 'large',
  className = ""
}: EmptyCartProps) {
  
  const getImageSize = () => {
    switch (imageSize) {
      case 'small': return 'w-[448px] h-[448px]';
      case 'medium': return 'w-[560px] h-[560px]';
      case 'large': return 'w-[672px] h-[672px]';
      default: return 'w-[672px] h-[672px]';
    }
  };

  return (
    <div className={`text-center py-20 ${className}`}>
      {/* Custom Empty Cart Image */}
      <div className="mb-8">
        <img 
          src="/images/emptyCartPage.png" 
          alt="Boş Sepet" 
          className={`${getImageSize()} mx-auto opacity-80`}
        />
      </div>
      
      {/* Content Below Image */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-base"
          >
            🛒 Alışverişe Başla
          </Link>
          <Link
            href="/categories"
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-orange-500 hover:text-white transition-colors font-semibold text-base"
          >
            🎮 Kategorileri Gör
          </Link>
        </div>
      </div>
      
      {/* Popular Categories */}
      {showCategories && (
        <div className="mt-12">
          <h4 className="text-xl font-semibold text-white mb-6">Popüler Kategoriler</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link href="/products?game=Valorant" className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-white font-medium">Valorant</div>
            </Link>
            <Link href="/products?game=CS2" className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="text-2xl mb-2">🔫</div>
              <div className="text-white font-medium">CS2</div>
            </Link>
            <Link href="/products?game=League of Legends" className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="text-2xl mb-2">⚔️</div>
              <div className="text-white font-medium">LoL</div>
            </Link>
            <Link href="/products?game=Fortnite" className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="text-2xl mb-2">🏗️</div>
              <div className="text-white font-medium">Fortnite</div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 