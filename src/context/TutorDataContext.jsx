// Loads the tutor list through the mock loader and shares it with every page.
// status is one of: 'loading' | 'success' | 'error'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadTutors } from '../services/mockLoader.js';
import { useDemo } from './DemoContext.jsx';

const TutorDataContext = createContext(null);

export function TutorDataProvider({ children }) {
  const { demo } = useDemo();
  const [rawTutors, setRawTutors] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [attempt, setAttempt] = useState(0); // changing this number triggers a new load

  useEffect(() => {
    let ignore = false; // becomes true if the component unmounts or a newer load starts

    async function load() {
      try {
        const data = await loadTutors();
        if (!ignore) {
          setRawTutors(data);
          setStatus('success');
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
          setStatus('error');
        }
      }
    }
    load();

    // Cleanup: ignore the result of an outdated request.
    return () => {
      ignore = true;
    };
  }, [attempt]);

  // Retry button: show the loading state again and start a new load.
  const reload = useCallback(() => {
    setStatus('loading');
    setErrorMessage('');
    setAttempt((previous) => previous + 1);
  }, []);

  // Derived value: add a `paused` flag to tutors the demo panel has paused.
  const tutors = useMemo(
    () =>
      rawTutors.map((tutor) => ({
        ...tutor,
        paused: demo.pausedTutorIds.includes(tutor.id),
      })),
    [rawTutors, demo.pausedTutorIds],
  );

  const value = useMemo(
    () => ({ tutors, status, errorMessage, reload }),
    [tutors, status, errorMessage, reload],
  );

  return <TutorDataContext.Provider value={value}>{children}</TutorDataContext.Provider>;
}

export function useTutorData() {
  const context = useContext(TutorDataContext);
  if (!context) throw new Error('useTutorData must be used inside <TutorDataProvider>');
  return context;
}
