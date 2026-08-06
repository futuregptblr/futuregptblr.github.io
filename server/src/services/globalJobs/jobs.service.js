const { AI_KEYWORDS } = require('./constants');
const { isAiRelated } = require('./aiFilter');
const { deduplicateJobs } = require('./deduplicator');
const cache = require('./cache.service');
const providers = require('./providers');

let refreshPromise = null;

function applyFilters(jobs, filters = {}) {
  const search = String(filters.search || '').toLowerCase().trim();
  const provider = String(filters.provider || '').toLowerCase().trim();
  const country = String(filters.country || '').toLowerCase().trim();
  const workMode = String(filters.workMode || '').toLowerCase().trim();

  return jobs.filter((job) => {
    const searchable = [job.title, job.company, job.location, job.description, ...(job.skills || [])].join(' ').toLowerCase();
    if (search && !searchable.includes(search)) return false;
    if (provider && job.provider !== provider) return false;
    if (country && String(job.country || '').toLowerCase() !== country) return false;
    if (workMode && String(job.workMode || '').toLowerCase() !== workMode) return false;
    return true;
  });
}

function hasValidApplyUrl(job) {
  try {
    const url = new URL(job.applyUrl);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch (error) {
    return false;
  }
}

async function refreshJobs(options = {}) {
  const providerResults = await Promise.allSettled(
    providers.map((provider) => provider.fetchJobs({
      keywords: AI_KEYWORDS,
      limit: Number(options.limit || 50),
      country: options.country
    }))
  );

  const fulfilledResults = providerResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);
  const providerFailures = providerResults
    .filter((result) => result.status === 'rejected')
    .map((result) => result.reason?.message || 'Global jobs provider failed');

  const jobs = fulfilledResults.flatMap((result) => result.jobs).filter((job) => isAiRelated(job) && hasValidApplyUrl(job));
  const errors = [
    ...fulfilledResults.flatMap((result) => result.errors || []),
    ...providerFailures
  ];
  const dedupedJobs = deduplicateJobs(jobs).sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0));

  try {
    await cache.setCachedJobs(dedupedJobs, errors);
  } catch (error) {
    errors.push('Global jobs cache could not be updated');
  }

  return { jobs: dedupedJobs, errors, refreshedAt: new Date(), cache: 'refreshed' };
}

async function getJobs(filters = {}) {
  const forceRefresh = filters.refresh === 'true' || filters.refresh === true;
  let cached = !forceRefresh ? await cache.getCachedJobs() : null;

  if (!cached || !cached.isFresh) {
    refreshPromise = refreshPromise || refreshJobs(filters).finally(() => {
      refreshPromise = null;
    });
    try {
      const refreshed = await refreshPromise;
      return {
        ...refreshed,
        jobs: applyFilters(refreshed.jobs, filters)
      };
    } catch (error) {
      if (cached?.jobs?.length) {
        return {
          jobs: applyFilters(cached.jobs, filters),
          errors: [...(cached.errors || []), 'Global jobs refresh failed; returning stale cache'],
          refreshedAt: cached.refreshedAt,
          cache: 'stale'
        };
      }
      throw error;
    }
  }

  return {
    jobs: applyFilters(cached.jobs, filters),
    errors: cached.errors,
    refreshedAt: cached.refreshedAt,
    cache: 'hit'
  };
}

async function getJobById(jobId) {
  const cached = await cache.getCachedJobs();
  let job = cached?.jobs?.find((item) => item.id === jobId);

  if (!job) {
    refreshPromise = refreshPromise || refreshJobs().finally(() => {
      refreshPromise = null;
    });
    const refreshed = await refreshPromise;
    job = refreshed.jobs.find((item) => item.id === jobId);
  }

  return job || null;
}

module.exports = {
  getJobById,
  getJobs,
  refreshJobs
};
