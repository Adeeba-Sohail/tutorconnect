// The student's shortlist: tutors saved for later. Saved in localStorage.
// Each item is { tutorId, duration } so the student can also choose a preferred
// session length per saved tutor.
import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { isValidDuration } from '../rules/pricingRule.js';
import { useTutorData } from './TutorDataContext.jsx';

const ShortlistContext = createContext(null);
const STORAGE_KEY = 'tutorconnect.shortlist';

// Restored data may be old or damaged, so keep only well-formed, unique items.
function sanitizeShortlist(saved) {
  if (!Array.isArray(saved)) return [];
  const seen = new Set();
  return saved
    .filter((item) => item && typeof item.tutorId === 'string' && !seen.has(item.tutorId) && seen.add(item.tutorId))
    .map((item) => ({ tutorId: item.tutorId, duration: isValidDuration(item.duration) ? item.duration : 60 }));
}

export function ShortlistProvider({ children }) {
  const { tutors, status } = useTutorData();
  const [items, setItems] = useLocalStorage(STORAGE_KEY, [], sanitizeShortlist);

  // Functional updates (previous => next) because the new list depends on the old one.
  const toggle = useCallback(
    (tutorId) =>
      setItems((previous) =>
        previous.some((item) => item.tutorId === tutorId)
          ? previous.filter((item) => item.tutorId !== tutorId)
          : [...previous, { tutorId, duration: 60 }],
      ),
    [setItems],
  );

  const remove = useCallback(
    (tutorId) => setItems((previous) => previous.filter((item) => item.tutorId !== tutorId)),
    [setItems],
  );

  const setDuration = useCallback(
    (tutorId, duration) =>
      setItems((previous) => previous.map((item) => (item.tutorId === tutorId ? { ...item, duration } : item))),
    [setItems],
  );

  const clear = useCallback(() => setItems([]), [setItems]);

  // Derived: attach the current tutor record to each saved item (null if the
  // tutor is no longer in the data).
  const entries = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        tutor: status === 'success' ? tutors.find((tutor) => tutor.id === item.tutorId) ?? null : null,
      })),
    [items, tutors, status],
  );

  const value = useMemo(
    () => ({
      items,
      entries,
      count: items.length,
      isShortlisted: (tutorId) => items.some((item) => item.tutorId === tutorId),
      toggle,
      remove,
      setDuration,
      clear,
    }),
    [items, entries, toggle, remove, setDuration, clear],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (!context) throw new Error('useShortlist must be used inside <ShortlistProvider>');
  return context;
}
