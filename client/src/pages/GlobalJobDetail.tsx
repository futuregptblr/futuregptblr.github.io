import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import type { GlobalApplication, GlobalJob, GlobalSavedJob } from "../types";
import {
  apiConfirmGlobalApplication,
  apiGetGlobalJob,
  apiListGlobalApplications,
  apiListGlobalSavedJobs,
  apiSaveGlobalJob,
  apiUnsaveGlobalJob,
} from "../lib/api";

const PENDING_APPLY_KEY = "futuregpt_pending_global_application";

function formatDate(value?: string) {
  if (!value) return "Recently posted";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently posted";
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

function formatSalary(job?: GlobalJob | null) {
  if (!job?.salary || (!job.salary.min && !job.salary.max)) return "Salary not listed";
  const currency = job.salary.currency || "";
  if (job.salary.min && job.salary.max) return `${currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`;
  if (job.salary.min) return `From ${currency} ${job.salary.min.toLocaleString()}`;
  return `Up to ${currency} ${job.salary.max?.toLocaleString()}`;
}

function splitDescription(description?: string) {
  return String(description || "")
    .split(/\.\s+|\n+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 24)
    .slice(0, 6);
}

function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4" role="dialog" aria-modal="true" aria-labelledby="global-job-dialog-title">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 id="global-job-dialog-title" className="text-xl font-bold text-slate-900">{title}</h2>
        <div className="mt-4">{children}</div>
        <button ref={closeRef} type="button" onClick={onClose} className="sr-only">Close dialog</button>
      </div>
    </div>
  );
}

