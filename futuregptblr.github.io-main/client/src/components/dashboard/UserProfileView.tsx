import { MapPin, Mail, Phone, Calendar, Download, Briefcase } from "lucide-react";
import { User as UserType, Experience } from "../../types";

interface UserProfileViewProps {
    user: UserType;
}

export function UserProfileView({ user }: UserProfileViewProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-start gap-6">
                <div className="text-7xl bg-slate-100 rounded-2xl p-4 shadow-sm">
                    {user?.avatar || '👤'}
                </div>
                <div className="flex-1 pt-2">
                    <h2 className="text-3xl font-bold text-slate-900 mb-1">{user?.name}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600">
                        {user?.role && (
                            <span className="flex items-center gap-1 font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                                <Briefcase className="h-3.5 w-3.5" />
                                {user.role} {user.company ? `@ ${user.company}` : ''}
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-sm bg-slate-100 px-3 py-1 rounded-full">
                            <Mail className="h-3.5 w-3.5" />
                            {user?.email}
                        </span>
                        {user?.phone && (
                            <span className="flex items-center gap-1 text-sm bg-slate-100 px-3 py-1 rounded-full">
                                <Phone className="h-3.5 w-3.5" />
                                {user.phone}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        {user?.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {user.location}
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio Section */}
            {user?.bio && (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">About</h3>
                    <p className="text-slate-700 leading-relaxed italic">"{user.bio}"</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Skills & Interests */}
                <div className="space-y-6">
                    {user?.skills && user.skills.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill) => (
                                    <span key={skill} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {user?.interests && user.interests.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                Interests
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.interests.map((interest) => (
                                    <span key={interest} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Professional Documents */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Documents
                        </h3>
                        {user?.resumeUrl ? (
                            <a
                                href={user.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-colors group shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                                        <Download className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Professional Resume</p>
                                        <p className="text-xs text-slate-500">PDF Document</p>
                                    </div>
                                </div>
                                <Calendar className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                            </a>
                        ) : (
                            <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-center text-slate-400 text-sm italic">
                                No resume uploaded
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Experience Section */}
            {user?.experience && user.experience.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        Professional Experience
                    </h3>
                    <div className="space-y-4">
                        {user.experience.map((exp: Experience, idx: number) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{exp.title}</h4>
                                        <p className="text-blue-600 font-medium text-sm">{exp.company}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                                            {" - "}
                                            {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                                        </p>
                                    </div>
                                </div>
                                {exp.description && (
                                    <p className="mt-3 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-3">
                                        {exp.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
