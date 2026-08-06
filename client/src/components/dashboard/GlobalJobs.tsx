import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  CalendarDays,
  Clock,
  ExternalLink,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  WifiOff,
} from "lucide-react";
import type { GlobalJob, GlobalSavedJob } from "../../types";
import {
  apiListGlobalJobs,
  apiListGlobalSavedJobs,
  apiSaveGlobalJob,
  apiUnsaveGlobalJob,
} from "../../lib/api";

const providerLabels: Record<string, string> = {
  adzuna: "Adzuna",
  greenhouse: "Greenhouse",
};

function useDebouncedValue(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debounced;
}

function formatDate(value?: string) {
  if (!value) return "Recently posted";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently posted";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatSalary(job: GlobalJob) {
  if (!job.salary || (!job.salary.min && !job.salary.max)) return "Salary not listed";
  const currency = job.salary.currency || "";
  if (job.salary.min && job.salary.max) return `${currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`;
  if (job.salary.min) return `From ${currency} ${job.salary.min.toLocaleString()}`;
  return `Up to ${currency} ${job.salary.max?.toLocaleString()}`;
}

function JobSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-lg bg-slate-200 animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-2/3 rounded bg-slate-200 animate-pulse" />
          <div className="h-3 w-1/3 rounded bg-slate-100 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-slate-100 animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-slate-100 animate-pulse" />
            <div className="h-6 w-16 rounded-full bg-slate-100 animate-pulse" />
          </div>
          <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
          <div className="h-3 w-4/5 rounded bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ kind, onRefresh }: { kind: "empty" | "error" | "offline"; onRefresh: () => void }) {
  const copy = {
    empty: {
      icon: Briefcase,
      title: "No global jobs found",
      message: "Try broadening the filters or searching a different AI role.",
    },
    error: {
      icon: AlertTriangle,
      title: "Global jobs are unavailable",
      message: "The provider feed could not be reached. You can retry without losing your filters.",
    },
    offline: {
      icon: WifiOff,
      title: "Showing limited results",
      message: "Provider data is stale or partially unavailable. Saved jobs and tracker data are still available.",
    },
  }[kind];
  const Icon = copy.icon;

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{copy.title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{copy.message}</p>
      <button
        type="button"
        onClick={onRefresh}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-blue-900 transition-colors hover:bg-yellow-300"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </button>
    </div>
  );
}

