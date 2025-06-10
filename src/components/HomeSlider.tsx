import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: "Valorant Hesapları",
    description: "Yüksek ranklı, nadir skinli hesaplar",
    image: "/images/valorant-banner.jpg",
    link: "/products?game=valorant"
  },
  {
    id: 2,
    title: "CS:GO Prime Hesapları",
    description: "Düşük saatli, temiz geçmişli hesaplar",
    image: "/images/csgo-banner.jpg",
    link: "/products?game=csgo"
  },
  {
    id: 3,
    title: "League of Legends Hesapları",
    description: "Tüm şampiyonlar açık, özel skinli hesaplar",
    image: "/images/lol-banner.jpg",
    link: "/products?game=lol"
  }
];

export default function HomeSlider() {
  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="h-[500px] w-full"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative h-full w-full">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>
            <div className="relative z-10 flex h-full items-center justify-center text-center">
              <div className="max-w-2xl px-4">
                <h2 className="text-4xl font-bold text-white mb-4">{slide.title}</h2>
                <p className="text-xl text-gray-200 mb-8">{slide.description}</p>
                <Link 
                  href={slide.link}
                  className="btn btn-primary"
                >
                  Hesapları İncele
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
} 