// Shared booking state: the unfinished booking (draft), confirmed bookings, and
// the combined list of ALL bookings used by the capacity rule.
import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import useNow from '../hooks/useNow.js';
import { isValidDuration } from '../rules/pricingRule.js';
import { buildSeedBookings } from '../services/seedBookings.js';
import { toDateKey } from '../utils/dates.js';
import { useDemo } from './DemoContext.jsx';
import { useTutorData } from './TutorDataContext.jsx';

const BookingContext = createContext(null);
const DRAFT_KEY = 'tutorconnect.bookingDraft';
const BOOKINGS_KEY = 'tutorconnect.bookings';

function sanitizeDraft(saved) {
  if (!saved || typeof saved !== 'object' || typeof saved.tutorId !== 'string') return null;
  const text = (value) => (typeof value === 'string' ? value : '');
  return {
    tutorId: saved.tutorId,
    level: text(saved.level),
    subject: text(saved.subject),
    date: text(saved.date),
    time: text(saved.time),
    duration: isValidDuration(saved.duration) ? saved.duration : 60,
  };
}

function sanitizeBookings(saved) {
  return Array.isArray(saved) ? saved.filter((item) => item && typeof item.reference === 'string') : [];
}

export function BookingProvider({ children }) {
  const { tutors } = useTutorData();
  const { demo } = useDemo();
  const now = useNow();
  const [draft, setDraft] = useLocalStorage(DRAFT_KEY, null, sanitizeDraft);
  const [bookings, setBookings] = useLocalStorage(BOOKINGS_KEY, [], sanitizeBookings);

  const today = toDateKey(now);
  // Simulated bookings by other students. Rebuilt when the tutors or the day change.
  const seedBookings = useMemo(() => buildSeedBookings(tutors, new Date(`${today}T00:00`)), [tutors, today]);

  // One list for the capacity rule: seeded + demo-panel + the student's own bookings.
  const allBookings = useMemo(
    () => [...seedBookings, ...demo.extraBookings, ...bookings],
    [seedBookings, demo.extraBookings, bookings],
  );

  const saveDraft = useCallback((nextDraft) => setDraft(nextDraft), [setDraft]);
  const clearDraft = useCallback(() => setDraft(null), [setDraft]);

  // Called from the shortlist: start a booking for a tutor, keeping the level the student already chose.
  const startBooking = useCallback(
    (tutorId, duration) =>
      setDraft((previous) => ({
        tutorId,
        level: previous?.level ?? '',
        subject: '',
        date: '',
        time: '',
        duration,
      })),
    [setDraft],
  );

  const addBooking = useCallback((booking) => setBookings((previous) => [...previous, booking]), [setBookings]);
  const clearBookings = useCallback(() => setBookings([]), [setBookings]);
  const getBooking = useCallback((reference) => bookings.find((item) => item.reference === reference), [bookings]);

  const value = useMemo(
    () => ({ now, draft, saveDraft, clearDraft, startBooking, bookings, allBookings, addBooking, clearBookings, getBooking }),
    [now, draft, saveDraft, clearDraft, startBooking, bookings, allBookings, addBooking, clearBookings, getBooking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used inside <BookingProvider>');
  return context;
}
