import { useBooking } from '../context/BookingContext.jsx';
import { useDemo } from '../context/DemoContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { useTutorData } from '../context/TutorDataContext.jsx';
import { MAX_BOOKINGS_PER_SLOT, countBookingsForSlot } from '../rules/capacityRule.js';

// Clearly labelled controls used to demonstrate edge cases to the marker.
// They are not part of the real customer journey.
export default function DemoPanel() {
  const { demo, setLoadMode, resetDemo, addExtraBookings, togglePaused } = useDemo();
  const { reload, tutors } = useTutorData();
  const { draft, allBookings, clearDraft, clearBookings } = useBooking();
  const { clear: clearShortlist, toggle: toggleShortlist, isShortlisted } = useShortlist();

  const draftTutor = draft ? tutors.find((tutor) => tutor.id === draft.tutorId) : undefined;
  const draftHasSlot = Boolean(draft?.tutorId && draft.date && draft.time);

  function handleFillSlot() {
    const booked = countBookingsForSlot(allBookings, draft.tutorId, draft.date, draft.time);
    const missing = MAX_BOOKINGS_PER_SLOT - booked;
    if (missing > 0) addExtraBookings(draft.tutorId, draft.date, draft.time, missing);
  }

  function handleResetEverything() {
    resetDemo();
    clearShortlist();
    clearBookings();
    clearDraft();
  }

  return (
    <details className="demo-panel">
      <summary>Demo controls (for testing and marking)</summary>
      <div className="demo-body">
        <fieldset>
          <legend>Next tutor-list load</legend>
          {[
            ['normal', 'Load normally'],
            ['fail', 'Simulate a loading failure'],
            ['empty', 'Simulate an empty tutor list'],
          ].map(([value, label]) => (
            <label key={value} className="inline-label">
              <input type="radio" name="loadMode" value={value} checked={demo.loadMode === value} onChange={(event) => setLoadMode(event.target.value)} />
              {label}
            </label>
          ))}
          <button type="button" className="btn btn-secondary btn-small" onClick={reload}>
            Reload tutor data now
          </button>
        </fieldset>

        <fieldset>
          <legend>Change availability of my saved booking</legend>
          <p className="hint">
            Choose a tutor, date and time on the booking page first. Then use these buttons to make
            that saved choice invalid (switch pages or refresh to see the recovery message).
          </p>
          <div className="demo-actions">
            <button type="button" className="btn btn-secondary btn-small" disabled={!draftHasSlot} onClick={handleFillSlot}>
              Fill my saved time slot ({MAX_BOOKINGS_PER_SLOT} of {MAX_BOOKINGS_PER_SLOT})
            </button>
            <button type="button" className="btn btn-secondary btn-small" disabled={!draftTutor} onClick={() => togglePaused(draftTutor.id)}>
              {draftTutor?.paused ? 'Make my saved tutor available again' : 'Mark my saved tutor unavailable'}
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend>Restored shortlist with a removed tutor</legend>
          <div className="demo-actions">
            <button type="button" className="btn btn-secondary btn-small" onClick={() => toggleShortlist('t99')}>
              {isShortlisted('t99') ? 'Remove the fake saved tutor (ID t99)' : 'Add a saved tutor that no longer exists (ID t99)'}
            </button>
          </div>
        </fieldset>

        <div className="demo-actions">
          <button type="button" className="btn btn-quiet btn-small" onClick={resetDemo}>
            Reset demo settings only
          </button>
          <button type="button" className="btn btn-quiet btn-small" onClick={handleResetEverything}>
            Reset ALL saved data (shortlist, draft, bookings, demo)
          </button>
        </div>
      </div>
    </details>
  );
}
