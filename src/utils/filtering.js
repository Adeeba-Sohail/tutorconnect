// Pure functions for searching, filtering and sorting tutors.
import { LEVELS, SUBJECTS, getLevelIndex, getLevelLabel } from '../data/levels.js';

export const DEFAULT_FILTERS = {
  q: '', // search text
  subject: '', // '' means any subject
  level: '', // '' means any level
  maxRate: '', // '' means any price (otherwise a number as text)
  acceptingOnly: false,
  sort: 'recommended',
};

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'experience', label: 'Most experienced' },
];

export const PRICE_LIMITS = [1500, 2000, 2500, 3000];

function matchesSearch(tutor, query) {
  const text = query.trim().toLowerCase();
  if (!text) return true;
  const searchable = [
    tutor.name,
    tutor.title,
    tutor.city,
    tutor.bio,
    ...tutor.subjects,
    ...tutor.qualifications,
  ]
    .join(' ')
    .toLowerCase();
  // Every word typed must appear somewhere ("physics lahore" finds Usman Tariq).
  return text.split(/\s+/).every((word) => searchable.includes(word));
}

function teachesLevel(tutor, levelId) {
  const index = getLevelIndex(levelId);
  return index >= getLevelIndex(tutor.levelFrom) && index <= getLevelIndex(tutor.levelTo);
}

export function filterTutors(tutors, filters) {
  return tutors.filter((tutor) => {
    if (!matchesSearch(tutor, filters.q)) return false;
    if (filters.subject && !tutor.subjects.includes(filters.subject)) return false;
    if (filters.level && !teachesLevel(tutor, filters.level)) return false;
    if (filters.maxRate && tutor.hourlyRate > Number(filters.maxRate)) return false;
    if (filters.acceptingOnly && tutor.paused) return false;
    return true;
  });
}

export function sortTutors(tutors, sortKey) {
  const sorted = [...tutors]; // copy first: .sort() would change the original array
  switch (sortKey) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'price-low':
      return sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
    case 'price-high':
      return sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
    case 'experience':
      return sorted.sort((a, b) => b.experienceYears - a.experienceYears);
    default:
      // Recommended: rating first, but a tutor with many reviews is more trustworthy
      return sorted.sort((a, b) => b.rating * Math.log10(b.reviewCount + 10) - a.rating * Math.log10(a.reviewCount + 10));
  }
}

// ---------- Keeping filters in the URL (so Back/refresh/shared links keep them) ----------

// Read the URL query string (?q=physics&level=matric) and turn it into a safe filters object.
export function filtersFromParams(params) {
  const sortValue = params.get('sort');
  const rate = params.get('maxRate');
  return {
    q: params.get('q') ?? '',
    subject: SUBJECTS.includes(params.get('subject')) ? params.get('subject') : '',
    level: LEVELS.some((level) => level.id === params.get('level')) ? params.get('level') : '',
    maxRate: PRICE_LIMITS.includes(Number(rate)) ? rate : '',
    acceptingOnly: params.get('accepting') === '1',
    sort: SORT_OPTIONS.some((option) => option.value === sortValue) ? sortValue : DEFAULT_FILTERS.sort,
  };
}

// The reverse: only write values that differ from the defaults, to keep URLs short.
export function paramsFromFilters(filters) {
  const params = {};
  if (filters.q) params.q = filters.q;
  if (filters.subject) params.subject = filters.subject;
  if (filters.level) params.level = filters.level;
  if (filters.maxRate) params.maxRate = filters.maxRate;
  if (filters.acceptingOnly) params.accepting = '1';
  if (filters.sort !== DEFAULT_FILTERS.sort) params.sort = filters.sort;
  return params;
}

// A readable list of the filters that are switched on (sorting is not a filter).
export function describeActiveFilters(filters) {
  const active = [];
  if (filters.q.trim()) active.push({ key: 'q', label: `Search: “${filters.q.trim()}”` });
  if (filters.subject) active.push({ key: 'subject', label: `Subject: ${filters.subject}` });
  if (filters.level) active.push({ key: 'level', label: `Level: ${getLevelLabel(filters.level)}` });
  if (filters.maxRate) active.push({ key: 'maxRate', label: `Up to PKR ${Number(filters.maxRate).toLocaleString('en-PK')} per hour` });
  if (filters.acceptingOnly) active.push({ key: 'acceptingOnly', label: 'Only tutors accepting bookings' });
  return active;
}

// Value that "switches a filter off".
export function clearedValue(key) {
  return DEFAULT_FILTERS[key];
}

// For the "no results" screen: what would happen if ONE filter were removed?
export function getRelaxationSuggestions(tutors, filters) {
  return describeActiveFilters(filters)
    .map((filter) => ({
      ...filter,
      count: filterTutors(tutors, { ...filters, [filter.key]: clearedValue(filter.key) }).length,
    }))
    .filter((suggestion) => suggestion.count > 0)
    .sort((a, b) => b.count - a.count);
}
