const { normalizeJob } = require('../normalizer');

const ADZUNA_COUNTRIES = ['in', 'us', 'gb', 'ca', 'au'];
const ADZUNA_RESPONSE_PREVIEW_LENGTH = 1000;

function maskAdzunaUrl(url) {
  return url
    .replace(/([?&]app_id=)[^&]*/i, '$1<redacted>')
    .replace(/([?&]app_key=)[^&]*/i, '$1<redacted>');
}

function logAdzunaFailure({ countryCode, url, status, body, error }) {
  console.error('Adzuna provider failure:', {
    country: countryCode,
    requestUrl: maskAdzunaUrl(url),
    status,
    responseBody: body ? body.slice(0, ADZUNA_RESPONSE_PREVIEW_LENGTH) : undefined,
    error: error ? `${error.name}: ${error.message}` : undefined
  });
}

function formatSalary(job) {
  if (!job.salary_min && !job.salary_max) return null;
  return {
    min: job.salary_min || null,
    max: job.salary_max || null,
    currency: job.salary_currency || null
  };
}

async function fetchAdzunaJobs({ keywords, limit, country }) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  console.log('Adzuna credentials loaded:', {
    appIdPresent: Boolean(appId),
    appIdLength: appId ? appId.length : 0,
    appKeyPresent: Boolean(appKey),
    appKeyLength: appKey ? appKey.length : 0
  });

  if (!appId || !appKey) {
    return { jobs: [], errors: ['Adzuna credentials are not configured'] };
  }

  const countries = country ? [country.toLowerCase()] : ADZUNA_COUNTRIES;
  const jobs = [];
  const errors = [];

  await Promise.all(countries.map(async (countryCode) => {
    const query = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      results_per_page: String(Math.min(limit || 50, 50)),
      what: 'AI',
      sort_by: 'date'
    });
    const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?${query}`;

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(10000)
      });
      const body = await response.text();

      if (!response.ok) {
        logAdzunaFailure({
          countryCode,
          url,
          status: response.status,
          body
        });
        errors.push(`Adzuna ${countryCode} returned ${response.status}`);
        return;
      }

      let payload;
      try {
        payload = JSON.parse(body);
      } catch (error) {
        logAdzunaFailure({
          countryCode,
          url,
          status: response.status,
          body,
          error
        });
        errors.push(`Adzuna ${countryCode} returned invalid JSON`);
        return;
      }

      (payload.results || []).forEach((job) => {
        jobs.push(normalizeJob({
          id: `adzuna:${job.id}`,
          sourceId: job.id,
          title: job.title,
          company: job.company?.display_name,
          location: job.location?.display_name,
          country: countryCode.toUpperCase(),
          employmentType: job.contract_type,
          salary: formatSalary(job),
          description: job.description,
          postedDate: job.created,
          provider: 'adzuna',
          sourceName: 'Adzuna',
          applyUrl: job.redirect_url,
          skills: keywords.filter((keyword) => String(job.description || job.title || '').toLowerCase().includes(keyword.toLowerCase()))
        }));
      });
    } catch (error) {
      logAdzunaFailure({
        countryCode,
        url,
        error
      });
      errors.push(`Adzuna ${countryCode} unavailable: ${error.message}`);
    }
  }));

  return { jobs, errors };
}

module.exports = {
  fetchJobs: fetchAdzunaJobs
};
