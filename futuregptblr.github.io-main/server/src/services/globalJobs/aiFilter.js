const { AI_KEYWORDS } = require('./constants');

const EXCLUDED_KEYWORDS = ['teacher', 'faculty', 'professor', 'lecturer'];

function isAiRelated(job) {
  const text = [
    job.title,
    job.company,
    job.description,
    ...(job.skills || []),
    ...(job.requirements || [])
  ].join(' ').toLowerCase();

  const hasAiSignal = AI_KEYWORDS.some((keyword) => text.includes(keyword));
  if (!hasAiSignal) return false;

  const title = String(job.title || '').toLowerCase();
  const explicitlyAiEducation = title.includes('ai') || title.includes('machine learning') || title.includes('data science');
  const excludedByTitle = EXCLUDED_KEYWORDS.some((keyword) => title.includes(keyword));

  return !excludedByTitle || explicitlyAiEducation;
}

module.exports = {
  isAiRelated
};
