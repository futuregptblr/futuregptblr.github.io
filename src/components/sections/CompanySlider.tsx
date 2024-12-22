import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const companies = [
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
  { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
  { name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg' },
  { name: 'Nokia', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg'},
  { name: 'Deloitte', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg'},
  { name: 'PwC', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Logo-pwc.png'},
  { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg'},
  { name: 'Rakuten', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Rakuten_logo_2.svg'},
  { name: 'Zepto', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7d/Logo_of_Zepto.png'},
  { name: 'HDFC Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg'},
  { name: 'ISRO', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Indian_Space_Research_Organisation_Logo.svg'},
  { name: 'Jio', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Reliance_Jio_Logo.svg'},
];

export function CompanySlider() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Community Members Work At
        </h2>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={50}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {companies.map((company, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-24 grayscale hover:grayscale-0 transition-all">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-12 object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}