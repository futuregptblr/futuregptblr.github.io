"use client";

import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../components/ui/carousel';
import { useInView } from 'react-intersection-observer';
import Autoplay from 'embla-carousel-autoplay';


const galleryImages = [
  {
    src: "/gallery/1.jpeg",
    title: "Mountain Adventure",
    // category: "Travel"
  },
  {
    src: "/gallery/2.jpeg",
    title: "Sunset Photography",
    // category: "Photography"
  },
  {
    src: "/gallery/3.jpeg",
    title: "Art Exhibition",
    // category: "Art"
  },
  {
    src: "/gallery/4.jpeg",
    title: "Nature Exploration",
    // category: "Travel"
  },
  {
    src: "/gallery/7.jpeg",
    title: "Nature Exploration",
    // category: "Travel"
  },
  {
    src: "/gallery/8.jpeg",
    title: '',
  },
  {
    src: "/gallery/9.avif",
    title: "Nature Exploration",
    // category: "Travel"
  },
];

export function GallerySection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const plugin = Autoplay({ delay: 3000, stopOnInteraction: true });

  return (
    <section id="gallery" className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Gallery
        </motion.h2>

        <div ref={ref} className="relative">
          <Carousel
            plugins={[plugin]}
            className="w-full max-w-5xl mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative h-64 md:h-72 lg:h-80">
                        <img
                          src={image.src}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}