export function GlobalJobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<GlobalJob | null>(null);
  const [savedJobs, setSavedJobs] = useState<GlobalSavedJob[]>([]);
  const [applications, setApplications] = useState<GlobalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeavingModal, setShowLeavingModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const token = localStorage.getItem("token");
  const decodedJobId = jobId ? decodeURIComponent(jobId) : "";

  const isSaved = useMemo(() => savedJobs.some((item) => item.jobId === decodedJobId), [decodedJobId, savedJobs]);
  const existingApplication = useMemo(() => applications.find((item) => item.jobId === decodedJobId), [applications, decodedJobId]);

  useEffect(() => {
    const pending = localStorage.getItem(PENDING_APPLY_KEY);
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        if (parsed.jobId === decodedJobId) setShowReturnModal(true);
      } catch {
        localStorage.removeItem(PENDING_APPLY_KEY);
      }
    }
  }, [decodedJobId]);

  useEffect(() => {
    async function load() {
      if (!decodedJobId) return;
      try {
        setLoading(true);
        setError(null);
        const [jobData, savedData, applicationData] = await Promise.all([
          apiGetGlobalJob(decodedJobId),
          token ? apiListGlobalSavedJobs(token).catch(() => []) : Promise.resolve([]),
          token ? apiListGlobalApplications(token).catch(() => []) : Promise.resolve([]),
        ]);
        setJob(jobData);
        setSavedJobs(savedData);
        setApplications(applicationData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [decodedJobId, token]);

  const toggleSave = async () => {
    if (!token || !job) {
      toast.info("Please log in to save global jobs.");
      return;
    }
    const previous = savedJobs;
    setSavedJobs((current) => isSaved
      ? current.filter((item) => item.jobId !== job.id)
      : [{ _id: job.id, userId: "", jobId: job.id, provider: job.provider, company: job.company, title: job.title, location: job.location, applyUrl: job.applyUrl, jobSnapshot: job, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current]);
    try {
      if (isSaved) {
        await apiUnsaveGlobalJob(token, job.id);
        toast.success("Removed from saved jobs");
      } else {
        await apiSaveGlobalJob(token, job.id);
        toast.success("Job saved");
      }
    } catch (err) {
      setSavedJobs(previous);
      toast.error(err instanceof Error ? err.message : "Could not update saved job");
    }
  };

  const continueToEmployer = () => {
    if (!job) return;
    localStorage.setItem(PENDING_APPLY_KEY, JSON.stringify({ jobId: job.id, title: job.title, company: job.company, applyUrl: job.applyUrl }));
    const employerWindow = window.open("", "_blank");
    if (employerWindow === null) {
      toast.error("Could not open the employer website. Please allow pop-ups and try again.");
      return;
    }
    employerWindow.opener = null;
    employerWindow.location.replace(job.applyUrl);
    setShowLeavingModal(false);
    setShowReturnModal(true);
  };

  const confirmApplied = async () => {
    if (!token || !job) {
      toast.info("Please log in to confirm applications.");
      return;
    }
    try {
      const application = await apiConfirmGlobalApplication(token, job.id);
      setApplications((current) => [application, ...current.filter((item) => item._id !== application._id)]);
      localStorage.removeItem(PENDING_APPLY_KEY);
      setShowReturnModal(false);
      toast.success("Application added to your Career Tracker");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not confirm application");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-36 rounded-xl bg-slate-200 animate-pulse" />
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="h-96 rounded-lg bg-white border border-slate-200 animate-pulse" />
          <div className="h-64 rounded-lg bg-white border border-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">Job not available</h1>
        <p className="mt-2 text-sm text-slate-600">{error || "This global job could not be found."}</p>
        <button onClick={() => navigate("/dashboard/global-jobs")} className="mt-5 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-blue-900">
          Back to Global Jobs
        </button>
      </div>
    );
  }

  const responsibilities = splitDescription(job.description);

  return (
    <div className="space-y-6">
      <Link to="/dashboard/global-jobs" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">
        <ArrowLeft className="h-4 w-4" />
        Back to Global Jobs
      </Link>

      <section className="rounded-xl bg-gradient-to-r from-yellow-400 to-blue-600 p-6 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/30 bg-white/20">
              {job.companyLogo ? <img src={job.companyLogo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-7 w-7" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="mt-1 text-white/90">{job.company}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full bg-white/20 px-3 py-1">{job.location}</span>
                <span className="rounded-full bg-white/20 px-3 py-1">{job.employmentType || "Role type"}</span>
                <span className="rounded-full bg-white/20 px-3 py-1">{job.workMode || "Work mode"}</span>
                <span className="rounded-full bg-white/20 px-3 py-1">{job.sourceName || job.provider}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={toggleSave} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-900 transition-colors hover:bg-yellow-50">
              {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {isSaved ? "Saved" : "Save Job"}
            </button>
            <button type="button" onClick={() => setShowLeavingModal(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-900">
              Apply on Company Website
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {existingApplication && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900" role="status">
          This application is in your Career Tracker as {existingApplication.currentStatus}.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <main className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Description</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{job.description || "No description provided by the source."}</p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Responsibilities</h2>
            <ul className="mt-4 space-y-3">
              {(responsibilities.length ? responsibilities : ["Review the employer posting for the full responsibility list."]).map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Required Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(job.skills?.length ? job.skills : ["AI", "Machine Learning"]).map((skill) => (
                <span key={skill} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">{skill}</span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Benefits</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(job.benefits?.length ? job.benefits : ["Benefits are listed on the employer website."]).map((benefit) => (
                <div key={benefit} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">{benefit}</div>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Job Snapshot</h2>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex gap-3"><MapPin className="h-4 w-4 text-slate-500" /><span>{job.location}</span></div>
              <div className="flex gap-3"><Briefcase className="h-4 w-4 text-slate-500" /><span>{job.employmentType || "Role type not listed"}</span></div>
              <div className="flex gap-3"><CalendarDays className="h-4 w-4 text-slate-500" /><span>{formatDate(job.postedDate)}</span></div>
              <div className="flex gap-3"><FileText className="h-4 w-4 text-slate-500" /><span>{formatSalary(job)}</span></div>
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">About Company</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              This role is sourced from {job.sourceName || job.provider}. FutureGPT links you to the employer site and stores only your saved or confirmed tracking data.
            </p>
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
              Employer portal
              <ExternalLink className="h-4 w-4" />
            </a>
          </section>
          <section className="rounded-lg border border-blue-100 bg-blue-50 p-5">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-blue-700" />
              <p className="text-sm leading-6 text-blue-900">FutureGPT cannot verify external applications. Use the confirmation flow after submitting on the employer website.</p>
            </div>
          </section>
        </aside>
      </div>

      {showLeavingModal && (
        <Dialog title="Leaving FutureGPT" onClose={() => setShowLeavingModal(false)}>
          <p className="text-sm leading-6 text-slate-700">
            You are about to leave FutureGPT and visit the employer&apos;s official careers website. Applications are completed on the employer&apos;s website. After submitting your application, return to FutureGPT so you can keep track of your application.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setShowLeavingModal(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Cancel</button>
            <button type="button" onClick={continueToEmployer} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">
              Continue
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </Dialog>
      )}

      {showReturnModal && (
        <Dialog title="Application Confirmation" onClose={() => setShowReturnModal(false)}>
          <p className="text-sm leading-6 text-slate-700">
            Have you successfully submitted your application?
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            If you&apos;ve completed your application in the employer tab, click &quot;Yes, I Applied&quot; to save it in your Career Tracker. Otherwise choose &quot;Not Yet&quot; and you can confirm later.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setShowReturnModal(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Not Yet</button>
            <button type="button" onClick={confirmApplied} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-blue-900">Yes, I Applied</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
