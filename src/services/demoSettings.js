// Demo / testing settings, stored in localStorage so they survive a refresh.
// They exist ONLY so the loading-failure and changed-availability edge cases
// can be demonstrated. They are shown in the "Demo controls" panel in the footer.
export const DEMO_STORAGE_KEY = 'tutorconnect.demo';

export const DEFAULT_DEMO_SETTINGS = {
  loadMode: 'normal', // 'normal' | 'fail' | 'empty'
  extraBookings: [], // simulated bookings added by the demo panel
  pausedTutorIds: [], // tutors temporarily marked "not accepting bookings"
};

export function getDemoSettings() {
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return DEFAULT_DEMO_SETTINGS;
    return { ...DEFAULT_DEMO_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DEMO_SETTINGS; // blocked or corrupted storage: use defaults
  }
}
