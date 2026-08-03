import { useEffect, useState } from "react";
import { EventCard } from "../components/events/EventCard";
import { apiListEvents } from "../lib/api";
import { Event } from "../types";

export function EventsPage() {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [pastEvents, setPastEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiListEvents("upcoming"),
            apiListEvents("past")
        ])
            .then(([upcoming, past]) => {
                setUpcomingEvents(upcoming);
                setPastEvents(past);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
    );

    return (
        <div className="py-20 min-h-[60vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" id="upcoming-events">
                    Upcoming Events
                </h2>
                {upcomingEvents.length === 0 ? (
                    <p className="text-center text-gray-500 mb-20">No upcoming events found. Stay tuned!</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {upcomingEvents.map((event) => (
                            <EventCard key={event._id || event.id} event={event} />
                        ))}
                    </div>
                )}
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" id="past-events">
                    Past Events
                </h2>
                {pastEvents.length === 0 ? (
                    <p className="text-center text-gray-500">No past events found.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pastEvents.map((event) => (
                            <EventCard key={event._id || event.id} event={event} isPast />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}