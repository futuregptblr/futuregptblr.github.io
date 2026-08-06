import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../ui/carousel';
import { cn } from '../../lib/utils';

type FeaturedSliderCta = {
  label: string;
  href: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
};

export type FeaturedSlide = {
  image: string;
  imageAlt?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  venue?: string;
  primaryCta?: FeaturedSliderCta;
  secondaryCta?: FeaturedSliderCta;
  meta?: string[];
  tags?: string[];
  footer?: ReactNode;
};

type FeaturedSliderProps = {
  title: string;
  subtitle?: string;
  slides: FeaturedSlide[];
  className?: string;
};

export function FeaturedSlider({
  title,
  subtitle,
  slides,
  className,
}: FeaturedSliderProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const autoplay = useMemo(
    () => Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true }),
    [],
  );

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => setSelectedIndex(api.selectedScrollSnap());
    handleSelect();
    api.on('select', handleSelect);
    api.on('reInit', handleSelect);

    return () => {
      api.off('select', handleSelect);
      api.off('reInit', handleSelect);
    };
  }, [api]);

  if (!slides.length) return null;

  const scrollPrev = () => api?.scrollPrev();
  const scrollNext = () => api?.scrollNext();
  const scrollTo = (index: number) => api?.scrollTo(index);

  return (
    <section className={cn('relative py-16 overflow-hidden', className)}>
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"
        aria-hidden="true"
      />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-sm font-semibold tracking-wide uppercase">
              {title}
            </span>
          </div>
          {subtitle && (
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => autoplay.stop()}
          onMouseLeave={() => autoplay.play()}
        >
          <Carousel
            setApi={setApi}
            plugins={[autoplay]}
            opts={{ loop: true, align: 'start' }}
            aria-label={title}
            className="w-full"
          >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={`${slide.title}-${index}`}>
                  <motion.article
                    initial={{ opacity: 0, x: 36 }}
                    animate={{
                      opacity: selectedIndex === index ? 1 : 0.45,
                      x: selectedIndex === index ? 0 : 18,
                    }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
                  >
                    <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 aspect-[2660/1772] bg-white/5 flex items-center justify-center">
                      <img
                        src={slide.image}
                        alt={slide.imageAlt || slide.title}
                        className="w-full h-full object-contain object-center"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </div>

                    <div className="p-6 sm:p-10">
                      {(slide.date || slide.location || slide.venue || slide.time) && (
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-slate-300 mb-8">
                          {slide.date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
                              <span className="font-semibold text-white">{slide.date}</span>
                            </div>
                          )}
                          {slide.date && (slide.location || slide.venue) && (
                            <span className="hidden sm:block text-slate-600">|</span>
                          )}
                          {(slide.location || slide.venue) && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                              <span>{slide.venue || slide.location}</span>
                            </div>
                          )}
                          {(slide.date || slide.location || slide.venue) && slide.time && (
                            <span className="hidden sm:block text-slate-600">|</span>
                          )}
                          {slide.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
                              <span>{slide.time}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-center mb-6">
                        {slide.badge && (
                          <div className="flex justify-center mb-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-bold tracking-widest uppercase">
                              {slide.badge}
                            </span>
                          </div>
                        )}
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
                          {slide.title}
                        </h2>
                        {slide.subtitle && (
                          <p className="text-xl font-bold text-white tracking-wide mb-4">
                            {slide.subtitle}
                          </p>
                        )}
                        {slide.description && (
                          <p className="text-slate-300 text-sm sm:text-base max-w-4xl mx-auto leading-relaxed">
                            {slide.description}
                          </p>
                        )}
                      </div>

                      {(slide.primaryCta || slide.secondaryCta) && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 mt-8">
                          {[slide.primaryCta, slide.secondaryCta].filter(Boolean).map((cta) => (
                            <a
                              key={cta!.label}
                              href={cta!.href}
                              className={cn(
                                'inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all active:scale-95',
                                cta!.variant === 'secondary'
                                  ? 'border border-orange-500/60 text-orange-300 hover:bg-orange-500/10 hover:border-orange-400'
                                  : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:from-orange-400 hover:to-pink-400 hover:shadow-orange-500/30 hover:shadow-xl',
                              )}
                            >
                              {cta!.icon}
                              {cta!.label}
                            </a>
                          ))}
                        </div>
                      )}

                      {slide.footer}

                      {slide.tags && slide.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                          {slide.tags.map((tag) => (
                            <span key={tag} className="text-xs text-slate-500 bg-white/5 rounded-full px-3 py-1">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <button
            type="button"
            onClick={scrollPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
            aria-label="Previous featured slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
            aria-label="Next featured slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Featured slides">
          {slides.map((slide, index) => (
            <button
              key={`${slide.title}-dot`}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                'h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-300',
                selectedIndex === index ? 'w-8 bg-orange-400' : 'w-2.5 bg-white/30 hover:bg-white/50',
              )}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              aria-selected={selectedIndex === index}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
