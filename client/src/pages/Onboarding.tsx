import { useState, useEffect } from "react";
import {
    User,
    MapPin,
    Briefcase,
    Building,
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Sparkles,
    Award,
    Globe,
    Rocket
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUpdateProfile, apiGetProfile } from "../lib/api";
import { User as UserType, Experience } from "../types";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser } from "../slices/userSlice";

export default function Onboarding() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const totalSteps = 4;

    const [formData, setFormData] = useState<Partial<UserType>>({
        name: "",
        role: "",
        company: "",
        bio: "",
        location: "",
        phone: "",
        skills: [],
        interests: [],
        avatar: "👨‍💻",
        experience: [],
    });

    const [skillsInput, setSkillsInput] = useState("");
    const [interestsInput, setInterestsInput] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            try {
                const user = await apiGetProfile(token);
                setFormData({
                    ...formData,
                    ...user,
                    experience: user.experience || [],
                    skills: user.skills || [],
                    interests: user.interests || [],
                });
                setSkillsInput((user.skills || []).join(", "));
                setInterestsInput((user.interests || []).join(", "));
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSkillsChange = (val: string) => {
        setSkillsInput(val);
        const skillsArray = val.split(",").map(s => s.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, skills: skillsArray }));
    };

    const handleInterestsChange = (val: string) => {
        setInterestsInput(val);
        const interestsArray = val.split(",").map(s => s.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, interests: interestsArray }));
    };

    const addExperience = () => {
        const newItem: Experience = { company: "", title: "", startDate: "", endDate: "", description: "" };
        setFormData(prev => ({ ...prev, experience: [...(prev.experience || []), newItem] }));
    };

    const removeExperience = (index: number) => {
        setFormData(prev => ({ ...prev, experience: (prev.experience || []).filter((_, i) => i !== index) }));
    };

    const updateExperience = (index: number, field: keyof Experience, value: any) => {
        const list = [...(formData.experience || [])];
        list[index] = { ...list[index], [field]: value };
        setFormData(prev => ({ ...prev, experience: list }));
    };

    const handleFinish = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setIsSubmitting(true);
        try {
            const updatedUser = await apiUpdateProfile(token, formData);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            dispatch(setReduxUser(updatedUser));
            window.dispatchEvent(new Event("auth-change"));

            toast.success("Profile complete! Welcome to the community! 🚀");
            navigate("/dashboard/events");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (step / totalSteps) * 100;

    const avatars = ["👨‍💻", "👩‍💻", "🧑‍🚀", "👸", "👨‍💼", "👩‍💼", "🤖", "🎨"];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-20 py-12 px-4 sm:px-6 lg:px-8">
            {/* Premium Header */}
            <div className="max-w-2xl w-full text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg mb-6 text-white rotate-3">
                    <Sparkles className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Welcome to <span className="text-blue-600">FutureGPT</span>
                </h1>
                <p className="mt-3 text-lg text-slate-600">
                    Let's set up your profile to personalize your experience.
                </p>
            </div>

            {/* Progress Bar Container */}
            <div className="max-w-xl w-full mb-12 relative">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-3 text-sm font-medium text-slate-500 px-1">
                    <span className={step >= 1 ? "text-blue-600" : ""}>Basics</span>
                    <span className={step >= 2 ? "text-blue-600" : ""}>Professional</span>
                    <span className={step >= 3 ? "text-blue-600" : ""}>Experience</span>
                    <span className={step >= 4 ? "text-blue-600" : ""}>Growth</span>
                </div>
            </div>

            {/* Form Card */}
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 sm:p-12">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <User className="mr-2 text-blue-500" /> Let's start with the basics
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Pick an avatar that represents you
                                    </label>
                                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                                        {avatars.map((a) => (
                                            <button
                                                key={a}
                                                onClick={() => handleInputChange("avatar", a)}
                                                className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 ${formData.avatar === a
                                                    ? "bg-blue-600 text-white scale-110 shadow-lg ring-4 ring-blue-50"
                                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:scale-105"
                                                    }`}
                                            >
                                                {a}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={formData.bio || ""}
                                        onChange={(e) => handleInputChange("bio", e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="Tell the community a bit about yourself..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.location || ""}
                                            onChange={(e) => handleInputChange("location", e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                            placeholder="e.g. Bangalore, India"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <Briefcase className="mr-2 text-blue-500" /> Professional Journey
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        What's your current role?
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.role || ""}
                                        onChange={(e) => handleInputChange("role", e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. AI Engineer, Product Manager"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Where do you work?
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.company || ""}
                                            onChange={(e) => handleInputChange("company", e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Current Company"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone || ""}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                                    <Globe className="mr-2 text-blue-500" /> Work History
                                </h2>
                                <button
                                    onClick={addExperience}
                                    className="flex items-center space-x-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Work</span>
                                </button>
                            </div>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {(formData.experience || []).length === 0 && (
                                    <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                        <div className="bg-white h-12 w-12 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                                            <Briefcase className="h-6 w-6 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500">No experience added yet.</p>
                                    </div>
                                )}

                                {(formData.experience || []).map((exp, index) => (
                                    <div key={index} className="bg-slate-50 rounded-2xl p-6 relative border border-slate-100">
                                        <button
                                            onClick={() => removeExperience(index)}
                                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company</label>
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={exp.title}
                                                    onChange={(e) => updateExperience(index, "title", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={exp.startDate?.substring(0, 10) || ""}
                                                    onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <Rocket className="mr-2 text-blue-500" /> Final Touches
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                        Skills <span className="ml-2 text-xs font-normal text-slate-400">(Comma separated)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={skillsInput}
                                        onChange={(e) => handleSkillsChange(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="JavaScript, React, AI, Python..."
                                    />
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.skills?.map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                        Interests <span className="ml-2 text-xs font-normal text-slate-400">(Comma separated)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={interestsInput}
                                        onChange={(e) => handleInterestsChange(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Machine Learning, Robotics, Hiking..."
                                    />
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.interests?.map(interest => (
                                            <span key={interest} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl">
                                    <div className="relative z-10">
                                        <h4 className="text-lg font-bold mb-2 flex items-center">
                                            <Award className="mr-2 h-5 w-5" /> All set for take off!
                                        </h4>
                                        <p className="text-blue-100 text-sm">
                                            Your profile helps us connect you with relevant events, jobs, and community members.
                                        </p>
                                    </div>
                                    <Sparkles className="absolute -bottom-4 -right-4 h-24 w-24 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Footer */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <button
                        onClick={() => setStep(prev => Math.max(1, prev - 1))}
                        disabled={step === 1}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all ${step === 1
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-slate-600 hover:bg-slate-100 active:scale-95"
                            }`}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center space-x-4">
                        {step < totalSteps ? (
                            <button
                                onClick={() => setStep(prev => Math.min(totalSteps, prev + 1))}
                                className="flex items-center space-x-2 px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold shadow-sm hover:shadow-md hover:translate-y-[-2px] active:translate-y-0 transition-all"
                            >
                                <span>Continue</span>
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleFinish}
                                disabled={isSubmitting}
                                className="flex items-center space-x-2 px-10 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2" />
                                        <span>Launching...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Ready to Go!</span>
                                        <Sparkles className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        )}

                        {step === 1 && (
                            <button
                                onClick={() => navigate("/dashboard/events")}
                                className="text-slate-400 hover:text-slate-600 text-sm font-medium ml-4 transition-colors"
                            >
                                Skip for now
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
        </div>
    );
}
