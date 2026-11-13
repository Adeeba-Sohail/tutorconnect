import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { DEFAULT_DEMO_SETTINGS, DEMO_STORAGE_KEY } from '../services/demoSettings.js';

const DemoContext = createContext(null);

export function DemoProvider({ children }) {
  const [demo, setDemo] = useLocalStorage(DEMO_STORAGE_KEY, DEFAULT_DEMO_SETTINGS, (saved, fallback) => ({
    ...fallback,
    ...saved,
  }));

  const setLoadMode = useCallback(
    (loadMode) => setDemo((previous) => ({ ...previous, loadMode })),
    [setDemo],
  );

  const resetDemo = useCallback(() => setDemo(DEFAULT_DEMO_SETTINGS), [setDemo]);

  // Simulates "other students booked this slot": adds `count` extra bookings.
  const addExtraBookings = useCallback(
    (tutorId, date, time, count) =>
      setDemo((previous) => ({
        ...previous,
        extraBookings: [
          ...previous.extraBookings,
          ...Array.from({ length: count }, (_, index) => ({
            id: `demo-${tutorId}-${date}-${time}-${previous.extraBookings.length + index}`,
            tutorId,
            date,
            time,
            simulated: true,
          })),
        ],
      })),
    [setDemo],
  );

  // Simulates a tutor who stops accepting bookings (and can be switched back).
  const togglePaused = useCallback(
    (tutorId) =>
      setDemo((previous) => ({
        ...previous,
        pausedTutorIds: previous.pausedTutorIds.includes(tutorId)
          ? previous.pausedTutorIds.filter((id) => id !== tutorId)
          : [...previous.pausedTutorIds, tutorId],
      })),
    [setDemo],
  );

  const value = useMemo(
    () => ({ demo, setLoadMode, resetDemo, addExtraBookings, togglePaused }),
    [demo, setLoadMode, resetDemo, addExtraBookings, togglePaused],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside <DemoProvider>');
  return context;
}
