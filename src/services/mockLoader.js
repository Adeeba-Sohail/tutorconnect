// Pretends to be a server. Real apps would call fetch(); here we wait a moment
// and then return the local data, so loading, error and retry states can be shown.
import { tutors } from '../data/tutors.js';
import { getDemoSettings } from './demoSettings.js';

const LOAD_DELAY_MS = 900;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function loadTutors() {
  await wait(LOAD_DELAY_MS);
  const { loadMode } = getDemoSettings();

  if (loadMode === 'fail') {
    throw new Error('We could not load the tutor list. (Simulated network failure)');
  }
  if (loadMode === 'empty') {
    return []; // simulates a catalogue with no records
  }
  // Return copies so no component can accidentally change the original data.
  return tutors.map((tutor) => ({ ...tutor }));
}
