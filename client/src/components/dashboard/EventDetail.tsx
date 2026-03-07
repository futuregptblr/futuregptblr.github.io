import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RiCalendarLine, RiMapPinLine, RiTimeLine, RiArrowLeftLine, RiGlobalLine, RiShareLine, RiCheckDoubleLine, RiFlashlightLine, RiArrowRightSLine } from "react-icons/ri";
import { apiListEvents, apiListMyEventRegistrations } from "../../lib/api";
import { toast } from "react-toastify";
import { EventRegisterButton } from "../events/EventRegisterButton";

export function EventDetail() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [upcoming, past] = await Promise.all([
                    apiListEvents("upcoming"),
                    apiListEvents("past"),
                ]);
                const found = [...upcoming, ...past].find((e) => e._id === eventId);
                setEvent(found);

                const token = localStorage.getItem("token");
                if (token && found) {
                    const regs = await apiListMyEventRegistrations(token);
                    const myReg = regs.find((r: any) => (r.eventId?._id || r.eventId) === found._id);
                    if (myReg) setStatus(myReg.status);
                }
            } catch (e: any) {
                toast.error("Failed to load details");
            } finally {
                setLoading(false);
            }
        })();
    }, [eventId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Event</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-40 max-w-lg mx-auto space-y-4">
                <RiFlashlightLine className="w-16 h-16 text-slate-300 mx-auto" />
                <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold active:scale-95 transition-all"
                >
                    Back to Timeline
                </button>
            </div>
        );
    }

    const isPast = new Date(event.date) < new Date();
    const eventDate = new Date(event.date);

    return (
        <div className="w-full bg-slate-50 relative pb-32">
            {/* Cinematic Hero Section */}
            <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-900 overflow-hidden">
                {/* Header Actions */}
                <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 max-w-7xl mx-auto">
                    <button
                        onClick={() => {
                            if (window.history.length > 2) {
                                navigate(-1);
                            } else {
                                navigate('/');
                            }
                        }}
                        className="group flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-all bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md"
                    >
                        <RiArrowLeftLine className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied!");
                        }}
                        className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all shadow-sm"
                    >
                        <RiShareLine className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-12 p-6 md:p-12 z-10 max-w-7xl mx-auto flex flex-col items-start translate-y-6">
                    <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg mb-4">
                        {isPast ? 'Past Session' : (event.type || 'Upcoming Event')}
                    </span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] mb-6 max-w-4xl drop-shadow-2xl">
                        {event.title}
                    </h1>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    {/* Left Column: Details */}
                    <div className="lg:w-2/3 space-y-12">

                        {/* High-def Image Flyer */}
                        <div className="rounded-2xl lg:rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 relative group">
                            <img
                                src={event.image || "/events/default.jpg"}
                                alt={event.title}
                                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                        </div>

                        {/* Event Context */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-slate-900 border-b border-slate-200 pb-4">About the Experience</h2>
                            <div className="prose prose-lg prose-slate max-w-none text-slate-600 font-medium leading-[1.8] whitespace-pre-wrap text-base sm:text-lg">
                                {event.description}
                            </div>
                        </div>

                        {/* Speakers Section */}
                        {event.speakers?.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900">Featured Voices</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {event.speakers.map((speaker: string) => (
                                        <div key={speaker} className="px-5 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-blue-200 transition-colors">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <RiCheckDoubleLine className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-slate-800 text-sm">{speaker}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Floating Action Card */}
                    <div className="lg:w-1/3">
                        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-200/50 sticky top-24 space-y-8">

                            {/* Date & Time block */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <RiCalendarLine className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                        <p className="text-base font-bold text-slate-900">{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <RiTimeLine className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                                        <p className="text-base font-bold text-slate-900">{[event.startTime, event.endTime].filter(Boolean).join(" - ") || "TBA"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <RiMapPinLine className="w-6 h-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                                        <p className="text-base font-bold text-slate-900 leading-tight">{event.location}</p>

                                        {event.locationUrl && (
                                            <a
                                                href={event.locationUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-bold mt-2"
                                            >
                                                <RiGlobalLine className="w-4 h-4" />
                                                Open Map <RiArrowRightSLine className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="pt-6 border-t border-slate-100">
                                {!isPast ? (
                                    <div className="space-y-4">
                                        <EventRegisterButton
                                            eventId={event._id}
                                            status={status}
                                            onRegistered={() => {
                                                toast.success("Request received for moderation.");
                                                setStatus("pending");
                                            }}
                                            className="w-full text-base py-5 rounded-2xl"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-slate-900 rounded-2xl p-6 text-center space-y-2">
                                        <RiCheckDoubleLine className="w-8 h-8 text-white/50 mx-auto" />
                                        <p className="text-3xl font-black text-white">{event.registrationsCount || 0}</p>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Attendees</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
