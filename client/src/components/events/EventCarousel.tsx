import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { RiCalendarLine, RiMapPinLine, RiArrowRightSLine, RiFlashlightLine, RiInformationLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

interface EventCarouselProps {
    events: any[];
}

export function EventCarousel({ events }: EventCarouselProps) {
    const navigate = useNavigate();
    if (!events || events.length === 0) return null;

    if (events.length === 1) {
        const event = events[0];
        const eventDate = new Date(event.date);

        return (
            <div className="max-w-5xl mx-auto px-4">
                <div
                    className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm group cursor-pointer"
                    onClick={() => navigate(`/events/${event._id || event.id}`)}
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Flyer Left */}
                        <div className="md:w-1/2 aspect-[2/1] md:aspect-auto overflow-hidden">
                            <img
                                src={event.image || "/events/default.jpg"}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                            />
                        </div>

                        {/* Content Right */}
                        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center space-y-5">
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full w-fit">
                                <RiFlashlightLine className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Featured Session</span>
                            </div>

                            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                                {event.title}
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                                    <RiCalendarLine className="w-4 h-4 text-blue-500" />
                                    <span>{eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                                    <RiMapPinLine className="w-4 h-4 text-blue-500" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                                {event.description}
                            </p>

                            <div className="pt-4 fle">
                                <button className="flex items-center gap-2 text-blue-600 font-bold text-sm tracking-tight group/btn">
                                    View Full Event Intel
                                    <RiArrowRightSLine className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 home-event-swiper">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                className="rounded-2xl overflow-hidden shadow-sm"
            >
                {events.map((event) => {
                    const eventDate = new Date(event.date);
                    return (
                        <SwiperSlide key={event._id || event.id}>
                            <div
                                className="relative bg-white group cursor-pointer flex flex-col md:flex-row h-auto md:h-[450px]"
                                onClick={() => navigate(`/events/${event._id || event.id}`)}
                            >
                                <div className="md:w-2/3 h-[250px] md:h-full overflow-hidden">
                                    <img
                                        src={event.image || "/events/default.jpg"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                                        alt={event.title}
                                    />
                                </div>

                                <div className="md:w-1/3 p-8 md:p-12 flex flex-col justify-center space-y-6">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 rounded-full w-fit">
                                        <RiInformationLine className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{event.type || 'Meetup'}</span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                                        {event.title}
                                    </h2>

                                    <div className="space-y-3 font-bold text-xs text-slate-500">
                                        <div className="flex items-center gap-3">
                                            <RiCalendarLine className="w-4 h-4 text-blue-500" />
                                            <span>{eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <RiMapPinLine className="w-4 h-4 text-blue-500" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button className="flex items-center gap-2 text-blue-600 font-bold text-sm group/btn">
                                            Details
                                            <RiArrowRightSLine className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <style>{`
        .home-event-swiper .swiper-pagination-bullet { background: #94a3b8; opacity: 0.3; }
        .home-event-swiper .swiper-pagination-bullet-active { background: #3b82f6; opacity: 1; }
        .home-event-swiper .swiper-button-next, .home-event-swiper .swiper-button-prev { color: #1e293b; background: white; width: 40px; height: 40px; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .home-event-swiper .swiper-button-next:after, .home-event-swiper .swiper-button-prev:after { font-size: 16px; font-weight: bold; }
      `}</style>
        </div>
    );
}
