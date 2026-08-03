function normalizeKeyPart(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(inc|llc|ltd|pvt|private|limited|corp|corporation|company|co)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSimilarity(left, right) {
  const a = new Set(normalizeKeyPart(left).split(' ').filter(Boolean));
  const b = new Set(normalizeKeyPart(right).split(' ').filter(Boolean));
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return intersection / union;
}

function postedDay(date) {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

function isDuplicate(job, existing) {
  const sameCompany = tokenSimilarity(job.company, existing.company) >= 0.8;
  const similarTitle = tokenSimilarity(job.title, existing.title) >= 0.7;
  const similarLocation = tokenSimilarity(job.location, existing.location) >= 0.6;
  const samePostedDay = postedDay(job.postedDate) && postedDay(job.postedDate) === postedDay(existing.postedDate);

  return sameCompany && similarTitle && (similarLocation || samePostedDay);
}

function deduplicateJobs(jobs) {
  return jobs.reduce((uniqueJobs, job) => {
    const duplicate = uniqueJobs.find((existing) => isDuplicate(job, existing));
    if (!duplicate) {
      uniqueJobs.push(job);
    }
    return uniqueJobs;
  }, []);
}

module.exports = {
  deduplicateJobs
};
