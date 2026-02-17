import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Calendar, MapPin, Clock, Search } from "lucide-react";

export function SpecialEvents() {
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "past" | "registered"
  >("upcoming");
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myRegs, setMyRegs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [upcoming, past] = await Promise.all([
          (await import("../../lib/api")).apiListEvents("upcoming"),
          (await import("../../lib/api")).apiListEvents("past"),
        ]);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
        const token = localStorage.getItem("token");
        if (token) {
          const { apiListMyEventRegistrations } = await import("../../lib/api");
          const regs = await apiListMyEventRegistrations(token);
          setMyRegs(regs || []);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const registeredEvents = useMemo(() => {
    const map: Record<string, any> = {};
    [...upcomingEvents, ...pastEvents].forEach((e) => {
      map[e._id] = e;
    });
    return myRegs
      .map((r: any) => map[r.eventId?._id || r.eventId])
      .filter(Boolean);
  }, [myRegs, upcomingEvents, pastEvents]);

  const registeredEventStatusMap = useMemo(() => {
    const map = new Map<string, string>();
    myRegs.forEach((r: any) => map.set(String(r.eventId?._id || r.eventId), r.status));
    return map;
  }, [myRegs]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Events & Workshops</h1>
        <p className="text-white/90">
          Access exclusive events, workshops, and networking opportunities for
          premium members.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              {
                id: "upcoming",
                label: "Upcoming Events",
                count: upcomingEvents.length,
              },
              {
                id: "registered",
                label: "My Events",
                count: registeredEvents.length,
              },
              { id: "past", label: "Past Events", count: pastEvents.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? "border-yellow-400 text-yellow-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "upcoming" && (
            <div className="space-y-6">
              {error && <div className="text-red-600">{error}</div>}
              {loading && <div>Loading events...</div>}
              {/* Search and Filters */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Event Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredUpcoming.length > 0 ? (
                  <>
                    {filteredUpcoming.map((event) => (
                      <div
                        key={event._id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="text-3xl w-full">
                              {event.image && event.image.startsWith("http") ? (
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-full h-40 object-cover rounded"
                                />
                              ) : null}
                            </div>
                            <div className="flex items-center space-x-2"></div>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          {event.isPremium && (
                            <span className="inline-block mb-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                              Premium
                            </span>
                          )}
                          {event.description && (
                            <p className="text-gray-600 text-sm mb-4">
                              {event.description}
                            </p>
                          )}

                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {[event.startTime, event.endTime]
                                  .filter(Boolean)
                                  .join(" - ") || "—"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              {/* <span className="text-sm font-medium text-gray-900">{event.price}</span> */}
                              {/* <span className="text-sm text-gray-500">•</span> */}
                              <span className="text-sm text-gray-500">
                                {event.type}
                              </span>
                            </div>
                            {/* <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>{event.registered}/{event.capacity}</span>
                        </div> */}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {(event.tags || []).map((tag: string) => (
                              <span
                                key={tag}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {event.speakers?.length ? (
                                <>
                                  <span className="font-medium">Speakers:</span>{" "}
                                  {event.speakers.join(", ")}
                                </>
                              ) : null}
                            </div>
                            <RegisterButton
                              eventId={event._id}
                              status={registeredEventStatusMap.get(event._id)}
                              onRegistered={() => {
                                toast.success("Request sent!");
                                setMyRegs((m) => [
                                  ...m,
                                  { eventId: event._id, status: 'pending' },
                                ]);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="text-center text-xl">No events found</p>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "registered" && (
            <div className="space-y-4">
              {registeredEvents.map((event) => {
                const status = registeredEventStatusMap.get(event._id);
                return (
                  <div
                    key={event._id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl w-24">
                          {event.image &&
                            String(event.image).startsWith("http") ? (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-24 h-16 object-cover rounded"
                            />
                          ) : null}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm font-medium ${status === 'pending' ? 'text-yellow-600' :
                          (status === 'approved' || status === 'registered') ? 'text-green-600' :
                            status === 'rejected' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                          {status === 'pending' ? 'Pending Approval' :
                            (status === 'approved' || status === 'registered') ? 'Registered' :
                              status === 'rejected' ? 'Rejected' : status}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === "past" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastEvents.map((event) => (
                <div
                  key={event._id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl w-full">
                      {event.image && String(event.image).startsWith("http") ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-40 object-cover rounded"
                        />
                      ) : null}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {event.registrationsCount || 0} attendees
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RegisterButton({
  eventId,
  status,
  onRegistered,
}: {
  eventId: string;
  status?: string;
  onRegistered?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function register() {
    try {
      setLoading(true);
      setMessage(null);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.info("Please login to register");
        return;
      }
      const { apiRegisterForEvent } = await import("../../lib/api");
      await apiRegisterForEvent(eventId, token);
      if (onRegistered) onRegistered();
    } catch (e: any) {
      if (e?.message !== "Already registered") {
        toast.error(e?.message || "Failed to register");
      }
      setMessage(e?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  }

  if (status === 'pending') {
    return <span className="text-sm text-yellow-600 font-medium">Pending Approval</span>;
  }
  if (status === 'approved' || status === 'registered') {
    return <span className="text-sm text-green-600 font-medium">Registered</span>;
  }
  if (status === 'rejected') {
    return <span className="text-sm text-red-600 font-medium">Rejected</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={register}
        disabled={loading}
        className={`bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium transition-colors ${loading ? "opacity-70" : ""
          }`}
      >
        {loading ? "Processing..." : "Register"}
      </button>
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  );
}
