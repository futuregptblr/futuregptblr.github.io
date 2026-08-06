import { useEffect, useMemo, useState } from "react";
import { RiSearchLine, RiCalendarEventLine, RiHistoryLine, RiMapPinLine, RiInformationLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { apiListEvents } from "../../lib/api";

export function SpecialEvents() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [upcoming, past] = await Promise.all([
          apiListEvents("upcoming"),
          apiListEvents("past"),
        ]);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (e: any) {
        console.error("Failed to load events", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredUpcoming = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return upcomingEvents;
    return upcomingEvents.filter((e) => {
      const hay = [e.title, e.description, e.location, e.chapter, e.type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [search, upcomingEvents]);

  const filteredPast = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pastEvents;
    return pastEvents.filter((e) => {
      const hay = [e.title, e.description, e.location, e.chapter, e.type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [search, pastEvents]);

  return (
    <div className="max-w-7xl mx-auto space-y-10 px-4">
      {/* Events Header - Scaled Down */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-yellow-400 to-blue-600  shadow-xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/5 to-transparent pointer-events-none" />
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Upcoming Events
            </h1>
            <p className="text-slate-700 text-sm font-medium leading-relaxed">
              Explore experiences, workshops, and exclusive member sessions.
            </p>
          </div>
          <div className="hidden md:block">
            <RiCalendarEventLine className="w-16 h-16 text-slate-800" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs - More compact */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex grow max-w-2xl">
          {[
            { id: "upcoming", label: "Upcoming", icon: RiCalendarEventLine },
            { id: "past", label: "Past Highlights", icon: RiHistoryLine },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "upcoming" | "past")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all ${activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="relative group grow max-w-md">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Find an event..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="pb-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="bg-slate-100 h-64 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <>
            {activeTab === "upcoming" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredUpcoming.length > 0 ? (
                  filteredUpcoming.map((event) => (
                    <EventFineCard key={event._id || event.id} event={event} onClick={() => navigate(`/events/${event._id}`)} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <RiInformationLine className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900">No events found</h3>
                  </div>
                )}
              </div>
            )}

            {activeTab === "past" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPast.length > 0 ? (
                  filteredPast.map((event) => (
                    <EventFineCard key={event._id || event.id} event={event} isPast onClick={() => navigate(`/events/${event._id}`)} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <RiInformationLine className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900">No events found</h3>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div >
  );
}

function EventFineCard({ event, onClick, isPast = false }: { event: any, onClick: () => void, isPast?: boolean }) {
  return (
    <div
      className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="aspect-[2/1] overflow-hidden bg-slate-50 relative">
        <img
          src={event.image || "/events/default.jpg"}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPast ? 'grayscale-[0.4]' : ''}`}
        />
      </div>

      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{event.title}</h3>
          <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">{event.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <RiCalendarEventLine className="w-4 h-4 text-slate-400" />
            <div className="text-[10px] font-bold text-slate-600">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <RiMapPinLine className="w-4 h-4 text-slate-400" />
            <div className="text-[10px] font-bold text-slate-600 truncate">{event.location}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
