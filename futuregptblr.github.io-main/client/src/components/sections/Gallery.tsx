import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const pictures = [
  { name: 'Microsoft', logo: '/gallery/1.HEIC' },
  { name: 'Google', logo: '/gallery/2.HEIC' },
  { name: 'Amazon', logo: '/gallery/3.HEIC' },
  { name: 'Meta', logo: '/gallery/4.jpg' },
  { name: 'IBM', logo: '/gallery/5.jpg' },  
];

export function Gallery() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Gallery
        </h2>
        <Swiper
          modules={[Autoplay]}
        //   spaceBetween={50}
          //slidesPerView={2}
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
          {pictures.map((picture, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-24  hover:grayscale-0 transition-all">
                <img
                  src={picture.logo}
                  alt={picture.name}
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