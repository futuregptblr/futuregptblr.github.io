import { useState } from 'react';
import { MapPin, Calendar, Globe, ExternalLink, ChevronDown, ChevronUp, Ticket, Tag } from 'lucide-react';

interface StatItem {
    value: string;
    label: string;
    emoji: string;
}

interface SubEvent {
    icon: string;
    title: string;
    desc: string;
}

const STATS: StatItem[] = [
    { value: '23,000+', label: 'Tech Buyers & Decision Makers', emoji: '👥' },
    { value: '600+', label: 'Global Enterprises & Startups', emoji: '🏢' },
    { value: '250+', label: 'Investors', emoji: '💼' },
    { value: '110+', label: 'Countries', emoji: '🌍' },
];

const SUB_EVENTS: SubEvent[] = [
    { icon: '🤖', title: 'AI EVERYTHING SINGAPORE', desc: 'Applied AI, enterprise deployment & real-world use cases across industries.' },
    { icon: '🚀', title: 'STARTUPS NORTH STAR ASIA', desc: "Asia's leading startup & investor marketplace for founders and global VCs." },
    { icon: '🏥', title: 'GITEX DIGI_HEALTH & BIOTECH', desc: 'Digital health and biotech innovation transforming healthcare across Asia.' },
    { icon: '🏢', title: 'GLOBAL DATA CENTRES ASIA', desc: 'Data centre infrastructure powering AI and cloud: connectivity, energy & resilience.' },
    { icon: '🔐', title: 'GISEC ASIA', desc: "Asia's premier cybersecurity event: threats, resilience & critical infrastructure." },
    { icon: '⚛️', title: 'GITEX QUANTUM EXPO ASIA', desc: 'Quantum computing, quantum-safe security & next-gen computing ecosystems.' },
];

const SOCIAL_LINKS = [
    { href: 'https://www.linkedin.com/company/gitexasia', label: 'LinkedIn', icon: 'in' },
    { href: 'https://x.com/gitexasia', label: 'X (Twitter)', icon: '𝕏' },
    { href: 'https://www.facebook.com/gitexasia/', label: 'Facebook', icon: 'f' },
    { href: 'https://www.instagram.com/gitexasia/', label: 'Instagram', icon: '📸' },
    { href: 'https://www.youtube.com/@gitexasia', label: 'YouTube', icon: '▶' },
    { href: 'https://www.tiktok.com/@gitexasia', label: 'TikTok', icon: '♪' },
];

export function GitexBanner() {
    const [expanded, setExpanded] = useState(false);

    return (
        <section className="relative py-16 overflow-hidden">
            {/* Animated gradient background */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"
                aria-hidden="true"
            />
            {/* Decorative blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section heading — community partnership framing */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-sm font-semibold tracking-wide uppercase">
                            🤝 Community Partnership Highlights
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
                        FutureGPT Bengaluru{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                            × Partner Events
                        </span>
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
                        We are proud to be a{' '}
                        <span className="text-orange-300 font-semibold">Community Partner</span>{' '}
                        of GITEX AI ASIA 2026 — Asia's largest tech, AI &amp; startup event.
                        As our member, you get exclusive access to discounted passes and early registration.
                    </p>
                </div>

                {/* Banner image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-10">
                    <img
                        src="/gitex_banner.png"
                        alt="GITEX AI ASIA 2026 — Building Trust & Scaling Innovation in Asia, 9–10 April 2026, Marina Bay Sands, Singapore"
                        className="w-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Main content card */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl">

                    {/* Event meta info */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-slate-300 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            <span className="font-semibold text-white">9–10 April 2026</span>
                        </div>
                        <span className="hidden sm:block text-slate-600">|</span>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            <span>Marina Bay Sands, <strong className="text-white">Singapore</strong></span>
                        </div>
                        <span className="hidden sm:block text-slate-600">|</span>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            <a
                                href="https://gitexasia.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors font-medium flex items-center gap-1"
                            >
                                gitexasia.com <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    {/* Event title block with community partner badge */}
                    <div className="text-center mb-6">
                        {/* Community Partner badge */}
                        <div className="flex justify-center mb-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-bold tracking-widest uppercase">
                                ✅ FutureGPT — Official Community Partner
                            </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                            GITEX AI ASIA 2026 — Singapore
                        </h3>
                        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
                            9–10 April 2026 · Marina Bay Sands · Asia's largest tech, AI &amp; startup event bringing
                            together <strong className="text-white">23,000+ leaders</strong> from{' '}
                            <strong className="text-white">110+ countries</strong> to build trust and scale
                            innovation across Asia's digital economy.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {STATS.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <span className="text-2xl mb-1">{stat.emoji}</span>
                                <div className="text-2xl font-extrabold text-orange-400 leading-none">{stat.value}</div>
                                <div className="text-xs text-slate-400 mt-1 leading-snug">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <a
                            id="gitex-free-pass-btn"
                            href="https://visit.gitexasia.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-sm sm:text-base shadow-lg hover:from-orange-400 hover:to-pink-400 hover:shadow-orange-500/30 hover:shadow-xl transition-all active:scale-95"
                        >
                            <Ticket className="w-4 h-4" />
                            Free Visitor Pass — Running Out Fast!
                        </a>
                        <a
                            id="gitex-conference-pass-btn"
                            href="https://visit.gitexasia.com/conference-pass"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-orange-500/60 text-orange-300 font-bold text-sm sm:text-base hover:bg-orange-500/10 hover:border-orange-400 transition-all active:scale-95"
                        >
                            <Tag className="w-4 h-4" />
                            Discounted Conference Pass — Limited Seats
                        </a>
                    </div>

                    {/* Toggle sub-events */}
                    <div className="flex justify-center mb-2">
                        <button
                            id="gitex-toggle-events-btn"
                            onClick={() => setExpanded((v) => !v)}
                            aria-expanded={expanded}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
                        >
                            {expanded ? (
                                <>Hide Co-Located Events <ChevronUp className="w-4 h-4" /></>
                            ) : (
                                <>Explore 6 Co-Located Events <ChevronDown className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>

                    {/* Sub-events grid (expandable) */}
                    {expanded && (
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                            {SUB_EVENTS.map((ev) => (
                                <div
                                    key={ev.title}
                                    className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <span className="text-2xl flex-shrink-0 mt-0.5">{ev.icon}</span>
                                    <div>
                                        <div className="text-xs font-bold text-orange-300 uppercase tracking-wider mb-1">{ev.title}</div>
                                        <div className="text-xs text-slate-400 leading-snug">{ev.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-white/10 mt-8 pt-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                            {/* Social links */}
                            <div className="flex items-center gap-2 flex-wrap justify-center">
                                <span className="text-xs text-slate-500 mr-1">Follow:</span>
                                {SOCIAL_LINKS.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`GITEX Asia ${s.label}`}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-orange-500/20 hover:border-orange-500/50 hover:text-orange-300 transition-all text-xs font-bold"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>

                            {/* Organiser text */}
                            <div className="text-xs text-slate-500 text-center sm:text-right">
                                Accelerated by: <span className="text-slate-400 font-semibold">GITEX GLOBAL</span>{' '}
                                · Organised by:{' '}
                                <span className="text-slate-400 font-semibold">DWTC &amp; KAOUN International</span>
                            </div>

                        </div>

                        {/* Hashtags */}
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {['#GITEXAIASIA', '#AIEverythingSingapore', '#GitexAsia2026'].map((tag) => (
                                <span key={tag} className="text-xs text-slate-500 bg-white/5 rounded-full px-3 py-1">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
