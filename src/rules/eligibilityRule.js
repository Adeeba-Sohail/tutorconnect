// RULE 2 (eligibility)
// A student can only book a tutor who teaches the student's education level.
// Each tutor teaches a range of levels (levelFrom ... levelTo, inclusive).
import { getLevelIndex, getLevelLabel } from '../data/levels.js';

export function checkLevelEligibility(tutor, studentLevelId) {
  const studentIndex = getLevelIndex(studentLevelId);
  const fromIndex = getLevelIndex(tutor.levelFrom);
  const toIndex = getLevelIndex(tutor.levelTo);

  if (studentIndex === -1) {
    return { eligible: false, message: 'Please choose your education level.' };
  }

  const eligible = studentIndex >= fromIndex && studentIndex <= toIndex;
  if (eligible) {
    return { eligible: true, message: 'Your level is covered by this tutor.' };
  }

  return {
    eligible: false,
    message: `${tutor.name} teaches ${getLevelLabel(tutor.levelFrom)} to ${getLevelLabel(
      tutor.levelTo,
    )}. ${getLevelLabel(studentLevelId)} is outside that range.`,
  };
}