function GlobalJobCard({
  job,
  isSaved,
  onToggleSave,
}: {
  job: GlobalJob;
  isSaved: boolean;
  onToggleSave: (job: GlobalJob) => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <Building2 className="h-6 w-6 text-slate-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
              <p className="mt-1 text-sm font-medium text-slate-700">{job.company}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                {providerLabels[job.provider] || job.sourceName || job.provider}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">AI</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <Clock className="h-3.5 w-3.5" />
              {job.employmentType || "Role type"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <Briefcase className="h-3.5 w-3.5" />
              {job.workMode || (job.isRemote ? "Remote" : "On-site")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(job.postedDate)}
            </span>
          </div>

          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{job.description || "No description provided by the source."}</p>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-900">{formatSalary(job)}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onToggleSave(job)}
                aria-label={isSaved ? "Remove saved job" : "Save job"}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                  isSaved
                    ? "border-yellow-300 bg-yellow-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-yellow-300 hover:text-blue-900"
                }`}
              >
                {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {isSaved ? "Saved" : "Save Job"}
              </button>
              <Link
                to={`/dashboard/global-jobs/${encodeURIComponent(job.id)}`}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                View Details
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function GlobalJobs() {
  const [jobs, setJobs] = useState<GlobalJob[]>([]);
  const [savedJobs, setSavedJobs] = useState<GlobalSavedJob[]>([]);
  const [search, setSearch] = useState("");
  const [workMode, setWorkMode] = useState("all");
  const [provider, setProvider] = useState("all");
  const [country, setCountry] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheState, setCacheState] = useState<string | undefined>();
  const [providerErrors, setProviderErrors] = useState<string[]>([]);
  const debouncedSearch = useDebouncedValue(search);

  const savedIds = useMemo(() => new Set(savedJobs.map((job) => job.jobId)), [savedJobs]);
  const token = localStorage.getItem("token");

  const loadJobs = useCallback(async (refresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiListGlobalJobs({
        search: debouncedSearch,
        provider,
        country,
        workMode,
        limit: 100,
        refresh,
      });
      setJobs(data.jobs || []);
      setCacheState(data.cache);
      setProviderErrors(data.providerErrors || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load global jobs");
    } finally {
      setLoading(false);
    }
  }, [country, debouncedSearch, provider, workMode]);

  const loadSavedJobs = useCallback(async () => {
    if (!token) return;
    try {
      setSavedJobs(await apiListGlobalSavedJobs(token));
    } catch {
      setSavedJobs([]);
    }
  }, [token]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  const visibleJobs = useMemo(() => {
    const sorted = [...jobs];
    sorted.sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.postedDate || 0).getTime() - new Date(b.postedDate || 0).getTime();
      if (sortBy === "company") return a.company.localeCompare(b.company);
      if (sortBy === "salary") return (b.salary?.max || b.salary?.min || 0) - (a.salary?.max || a.salary?.min || 0);
      return new Date(b.postedDate || 0).getTime() - new Date(a.postedDate || 0).getTime();
    });
    return sorted;
  }, [jobs, sortBy]);

  const toggleSave = async (job: GlobalJob) => {
    if (!token) {
      toast.info("Please log in to save global jobs.");
      return;
    }

    const wasSaved = savedIds.has(job.id);
    setSavedJobs((current) => wasSaved
      ? current.filter((item) => item.jobId !== job.id)
      : [{ _id: job.id, userId: "", jobId: job.id, provider: job.provider, company: job.company, title: job.title, location: job.location, applyUrl: job.applyUrl, jobSnapshot: job, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current]);

    try {
      if (wasSaved) {
        await apiUnsaveGlobalJob(token, job.id);
        toast.success("Removed from saved jobs");
      } else {
        await apiSaveGlobalJob(token, job.id);
        toast.success("Job saved");
      }
    } catch (err) {
      loadSavedJobs();
      toast.error(err instanceof Error ? err.message : "Could not update saved job");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-gradient-to-r from-yellow-400 to-blue-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Global Jobs</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/90">
          Discover AI roles from trusted external providers. Applications happen on the employer website, and FutureGPT helps you track what happens next.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Search global jobs</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, company, skills, location..."
              className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
            />
          </label>
          <select aria-label="Work mode" value={workMode} onChange={(event) => setWorkMode(event.target.value)} className="h-11 rounded-lg border border-slate-300 px-3 text-sm">
            <option value="all">All work modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>
          <select aria-label="Provider" value={provider} onChange={(event) => setProvider(event.target.value)} className="h-11 rounded-lg border border-slate-300 px-3 text-sm">
            <option value="all">All providers</option>
            <option value="adzuna">Adzuna</option>
            <option value="greenhouse">Greenhouse</option>
          </select>
          <select aria-label="Country" value={country} onChange={(event) => setCountry(event.target.value)} className="h-11 rounded-lg border border-slate-300 px-3 text-sm">
            <option value="all">All countries</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
          <select aria-label="Sort jobs" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-11 rounded-lg border border-slate-300 px-3 text-sm">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="salary">Salary</option>
            <option value="company">Company</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2">
            <Filter className="h-3.5 w-3.5" />
            {visibleJobs.length} roles found
          </span>
          <button type="button" onClick={() => loadJobs(true)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-bold text-blue-700 hover:bg-blue-50">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh feed
          </button>
        </div>
      </section>

      {providerErrors.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          Some providers are temporarily unavailable. Showing available {cacheState === "stale" ? "cached" : "live"} results.
        </div>
      )}

      <section className="space-y-4">
        {loading && Array.from({ length: 5 }, (_, index) => <JobSkeleton key={index} />)}
        {!loading && error && <EmptyState kind="error" onRefresh={() => loadJobs(true)} />}
        {!loading && !error && providerErrors.length > 0 && visibleJobs.length === 0 && <EmptyState kind="offline" onRefresh={() => loadJobs(true)} />}
        {!loading && !error && providerErrors.length === 0 && visibleJobs.length === 0 && <EmptyState kind="empty" onRefresh={() => loadJobs(true)} />}
        {!loading && !error && visibleJobs.map((job) => (
          <GlobalJobCard key={job.id} job={job} isSaved={savedIds.has(job.id)} onToggleSave={toggleSave} />
        ))}
      </section>
    </div>
  );
}
