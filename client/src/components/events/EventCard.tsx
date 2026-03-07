import { RiCalendarEventLine, RiMapPinLine, RiArrowRightLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

export function EventCard({ event, isPast = false }: EventCardProps) {
  const navigate = useNavigate();
  const eventDate = new Date(event.date);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col cursor-pointer"
      onClick={() => navigate(`/events/${(event as any)._id || event.id}`)}
    >
      {/* Cinematic Image Container */}
      <div className="aspect-[2/1] relative overflow-hidden bg-slate-50">
        <img
          src={event.image || "/events/default.jpg"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {event.chapter || 'Global'}
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">
            {event.title}
          </h3>

          <p className="text-slate-500 text-[11px] font-medium leading-relaxed line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center text-slate-500 text-[10px] font-bold">
              <RiCalendarEventLine className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
              {eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
            <div className="flex items-center text-slate-500 text-[10px] font-bold overflow-hidden">
              <RiMapPinLine className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px] tracking-tight group/btn">
            {isPast ? 'Highlights' : 'View Space'}
            <RiArrowRightLine className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}