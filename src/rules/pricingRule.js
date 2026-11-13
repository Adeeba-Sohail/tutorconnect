// RULE 3 (pricing)
// Sessions LONGER than 60 minutes get a 10% discount. Exactly 60 does not.

export const DISCOUNT_THRESHOLD_MINUTES = 60;
export const DISCOUNT_RATE = 0.1;
export const DURATION_OPTIONS = [30, 45, 60, 90, 120];

export function isValidDuration(minutes) {
  return DURATION_OPTIONS.includes(minutes);
}

export function calculateSessionPrice(hourlyRate, durationMinutes) {
  if (!(hourlyRate > 0) || !isValidDuration(durationMinutes)) {
    return null;
  }

  const baseAmount = Math.round((hourlyRate * durationMinutes) / 60);
  const discountApplied = durationMinutes > DISCOUNT_THRESHOLD_MINUTES;
  const discountAmount = discountApplied ? Math.round(baseAmount * DISCOUNT_RATE) : 0;

  return {
    durationMinutes,
    baseAmount,
    discountApplied,
    discountRate: discountApplied ? DISCOUNT_RATE : 0,
    discountAmount,
    total: baseAmount - discountAmount,
  };
}
