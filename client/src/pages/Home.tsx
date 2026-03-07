import { useEffect, useState } from "react";
import { Hero } from "../components/sections/Hero";
import { MemberCount } from "../components/sections/MemberCount";
import { PremiumBanner } from "../components/sections/PremiumBanner";
import { GitexBanner } from "../components/sections/GitexBanner";
import { Features } from "../components/sections/Features";
import { CompanySlider } from "../components/sections/CompanySlider";
import { EventCarousel } from "../components/events/EventCarousel";
import { PastSpeakers } from "../components/sections/PastSpeakers";
import { GallerySection } from "../components/sections/GallerySection";
import { SocialFeed } from "../components/social/SocialFeed";
import { Community } from "../components/sections/Community";
import { Contact } from "../components/sections/Contact";
import { apiListEvents } from "../lib/api";

export function HomePage() {
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiListEvents("upcoming")
            .then(setUpcomingEvents)
            .finally(() => setLoading(false));
    }, []);

    return (
        <main>
            <Hero />
            <GitexBanner />
            <MemberCount />
            <PremiumBanner />
            <Features />
            <CompanySlider />

            {/* Featured Upcoming Events */}
            {!loading && upcomingEvents.length > 0 && (
                <section className="py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                                Upcoming Events
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Join the most influential AI gatherings, workshops, and meetups in your city.
                            </p>
                        </div>
                        <EventCarousel events={upcomingEvents} />
                    </div>
                </section>
            )}

            <PastSpeakers />
            <GallerySection />
            <SocialFeed />
            <Community />
            <Contact />
        </main>
    );
}
