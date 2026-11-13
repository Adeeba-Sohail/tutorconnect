// Validation for the booking form. A pure function: same input, same output,
// so it is easy to test and to explain. It returns an object of error messages
// keyed by field name; an empty object means the form is valid.
import { checkSlotCapacity, countBookingsForSlot } from '../rules/capacityRule.js';
import { checkLevelEligibility } from '../rules/eligibilityRule.js';
import { isValidDuration } from '../rules/pricingRule.js';
import { BOOKING_WINDOW_DAYS, isSlotInPast, tutorTeachesOn } from './availability.js';
import { addDays, formatDateLong, isValidDateKey, parseDateKey, toDateKey, weekdayName } from './dates.js';
import { formatTime } from './format.js';

// Order used to focus the first problem and to list the error summary.
export const FIELD_ORDER = ['studentName', 'email', 'level', 'subject', 'date', 'time', 'duration', 'requirements'];

export const FIELD_LABELS = {
  studentName: 'Student name',
  email: 'Email address',
  level: 'Education level',
  subject: 'Subject',
  date: 'Date',
  time: 'Time slot',
  duration: 'Session length',
  requirements: 'Learning requirements',
};

export const REQUIREMENTS_MIN = 15;
export const REQUIREMENTS_MAX = 500;

const NAME_PATTERN = /^[A-Za-z؀-ۿ][A-Za-z؀-ۿ .'-]*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateBooking(form, tutor, bookings, now) {
  const errors = {};

  // --- Student name ---
  const name = form.studentName.trim();
  if (!name) errors.studentName = 'Enter the student’s name.';
  else if (name.length < 2) errors.studentName = 'The name must have at least 2 characters.';
  else if (name.length > 60) errors.studentName = 'The name must be 60 characters or fewer.';
  else if (!NAME_PATTERN.test(name)) errors.studentName = 'Use letters, spaces, dots, hyphens or apostrophes only.';

  // --- Email ---
  const email = form.email.trim();
  if (!email) errors.email = 'Enter an email address.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter an email like name@example.com (include the @ and a domain).';

  // --- Education level (business rule 2: eligibility) ---
  if (!form.level) {
    errors.level = 'Choose the student’s education level.';
  } else {
    const eligibility = checkLevelEligibility(tutor, form.level);
    if (!eligibility.eligible) errors.level = eligibility.message;
  }

  // --- Subject ---
  if (!form.subject) errors.subject = 'Choose the subject you need help with.';
  else if (!tutor.subjects.includes(form.subject)) errors.subject = `${tutor.name} does not teach ${form.subject}.`;

  // --- Date ---
  const today = toDateKey(now);
  const lastDay = toDateKey(addDays(now, BOOKING_WINDOW_DAYS));
  if (!form.date) {
    errors.date = 'Choose a date.';
  } else if (!isValidDateKey(form.date)) {
    errors.date = 'Enter a valid date.';
  } else if (form.date < today) {
    errors.date = 'Choose today or a future date.';
  } else if (form.date > lastDay) {
    errors.date = `Bookings open ${BOOKING_WINDOW_DAYS} days ahead. Choose a date on or before ${formatDateLong(lastDay)}.`;
  } else if (!tutorTeachesOn(tutor, form.date)) {
    errors.date = `${tutor.name} does not teach on ${weekdayName(parseDateKey(form.date).getDay())}s. Choose another date.`;
  }

  // --- Time slot (business rule 1: capacity) ---
  if (!form.time) {
    errors.time = form.date && !errors.date ? 'Choose a time slot.' : 'Choose a date, then a time slot.';
  } else if (!tutor.timeSlots.includes(form.time)) {
    errors.time = 'That time is not offered by this tutor. Choose one of the listed slots.';
  } else if (form.date && !errors.date) {
    if (isSlotInPast(form.date, form.time, now)) {
      errors.time = `${formatTime(form.time)} has already passed today. Choose a later slot.`;
    } else {
      const booked = countBookingsForSlot(bookings, tutor.id, form.date, form.time);
      const capacity = checkSlotCapacity(booked);
      if (!capacity.allowed) errors.time = capacity.message;
    }
  }

  // --- Duration ---
  if (!isValidDuration(form.duration)) errors.duration = 'Choose a session length.';

  // --- Learning requirements ---
  const requirements = form.requirements.trim();
  if (!requirements) errors.requirements = 'Tell the tutor what you want to learn.';
  else if (requirements.length < REQUIREMENTS_MIN) {
    errors.requirements = `Add a little more detail (at least ${REQUIREMENTS_MIN} characters; you have ${requirements.length}).`;
  } else if (requirements.length > REQUIREMENTS_MAX) {
    errors.requirements = `Please keep this under ${REQUIREMENTS_MAX} characters (you have ${requirements.length}).`;
  }

  if (tutor.paused) errors.form = `${tutor.name} is not accepting bookings right now.`;

  return errors;
}
