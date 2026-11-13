// Pretend "other students" have already booked some slots, so the capacity rule
// can be seen working (a few slots are already FULL or almost full).
// The dates are calculated from today so the demo never goes out of date.
import { addDays, toDateKey } from '../utils/dates.js';
import { tutorTeachesOn } from '../utils/availability.js';

// count 4 = full slot, count 3 = one place left
const SEED_PLAN = [
  { tutorId: 't01', slotIndex: 0, count: 4 },
  { tutorId: 't01', slotIndex: 1, count: 3 },
  { tutorId: 't02', slotIndex: 0, count: 2 },
  { tutorId: 't03', slotIndex: 0, count: 4 },
  { tutorId: 't04', slotIndex: 0, count: 4 },
  { tutorId: 't05', slotIndex: 1, count: 3 },
  { tutorId: 't09', slotIndex: 0, count: 3 },
];

function firstTeachingDateFromTomorrow(tutor, now) {
  for (let offset = 1; offset <= 14; offset += 1) {
    const dateKey = toDateKey(addDays(now, offset));
    if (tutorTeachesOn(tutor, dateKey)) return dateKey;
  }
  return null;
}

export function buildSeedBookings(tutors, now) {
  const bookings = [];
  SEED_PLAN.forEach(({ tutorId, slotIndex, count }) => {
    const tutor = tutors.find((item) => item.id === tutorId);
    if (!tutor) return;
    const date = firstTeachingDateFromTomorrow(tutor, now);
    const time = tutor.timeSlots[slotIndex];
    if (!date || !time) return;
    for (let number = 1; number <= count; number += 1) {
      bookings.push({ id: `seed-${tutorId}-${date}-${time}-${number}`, tutorId, date, time, simulated: true });
    }
  });
  return bookings;
}
