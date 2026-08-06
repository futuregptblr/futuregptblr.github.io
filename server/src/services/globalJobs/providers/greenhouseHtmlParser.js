const cheerio = require('cheerio');

const BENEFITS_FALLBACK = 'Benefits are listed on the employer website.';

const SECTION_TYPES = {
  COMPANY: 'company',
  DESCRIPTION: 'description',
  RESPONSIBILITIES: 'responsibilities',
  REQUIREMENTS: 'requirements',
  PREFERRED: 'preferredQualifications',
  BENEFITS: 'benefits',
  UNKNOWN: 'unknown'
};

const SECTION_PRIORITY = [
  SECTION_TYPES.PREFERRED,
  SECTION_TYPES.REQUIREMENTS,
  SECTION_TYPES.RESPONSIBILITIES,
  SECTION_TYPES.BENEFITS,
  SECTION_TYPES.DESCRIPTION,
  SECTION_TYPES.COMPANY,
  SECTION_TYPES.UNKNOWN
];

const SKILL_PATTERNS = [
  ['Python', /\bpython\b/i],
  ['PyTorch', /\bpytorch\b/i],
  ['TensorFlow', /\btensorflow\b/i],
  ['CUDA', /\bcuda\b/i],
  ['AWS', /\baws\b|\bamazon web services\b/i],
  ['Azure', /\bazure\b/i],
  ['GCP', /\bgcp\b|\bgoogle cloud\b/i],
  ['LLM', /\bllms?\b|\blarge language models?\b/i],
  ['Machine Learning', /\bmachine learning\b|\bml\b/i],
  ['Deep Learning', /\bdeep learning\b/i],
  ['Computer Vision', /\bcomputer vision\b/i],
  ['NLP', /\bnlp\b|\bnatural language processing\b/i],
  ['RAG', /\brag\b|\bretrieval augmented generation\b/i],
  ['LangChain', /\blangchain\b/i],
  ['OpenAI', /\bopenai\b/i],
  ['Anthropic', /\banthropic\b/i],
  ['Vector Database', /\bvector databases?\b|\bvector search\b|\bembeddings?\b/i],
  ['Docker', /\bdocker\b/i],
  ['Kubernetes', /\bkubernetes\b|\bk8s\b/i],
  ['JavaScript', /\bjavascript\b|\btypescript\b/i],
  ['React', /\breact\b|\breact native\b/i],
  ['SQL', /\bsql\b/i],
  ['Spark', /\bspark\b|\bapache spark\b/i],
  ['MLflow', /\bmlflow\b/i]
];

function decodeHtml(value) {
  const raw = String(value || '');
  const $ = cheerio.load(`<textarea>${raw}</textarea>`, { decodeEntities: true });
  const decoded = $('textarea').text();
  return decoded.includes('&lt;') || decoded.includes('&gt;') ? decodeHtml(decoded) : decoded;
}

