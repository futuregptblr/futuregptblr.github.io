import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Bookmark, Briefcase, ExternalLink, FileText, Plus } from "lucide-react";
import type { GlobalApplication, GlobalSavedJob } from "../../types";
import {
  apiAddGlobalApplicationNote,
  apiListGlobalApplications,
  apiListGlobalApplicationStatuses,
  apiListGlobalSavedJobs,
  apiUpdateGlobalApplicationStatus,
} from "../../lib/api";

const DEFAULT_STATUSES = ["Applied", "Assessment", "Interview", "HR Round", "Offer", "Rejected", "Withdrawn"];

function formatDate(value?: string) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function CareerTracker() {
  const [savedJobs, setSavedJobs] = useState<GlobalSavedJob[]>([]);
  const [applications, setApplications] = useState<GlobalApplication[]>([]);
  const [statuses, setStatuses] = useState<string[]>(DEFAULT_STATUSES);
  const [loading, setLoading] = useState(true);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        setLoading(true);
        const [saved, apps, statusList] = await Promise.all([
          apiListGlobalSavedJobs(token),
          apiListGlobalApplications(token),
          apiListGlobalApplicationStatuses(token).catch(() => DEFAULT_STATUSES),
        ]);
        setSavedJobs(saved);
        setApplications(apps);
        setStatuses(statusList);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not load Career Tracker");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const applicationJobIds = useMemo(() => new Set(applications.map((item) => item.jobId)), [applications]);

  const updateStatus = async (application: GlobalApplication, status: string) => {
    if (!token) return;
    const previous = applications;
    setApplications((current) => current.map((item) => item._id === application._id ? { ...item, currentStatus: status } : item));
    try {
      const updated = await apiUpdateGlobalApplicationStatus(token, application._id, status);
      setApplications((current) => current.map((item) => item._id === updated._id ? updated : item));
      toast.success("Application status updated");
    } catch (err) {
      setApplications(previous);
      toast.error(err instanceof Error ? err.message : "Could not update status");
    }
  };

  const addNote = async (application: GlobalApplication) => {
    if (!token) return;
    const note = noteDrafts[application._id]?.trim();
    if (!note) return;
    const previous = applications;
    setNoteDrafts((current) => ({ ...current, [application._id]: "" }));
    try {
      const updated = await apiAddGlobalApplicationNote(token, application._id, note);
      setApplications((current) => current.map((item) => item._id === updated._id ? updated : item));
      toast.success("Note saved");
    } catch (err) {
      setApplications(previous);
      setNoteDrafts((current) => ({ ...current, [application._id]: note }));
      toast.error(err instanceof Error ? err.message : "Could not save note");
    }
  };

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-6 w-40 rounded bg-slate-200 animate-pulse" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-40 rounded-lg border border-slate-200 bg-slate-50 animate-pulse" />
          <div className="h-40 rounded-lg border border-slate-200 bg-slate-50 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Career Tracker</h3>
        <p className="mt-1 text-sm text-slate-600">Track saved global roles and applications submitted on employer websites.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-blue-600" />
            <h4 className="font-bold text-slate-900">Saved Jobs</h4>
          </div>
          <div className="mt-4 space-y-3">
            {savedJobs.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No saved global jobs yet.
              </div>
            )}
            {savedJobs.map((job) => (
              <div key={job._id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{job.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{job.company} · {job.location || "Location not listed"}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{job.provider}</p>
                  </div>
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${job.title} employer link`} className="rounded-lg p-2 text-blue-700 hover:bg-blue-50">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                {applicationJobIds.has(job.jobId) && (
                  <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Applied</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-yellow-600" />
            <h4 className="font-bold text-slate-900">Applications</h4>
          </div>
          <div className="mt-4 space-y-4">
            {applications.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No confirmed external applications yet.
              </div>
            )}
            {applications.map((application) => (
              <div key={application._id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{application.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{application.company} · Applied {formatDate(application.appliedDate)}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{application.provider}</p>
                  </div>
                  <a href={application.applyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50">
                    Check Employer Portal
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor={`status-${application._id}`}>Application Status</label>
                  <select
                    id={`status-${application._id}`}
                    value={application.currentStatus}
                    onChange={(event) => updateStatus(application, event.target.value)}
                    className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
                  >
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor={`note-${application._id}`}>Notes</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id={`note-${application._id}`}
                      value={noteDrafts[application._id] || ""}
                      onChange={(event) => setNoteDrafts((current) => ({ ...current, [application._id]: event.target.value }))}
                      placeholder="Add a quick note..."
                      className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-sm"
                    />
                    <button type="button" onClick={() => addNote(application)} aria-label="Save note" className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {application.notes?.slice(-2).reverse().map((note) => (
                      <div key={note._id || note.createdAt} className="flex gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span>{note.body}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
