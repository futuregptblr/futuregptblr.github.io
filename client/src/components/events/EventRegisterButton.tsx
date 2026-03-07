import { useState } from "react";
import { toast } from "react-toastify";
import { RiCheckDoubleLine, RiTimeLine, RiCloseCircleLine, RiFlashlightLine, RiLoader4Line, RiUserAddLine } from "react-icons/ri";
import { apiRegisterForEvent } from "../../lib/api";
import { useNavigate } from "react-router-dom";

interface EventRegisterButtonProps {
    eventId: string;
    status?: string;
    onRegistered?: () => void;
    className?: string;
}

export function EventRegisterButton({
    eventId,
    status,
    onRegistered,
    className = "",
}: EventRegisterButtonProps) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    if (!token) {
        return (
            <button
                onClick={() => {
                    navigate('/login', { state: { returnTo: `/events/${eventId}` } });
                }}
                className={`relative overflow-hidden px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 hover:bg-blue-700 ${className}`}
            >
                <div className="flex items-center justify-center gap-2">
                    <RiUserAddLine className="w-5 h-5" />
                    Sign in to Register
                </div>
            </button>
        );
    }

    async function register() {
        try {
            setLoading(true);
            await apiRegisterForEvent(eventId, token!);
            if (onRegistered) onRegistered();
        } catch (e: any) {
            if (e?.message !== "Already registered") {
                toast.error(e?.message || "Registration failed.");
            }
        } finally {
            setLoading(false);
        }
    }

    // Handle various statuses
    if (status === 'pending') {
        return (
            <div className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-50 border border-yellow-100 text-yellow-700 font-bold text-sm tracking-wide ${className}`}>
                <RiTimeLine className="w-5 h-5 animate-pulse" />
                Awaiting Approval
            </div>
        );
    }

    if (status === 'approved' || status === 'registered') {
        return (
            <div className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-sm tracking-wide ${className}`}>
                <RiCheckDoubleLine className="w-5 h-5" />
                Seat Confirmed
            </div>
        );
    }

    if (status === 'rejected') {
        return (
            <div className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 font-bold text-sm tracking-wide ${className}`}>
                <RiCloseCircleLine className="w-5 h-5" />
                Not Approved
            </div>
        );
    }

    return (
        <button
            onClick={register}
            disabled={loading}
            className={`relative overflow-hidden px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50 hover:bg-slate-800 ${className}`}
        >
            <div className="flex items-center justify-center gap-2">
                {loading ? (
                    <RiLoader4Line className="w-5 h-5 animate-spin" />
                ) : (
                    <RiFlashlightLine className="w-5 h-5 text-yellow-400" />
                )}
                {loading ? "Processing..." : "Register Now"}
            </div>
        </button>
    );
}