function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanText(value) {
  return normalizeWhitespace(value)
    .replace(/^[\s\-*•]+/, '')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

function dedupe(items) {
  const seen = new Set();
  return items
    .map(cleanText)
    .filter((item) => {
      if (!item || item.length < 3) return false;
      const key = item.toLowerCase().replace(/\W+/g, ' ').trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeSectionName(title) {
  const value = cleanText(title).toLowerCase().replace(/[:.]+$/, '');
  if (!value || value.length > 120) return SECTION_TYPES.UNKNOWN;

  if (/\b(preferred qualifications?|preferred experience|nice to have|bonus points|strong candidates may have|preferred skills?)\b/.test(value)) {
    return SECTION_TYPES.PREFERRED;
  }
  if (/\b(requirements?|qualifications?|minimum qualifications?|must have|required skills?|what we'?re looking for|about you|you have|who you are|basic qualifications?)\b/.test(value)) {
    return SECTION_TYPES.REQUIREMENTS;
  }
  if (/\b(responsibilit|what you'?ll do|what you will do|you will|your impact|key responsibilities|daily responsibilities|in this role|what you'll be doing|the impact you will have)\b/.test(value)) {
    return SECTION_TYPES.RESPONSIBILITIES;
  }
  if (/\b(benefits?|perks?|compensation|salary|rewards|what we offer|why join|pay range|equity)\b/.test(value)) {
    return SECTION_TYPES.BENEFITS;
  }
  if (/\b(about us|about company|about the company|company overview|who we are|our mission|about anthropic|about scale|about databricks|about google deepmind|about mistral|about cohere|about hugging face)\b/.test(value)) {
    return SECTION_TYPES.COMPANY;
  }
  if (/\b(description|overview|role summary|summary|mission|about the role|role overview|role description|the role|job description)\b/.test(value)) {
    return SECTION_TYPES.DESCRIPTION;
  }
  return SECTION_TYPES.UNKNOWN;
}

function createSection(title = '', type = SECTION_TYPES.UNKNOWN) {
  return {
    title: cleanText(title),
    type,
    paragraphs: [],
    lists: []
  };
}

function textOf($, node) {
  return cleanText($(node).text());
}

function hasOnlyInlineHeadingChildren($, node) {
  const children = $(node).children().toArray();
  if (!children.length) return false;
  return children.every((child) => ['strong', 'b', 'em', 'span'].includes(child.tagName?.toLowerCase()));
}

function isHeadingNode($, node) {
  const tagName = node.tagName?.toLowerCase();
  if (!tagName) return false;
  if (/^h[1-4]$/.test(tagName)) return true;
  if (['strong', 'b'].includes(tagName) && normalizeSectionName(textOf($, node)) !== SECTION_TYPES.UNKNOWN) return true;
  if (['p', 'div'].includes(tagName) && hasOnlyInlineHeadingChildren($, node)) {
    return normalizeSectionName(textOf($, node)) !== SECTION_TYPES.UNKNOWN;
  }
  return false;
}

function isContentContainer(tagName) {
  return ['body', 'main', 'article', 'section', 'div', 'blockquote'].includes(tagName);
}

function sectionFromContainerLabel($, node) {
  const tagName = node.tagName?.toLowerCase();
  if (!['article', 'section'].includes(tagName)) return null;
  const ariaLabel = $(node).attr('aria-label');
  const label = ariaLabel || $(node).children('h1,h2,h3,h4').first().text();
  const type = normalizeSectionName(label);
  return type === SECTION_TYPES.UNKNOWN ? null : createSection(label, type);
}

function appendParagraph(section, text) {
  const cleaned = cleanText(text);
  if (cleaned && normalizeSectionName(cleaned) === SECTION_TYPES.UNKNOWN) section.paragraphs.push(cleaned);
}

function appendList(section, items) {
  const cleaned = dedupe(items);
  if (cleaned.length) section.lists.push(cleaned);
}

function walkNode($, node, state) {
  if (node.type === 'text') {
    const text = cleanText(node.data);
    if (text) appendParagraph(state.current, text);
    return;
  }

  if (node.type !== 'tag') return;

  const tagName = node.tagName?.toLowerCase();
  if (!tagName || ['script', 'style', 'noscript'].includes(tagName)) return;

  if (isHeadingNode($, node)) {
    const title = textOf($, node);
    const type = normalizeSectionName(title);
    state.current = createSection(title, type);
    state.sections.push(state.current);
    return;
  }

  const labeledSection = sectionFromContainerLabel($, node);
  if (labeledSection) {
    state.current = labeledSection;
    state.sections.push(state.current);
  }

  if (tagName === 'ul' || tagName === 'ol') {
    const items = $(node).children('li').toArray().map((item) => textOf($, item));
    appendList(state.current, items);
    return;
  }

  if (tagName === 'p') {
    appendParagraph(state.current, textOf($, node));
    return;
  }

  if (tagName === 'br') {
    return;
  }

  if (isContentContainer(tagName)) {
    $(node).contents().toArray().forEach((child) => walkNode($, child, state));
  }
}

function buildSections(html) {
  const decodedHtml = decodeHtml(html);
  const $ = cheerio.load(decodedHtml, { decodeEntities: true });
  $('script, style, noscript').remove();

  const state = {
    sections: [],
    current: createSection('', SECTION_TYPES.DESCRIPTION)
  };
  state.sections.push(state.current);

  const roots = $('body').children().length ? $('body').children().toArray() : $.root().children().toArray();
  roots.forEach((node) => walkNode($, node, state));

  return state.sections
    .map((section) => ({
      ...section,
      paragraphs: dedupe(section.paragraphs),
      lists: section.lists.map(dedupe).filter((items) => items.length)
    }))
    .filter((section) => section.paragraphs.length || section.lists.length);
}

function sectionItems(section) {
  return dedupe([...section.paragraphs, ...section.lists.flat()]);
}

function paragraphText(sections, types, limit = 4) {
  return dedupe(
    sections
      .filter((section) => types.includes(section.type))
      .flatMap((section) => section.paragraphs)
  ).slice(0, limit);
}

function listText(sections, types) {
  return dedupe(
    sections
      .filter((section) => types.includes(section.type))
      .flatMap(sectionItems)
  );
}

function removeCrossSectionDuplicates(result) {
  const owners = new Map();

  SECTION_PRIORITY.forEach((field) => {
    const values = Array.isArray(result[field])
      ? result[field]
      : String(result[field] || '').split(/\n{2,}/);

    values.forEach((item) => {
      const key = cleanText(item).toLowerCase().replace(/\W+/g, ' ').trim();
      if (key && !owners.has(key)) owners.set(key, field);
    });
  });

  Object.keys(result).forEach((field) => {
    if (!Array.isArray(result[field])) return;
    result[field] = result[field].filter((item) => {
      const key = cleanText(item).toLowerCase().replace(/\W+/g, ' ').trim();
      return !key || owners.get(key) === field;
    });
  });

  const descriptionParagraphs = String(result.description || '').split(/\n{2,}/).filter(Boolean);
  result.description = descriptionParagraphs.filter((item) => {
    const key = cleanText(item).toLowerCase().replace(/\W+/g, ' ').trim();
    return !key || owners.get(key) === SECTION_TYPES.DESCRIPTION;
  }).join('\n\n') || result.description;

  return result;
}

function cleanPlainText(html) {
  const $ = cheerio.load(decodeHtml(html), { decodeEntities: true });
  $('script, style, noscript').remove();
  return cleanText($.text());
}

function fallbackFromPlainText(html) {
  const text = cleanPlainText(html);
  const paragraphs = dedupe(text.split(/\n{2,}|(?<=\.)\s+(?=[A-Z])/)).slice(0, 4);
  return {
    description: paragraphs.join('\n\n') || text.slice(0, 1200),
    paragraphs,
    responsibilities: [],
    requirements: [],
    preferredQualifications: [],
    benefits: [BENEFITS_FALLBACK],
    aboutCompany: '',
    skills: []
  };
}

function extractSkills(parsed, baseSkills = []) {
  const text = [
    parsed.description,
    parsed.aboutCompany,
    ...(parsed.paragraphs || []),
    ...(parsed.responsibilities || []),
    ...(parsed.requirements || []),
    ...(parsed.preferredQualifications || []),
    ...(parsed.benefits || [])
  ].join(' ');
  const extracted = SKILL_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([skill]) => skill);
  return dedupe([...baseSkills, ...extracted]);
}

function parseGreenhouseHtml(html, baseSkills = []) {
  const sections = buildSections(html);
  if (!sections.length) {
    const fallback = fallbackFromPlainText(html);
    return { ...fallback, skills: extractSkills(fallback, baseSkills) };
  }

  const descriptionParagraphs = paragraphText(sections, [SECTION_TYPES.DESCRIPTION, SECTION_TYPES.UNKNOWN], 5);
  const companyParagraphs = paragraphText(sections, [SECTION_TYPES.COMPANY], 3);

  const parsed = {
    description: descriptionParagraphs.join('\n\n'),
    paragraphs: descriptionParagraphs,
    responsibilities: listText(sections, [SECTION_TYPES.RESPONSIBILITIES]),
    requirements: listText(sections, [SECTION_TYPES.REQUIREMENTS]),
    preferredQualifications: listText(sections, [SECTION_TYPES.PREFERRED]),
    benefits: listText(sections, [SECTION_TYPES.BENEFITS]),
    aboutCompany: companyParagraphs.join('\n\n')
  };

  if (!parsed.description) {
    const firstUsefulSection = sections.find((section) => section.paragraphs.length);
    parsed.paragraphs = firstUsefulSection ? firstUsefulSection.paragraphs.slice(0, 4) : [];
    parsed.description = parsed.paragraphs.join('\n\n') || cleanPlainText(html).slice(0, 1200);
  }

  if (!parsed.benefits.length) parsed.benefits = [BENEFITS_FALLBACK];

  const normalized = removeCrossSectionDuplicates({
    ...parsed,
    responsibilities: dedupe(parsed.responsibilities),
    requirements: dedupe(parsed.requirements),
    preferredQualifications: dedupe(parsed.preferredQualifications),
    benefits: dedupe(parsed.benefits),
    paragraphs: dedupe(parsed.paragraphs)
  });

  normalized.skills = extractSkills(normalized, baseSkills);
  return normalized;
}

module.exports = {
  parseGreenhouseHtml
};
