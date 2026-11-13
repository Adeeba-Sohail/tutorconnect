import { useEffect, useState } from 'react';

// Works like useState, but the value is also saved in the browser's localStorage
// and restored when the page is opened again.
//   key        : the name under which the value is saved
//   initial    : value to use when nothing valid is saved
//   sanitize   : optional function that checks restored data and fixes or rejects it
export default function useLocalStorage(key, initial, sanitize) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved === null) return initial;
      const parsed = JSON.parse(saved);
      return sanitize ? sanitize(parsed, initial) : parsed;
    } catch {
      return initial; // storage blocked or JSON damaged: start fresh instead of crashing
    }
  });

  // Effect: runs after every change to `value` to keep storage in sync.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked (private mode): the app still works without saving.
    }
  }, [key, value]);

  return [value, setValue];
}
