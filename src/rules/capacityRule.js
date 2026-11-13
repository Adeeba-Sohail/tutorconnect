// RULE 1 (availability / capacity)
// A tutor accepts at most 4 bookings for the same date and time slot.
// This file is plain JavaScript with no React so Node's test runner can run it.

export const MAX_BOOKINGS_PER_SLOT = 4;

/**
 * Decide whether ONE MORE booking can be added to a slot.
 * @param {number} existingBookings how many bookings the slot already has
 * @param {number} [maxBookings=4]  the capacity limit
 * @returns {{allowed:boolean, status:string, booked:number, remaining:number, message:string}}
 */
export function checkSlotCapacity(existingBookings, maxBookings = MAX_BOOKINGS_PER_SLOT) {
  if (!Number.isInteger(existingBookings) || existingBookings < 0) {
    return {
      allowed: false,
      status: 'invalid',
      booked: 0,
      remaining: 0,
      message: 'The number of existing bookings must be a whole number, 0 or more.',
    };
  }

  const remaining = Math.max(maxBookings - existingBookings, 0);

  if (remaining === 0) {
    return {
      allowed: false,
      status: 'full',
      booked: existingBookings,
      remaining: 0,
      message: `This slot is full (${maxBookings} of ${maxBookings} places taken). Please choose another time.`,
    };
  }

  return {
    allowed: true,
    status: remaining === 1 ? 'last-place' : 'open',
    booked: existingBookings,
    remaining,
    message:
      remaining === 1
        ? 'Last place available for this slot.'
        : `${remaining} of ${maxBookings} places left.`,
  };
}

/** Count how many bookings already exist for one tutor, date and time. */
export function countBookingsForSlot(bookings, tutorId, date, time) {
  return bookings.filter(
    (booking) => booking.tutorId === tutorId && booking.date === date && booking.time === time,
  ).length;
}
