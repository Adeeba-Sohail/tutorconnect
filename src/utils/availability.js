// Works out which time slots exist, which are full, and which are in the past.
// It uses the capacity rule (max 4 bookings per slot) from src/rules.
import { checkSlotCapacity, countBookingsForSlot } from '../rules/capacityRule.js';
import { addDays, parseDateKey, toDateKey } from './dates.js';

export const BOOKING_WINDOW_DAYS = 30; // students can book up to 30 days ahead

export function tutorTeachesOn(tutor, dateKey) {
  return tutor.availableDays.includes(parseDateKey(dateKey).getDay());
}

export function isSlotInPast(dateKey, time, now) {
  const [hour, minute] = time.split(':').map(Number);
  const start = parseDateKey(dateKey);
  start.setHours(hour, minute, 0, 0);
  return start <= now;
}

// One entry per time slot of the tutor on a given date.
export function getSlotsForDate(tutor, dateKey, bookings, now) {
  if (!tutorTeachesOn(tutor, dateKey)) return [];

  return tutor.timeSlots.map((time) => {
    const capacity = checkSlotCapacity(countBookingsForSlot(bookings, tutor.id, dateKey, time));
    const past = isSlotInPast(dateKey, time, now);
    return {
      time,
      ...capacity, // allowed, status, booked, remaining, message
      past,
      selectable: capacity.allowed && !past && !tutor.paused,
    };
  });
}

// The next 7 (or more) dates the tutor teaches, for the availability overview.
export function getTeachingDates(tutor, now, daysToLook = BOOKING_WINDOW_DAYS) {
  const dates = [];
  for (let offset = 0; offset <= daysToLook; offset += 1) {
    const dateKey = toDateKey(addDays(now, offset));
    if (tutorTeachesOn(tutor, dateKey)) dates.push(dateKey);
  }
  return dates;
}

export function getNextAvailableSlot(tutor, bookings, now) {
  if (tutor.paused) return null;
  for (const date of getTeachingDates(tutor, now)) {
    const open = getSlotsForDate(tutor, date, bookings, now).find((slot) => slot.selectable);
    if (open) return { date, time: open.time, remaining: open.remaining };
  }
  return null;
}
