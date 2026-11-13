import { useEffect, useState } from 'react';

// Returns the current time and refreshes it every minute, so "past slot"
// checks stay correct if the page is left open.
export default function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timerId); // cleanup: stop the timer when unmounting
  }, [intervalMs]);

  return now;
}
