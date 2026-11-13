// Education levels in teaching order. The ORDER matters: the eligibility rule
// compares positions in this list (see src/rules/eligibilityRule.js).
export const LEVELS = [
  { id: 'primary', label: 'Primary (Grades 1-5)' },
  { id: 'middle', label: 'Middle (Grades 6-8)' },
  { id: 'matric', label: 'Matric (Grades 9-10)' },
  { id: 'o-level', label: 'O Level' },
  { id: 'intermediate', label: 'Intermediate (FSc / FA)' },
  { id: 'a-level', label: 'A Level' },
  { id: 'undergraduate', label: 'Undergraduate (first year)' },
];

export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Urdu',
  'Islamiyat',
  'Pakistan Studies',
  'Computer Science',
  'Accounting',
  'Business Studies',
  'Economics',
];

export function getLevelIndex(levelId) {
  return LEVELS.findIndex((level) => level.id === levelId);
}

export function getLevelLabel(levelId) {
  const level = LEVELS.find((item) => item.id === levelId);
  return level ? level.label : 'Unknown level';
}
