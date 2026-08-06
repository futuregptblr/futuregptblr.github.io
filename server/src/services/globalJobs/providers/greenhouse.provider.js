const { normalizeJob } = require('../normalizer');
const { parseGreenhouseHtml } = require('./greenhouseHtmlParser');

const GREENHOUSE_BOARDS = [
  'openai',
  'anthropic',
  'cohere',
  'databricks',
  'scaleai',
  'huggingface',
  'perplexityai',
  'deepmind'
];

async function fetchBoard(boardToken, keywords) {
  const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`, {
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) {
    throw new Error(`Greenhouse ${boardToken} returned ${response.status}`);
  }
  const payload = await response.json();
  const companyName = payload.meta?.name || boardToken;

  return (payload.jobs || []).map((job) => {
    const parsedContent = parseGreenhouseHtml(
      job.content,
      keywords.filter((keyword) => `${job.title} ${job.content}`.toLowerCase().includes(keyword.toLowerCase()))
    );

    return normalizeJob({
      id: `greenhouse:${boardToken}:${job.id}`,
      sourceId: job.id,
      title: job.title,
      company: companyName,
      location: job.location?.name,
      country: '',
      employmentType: job.metadata?.find((item) => item.name === 'Employment Type')?.value,
      description: parsedContent.description,
      paragraphs: parsedContent.paragraphs,
      responsibilities: parsedContent.responsibilities,
      requirements: parsedContent.requirements,
      preferredQualifications: parsedContent.preferredQualifications,
      benefits: parsedContent.benefits,
      aboutCompany: parsedContent.aboutCompany,
      postedDate: job.updated_at,
      provider: 'greenhouse',
      sourceName: 'Greenhouse',
      applyUrl: job.absolute_url,
      skills: parsedContent.skills
    });
  });
}

async function fetchGreenhouseJobs({ keywords }) {
  const jobs = [];
  const errors = [];

  await Promise.all(GREENHOUSE_BOARDS.map(async (boardToken) => {
    try {
      jobs.push(...await fetchBoard(boardToken, keywords));
    } catch (error) {
      errors.push(error.message);
    }
  }));

  return { jobs, errors };
}

module.exports = {
  fetchJobs: fetchGreenhouseJobs
};
