import { Hero } from "../components/sections/Hero";
import { MemberCount } from "../components/sections/MemberCount";
import { PremiumBanner } from "../components/sections/PremiumBanner";
import { GitexBanner } from "../components/sections/GitexBanner";
import { Features } from "../components/sections/Features";
import { CompanySlider } from "../components/sections/CompanySlider";
import { EventCard } from "../components/events/EventCard";
import { upcomingEvents } from "../data/events";
import { PastSpeakers } from "../components/sections/PastSpeakers";
import { GallerySection } from "../components/sections/GallerySection";
import { SocialFeed } from "../components/social/SocialFeed";
import { Community } from "../components/sections/Community";
import { Contact } from "../components/sections/Contact";

export function HomePage() {
    return (
        <main>
            <Hero />
            <GitexBanner />
            <MemberCount />
            <PremiumBanner />
            <Features />
            <CompanySlider />

            {/* Upcoming Events Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Upcoming Events
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </section>

            <PastSpeakers />
            <GallerySection />
            <SocialFeed />
            <Community />
            <Contact />
        </main>
    );
}
