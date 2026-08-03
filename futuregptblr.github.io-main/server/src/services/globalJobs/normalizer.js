const crypto = require('crypto');

function stripHtml(value) {
  if (!value) return '';
  return String(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value)
    .split(/\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function cleanString(value, fallback = '') {
  return stripHtml(value || fallback).slice(0, 5000);
}

function createJobId(provider, sourceId, title, company, location) {
  const raw = [provider, sourceId || title, company, location].join('|').toLowerCase();
  return crypto.createHash('sha1').update(raw).digest('hex');
}

function inferEmploymentType(text) {
  const value = String(text || '').toLowerCase();
  if (value.includes('intern')) return 'Internship';
  if (value.includes('part')) return 'Part-time';
  if (value.includes('contract') || value.includes('freelance')) return 'Contract';
  return 'Full-time';
}

function inferWorkMode(text) {
  const value = String(text || '').toLowerCase();
  if (value.includes('remote')) return 'Remote';
  if (value.includes('hybrid')) return 'Hybrid';
  return 'On-site';
}

function normalizeJob(input) {
  const title = cleanString(input.title, 'Untitled role');
  const company = cleanString(input.company, 'Unknown company');
  const location = cleanString(input.location, 'Not specified');
  const description = cleanString(input.description);
  const combinedText = [title, location, description, input.employmentType, input.workMode].join(' ');
  const employmentType = cleanString(input.employmentType) || inferEmploymentType(combinedText);
  const workMode = cleanString(input.workMode) || inferWorkMode(combinedText);
  const applyUrl = String(input.applyUrl || '').trim();

  return {
    id: input.id || createJobId(input.provider, input.sourceId, title, company, location),
    title,
    company,
    location,
    country: cleanString(input.country, 'Unknown'),
    employmentType,
    workMode,
    salary: input.salary || null,
    description,
    responsibilities: toArray(input.responsibilities),
    requirements: toArray(input.requirements),
    preferredQualifications: toArray(input.preferredQualifications),
    benefits: toArray(input.benefits),
    aboutCompany: cleanString(input.aboutCompany),
    postedDate: input.postedDate ? new Date(input.postedDate) : null,
    provider: cleanString(input.provider),
    sourceName: cleanString(input.sourceName || input.provider),
    applyUrl,
    companyLogo: input.companyLogo ? String(input.companyLogo).trim() : '',
    paragraphs: toArray(input.paragraphs),
    skills: toArray(input.skills),
    experience: cleanString(input.experience),
    isRemote: Boolean(input.isRemote || workMode.toLowerCase() === 'remote' || combinedText.toLowerCase().includes('remote')),
    isInternship: Boolean(input.isInternship || employmentType.toLowerCase().includes('intern')),
    isFullTime: Boolean(input.isFullTime || employmentType.toLowerCase().includes('full')),
    rawPostedDate: input.postedDate || null
  };
}

module.exports = {
  cleanString,
  normalizeJob,
  stripHtml
};
