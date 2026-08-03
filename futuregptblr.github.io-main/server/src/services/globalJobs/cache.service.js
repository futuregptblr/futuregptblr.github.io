const GlobalJobCache = require('../../models/GlobalJobCache');

const CACHE_TTL_MINUTES = Number(process.env.GLOBAL_JOBS_CACHE_TTL_MINUTES || 60);

async function getCachedJobs() {
  const cached = await GlobalJobCache.findOne({ key: 'global-jobs' }).lean();
  if (!cached) return null;

  const expiresAt = new Date(cached.refreshedAt.getTime() + CACHE_TTL_MINUTES * 60 * 1000);
  return {
    jobs: cached.jobs || [],
    errors: cached.providerErrors || [],
    refreshedAt: cached.refreshedAt,
    isFresh: expiresAt > new Date()
  };
}

async function setCachedJobs(jobs, errors) {
  return GlobalJobCache.findOneAndUpdate(
    { key: 'global-jobs' },
    { jobs, providerErrors: errors, refreshedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

module.exports = {
  getCachedJobs,
  setCachedJobs
};
