import { EventCard } from "../components/events/EventCard";
import { pastEvents } from "../data/events";

export function PastEventsPage() {
    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Past Events
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.map((event) => (
                        <EventCard key={event.id} event={event} isPast />
                    ))}
                </div>
            </div>
        </div>
    );
}
