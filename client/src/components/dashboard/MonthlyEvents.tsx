import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  RiCalendarEventLine,
  RiCalendarLine,
  RiClockwiseLine,
  RiExternalLinkLine,
  RiGlobalLine,
  RiLockLine,
  RiMapPinLine,
  RiSearchLine,
  RiUserStarLine,
} from 'react-icons/ri';
import { API_BASE_URL } from '../../lib/utils';
import { apiListEventResources, apiListMonthlyEvents, type EventDto, type EventResourceDto } from '../../lib/api';

const formatDate = (value?: string) => {
  if (!value) return 'Date TBD';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date TBD';
  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (value?: string) => {
  if (!value) return 'Time TBD';
  return value;
};

const formatResourceType = (type?: string) => {
  switch (type) {
    case 'ppt':
      return 'Presentation';
    case 'pdf':
      return 'PDF';
    case 'doc':
      return 'Document';
    case 'video':
      return 'Video';
    case 'image':
      return 'Image';
    case 'notes':
      return 'Notes';
    case 'link':
      return 'Link';
    default:
      return 'Resource';
  }
};

async function openProtectedResource(event: EventDto, resource: EventResourceDto) {
  const token = localStorage.getItem('token');
  if (resource.requiresAuthentication && !token) {
    throw new Error('auth-required');
  }

  if (resource.externalLink) {
    window.open(resource.externalLink, '_blank', 'noopener,noreferrer');
    return;
  }

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(
    `${API_BASE_URL}/api/events/${event._id}/resources/${resource._id}/download`,
    { headers },
  );

  if (response.status === 401) {
    throw new Error('auth-required');
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || 'Unable to access resource');
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = resource.title || 'futuregpt-resource';
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

export function MonthlyEvents() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourceMap, setResourceMap] = useState<Record<string, EventResourceDto[]>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      try {
        setLoading(true);
        const list = await apiListMonthlyEvents();
        const monthly = list.filter((event) => event.published !== false);

        if (!active) return;

        const getEventTime = (value?: string) => {
          const parsed = value ? new Date(value).getTime() : Number.NEGATIVE_INFINITY;
          return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
        };

        setEvents(
          monthly.sort((a, b) => getEventTime(a.date) - getEventTime(b.date)),
        );
      } catch (error) {
        console.error('Failed to load monthly events:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadEvents();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!eventId) return;

    const selected = events.find((event) => event._id === eventId);
    if (!selected) return;

    let active = true;
    const loadResources = async () => {
      try {
        const resources = await apiListEventResources(selected._id);
        if (active) {
          setResourceMap((current) => ({ ...current, [selected._id]: resources }));
        }
      } catch (error) {
        console.error('Failed to load event resources:', error);
      }
    };

    void loadResources();
    return () => { active = false; };
  }, [eventId, events]);

  const monthlyEvents = useMemo(() => {
    const getEventTime = (value?: string) => {
      const parsed = value ? new Date(value).getTime() : Number.NEGATIVE_INFINITY;
      return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
    };

    const normalized = [...events].sort((a, b) => getEventTime(a.date) - getEventTime(b.date));
    return normalized.filter((event) => {
      if (!search.trim()) return true;
      const terms = [
        event.title,
        event.description,
        event.domain,
        event.location,
        event.speaker?.name,
        event.speaker?.company,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return terms.includes(search.trim().toLowerCase());
    });
  }, [events, search]);

  if (eventId) {
    const selected = monthlyEvents.find((event) => event._id === eventId) ?? null;
    const resourceList = selected ? resourceMap[selected._id] ?? selected.resources ?? [] : [];

    if (!selected && !loading) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <RiCalendarEventLine className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Monthly event not found</h2>
          <p className="text-sm text-slate-600">The event you selected is no longer available.</p>
          <button
            onClick={() => navigate('/dashboard/monthly-events')}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Monthly Events
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8 px-4 pb-12">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="relative w-full bg-slate-200">
            <img
              src={selected?.image || '/events/default.jpg'}
              alt={selected?.title || 'Monthly event'}
              className="mx-auto block h-auto w-full max-h-[32rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
            <button
              onClick={() => navigate('/dashboard/monthly-events')}
              className="absolute left-5 top-5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Back
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-700">
                Monthly Event
              </span>
              <h1 className="text-3xl font-black text-slate-900 md:text-5xl">{selected?.title}</h1>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="whitespace-pre-wrap text-base leading-8 text-slate-700">{selected?.description}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Resources</h2>
              {resourceList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  No resources have been shared for this event yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {resourceList.map((resource) => (
                    <ResourceCard
                      key={resource._id}
                      event={selected!}
                      resource={resource}
                      navigate={navigate}
                      location={location}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <RiCalendarLine className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Date</p>
                <p className="font-semibold text-slate-800">{formatDate(selected?.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
                <RiClockwiseLine className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Time</p>
                <p className="font-semibold text-slate-800">{formatTime(selected?.startTime)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                <RiMapPinLine className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Location</p>
                <p className="font-semibold text-slate-800">{selected?.location || 'Virtual / TBA'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="rounded-xl bg-violet-50 p-2 text-violet-600">
                <RiGlobalLine className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Domain</p>
                <p className="font-semibold text-slate-800">{selected?.domain || 'General'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="rounded-xl bg-yellow-50 p-2 text-yellow-600">
                <RiUserStarLine className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Speaker</p>
                <p className="font-semibold text-slate-800">{selected?.speaker?.name || 'To be announced'}</p>
              </div>
            </div>

            {selected?.registrationUrl && (
              <a
                href={selected.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Register now
                <RiExternalLinkLine className="h-4 w-4" />
              </a>
            )}
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 pb-12">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-yellow-400 to-blue-600 p-8 shadow-xl md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-900/80">FutureGPT</p>
            <h1 className="text-3xl font-black text-white md:text-4xl">MONTHLY EVENTS</h1>
          </div>
          <div className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm">
            <RiCalendarEventLine className="h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <RiSearchLine className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, domain, speaker..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-72 animate-pulse rounded-[2rem] bg-slate-200" />
          ))}
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-slate-900">Insights &amp; Resources</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {monthlyEvents.length} event{monthlyEvents.length === 1 ? '' : 's'}
          </span>
        </div>

        {monthlyEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            No monthly events are available right now.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {monthlyEvents.map((event) => {
              const resources = resourceMap[event._id] ?? event.resources ?? [];
              const hasResources = resources.length > 0;

              return (
                <button
                  key={event._id}
                  onClick={() => navigate(`/dashboard/monthly-events/${event._id}`)}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative aspect-[2/1] overflow-hidden bg-slate-200">
                    <img src={event.image || '/events/default.jpg'} alt={event.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">
                      {event.isFeatured ? 'Featured' : 'Monthly'}
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                      <p className="text-sm text-slate-600">{event.domain || 'General AI'}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <RiCalendarLine className="h-4 w-4 text-blue-600" />
                      <span>{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <RiUserStarLine className="h-4 w-4 text-yellow-600" />
                      <span>{event.speaker?.name || 'Speaker to be announced'}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                      <span>{hasResources ? `${resources.length} resource${resources.length === 1 ? '' : 's'}` : 'No resources yet'}</span>
                      <span className="text-blue-600">View</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

type ResourceCardProps = {
  event: EventDto;
  resource: EventResourceDto;
  navigate: ReturnType<typeof useNavigate>;
  location: ReturnType<typeof useLocation>;
};

function ResourceCard({ event, resource, navigate, location }: ResourceCardProps) {
  const token = localStorage.getItem('token');
  const isLocked = Boolean(resource.requiresAuthentication && !token);

  const handleAccess = async () => {
    try {
      await openProtectedResource(event, resource);
    } catch (error) {
      if (error instanceof Error && error.message === 'auth-required') {
        navigate('/login', {
          state: { returnTo: location.pathname },
        });
        return;
      }
      console.error('Failed to access resource:', error);
    }
  };

  const handleSignUp = () => {
    navigate('/signup', {
      state: { returnTo: location.pathname },
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
              {formatResourceType(resource.type)}
            </span>
            {resource.requiresAuthentication ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">
                <RiLockLine className="h-3 w-3" />
                Members only
              </span>
            ) : null}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{resource.title}</h3>
          {resource.description ? <p className="text-sm leading-6 text-slate-600">{resource.description}</p> : null}
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><RiCalendarEventLine className="h-3.5 w-3.5" /> {event.title}</span>
            {resource.speaker?.name ? (
              <span className="inline-flex items-center gap-1"><RiUserStarLine className="h-3.5 w-3.5" /> {resource.speaker.name}</span>
            ) : null}
          </div>
        </div>

        {isLocked ? (
          <div className="min-w-[220px] space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <RiLockLine className="h-4 w-4 text-slate-500" />
              Sign in to unlock this resource
            </div>
            <p className="text-xs leading-5 text-slate-600">
              This resource is protected. Sign in to continue or create an account to access the full event material.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => navigate('/login', { state: { returnTo: location.pathname } })}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Sign In
              </button>
              <button
                onClick={handleSignUp}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAccess}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
          >
            {resource.externalLink ? 'Open' : 'Access'}
            <RiExternalLinkLine className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
