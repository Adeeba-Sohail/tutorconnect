import { MAX_BOOKINGS_PER_SLOT } from '../rules/capacityRule.js';
import { formatTime } from '../utils/format.js';

// Radio buttons for the time slots of one date. Full or past slots are disabled
// AND say why in text.
export default function SlotPicker({ slots, selectedTime, onSelect, error, hasDate, teachesOnDate }) {
  let message = null;
  if (!hasDate) message = 'Choose a date first to see the available times.';
  else if (!teachesOnDate) message = 'This tutor does not teach on the chosen date. Choose another date.';

  return (
    <fieldset className="field slot-picker" id="field-time" tabIndex={-1} aria-describedby="time-help time-error">
      <legend>Time slot</legend>
      <p id="time-help" className="field-help">
        Each slot takes up to {MAX_BOOKINGS_PER_SLOT} bookings. Times are Pakistan Standard Time.
      </p>

      {message && <p className="field-help">{message}</p>}

      <div className="slot-grid">
        {slots.map((slot) => {
          const unavailable = !slot.selectable;
          let note = slot.message;
          if (slot.past) note = 'Already passed';
          else if (slot.status === 'full') note = 'Full';
          else if (slot.status === 'last-place') note = 'Last place left';
          else note = `${slot.remaining} places left`;

          return (
            <label key={slot.time} className={`slot${unavailable ? ' slot-unavailable' : ''}${selectedTime === slot.time ? ' slot-selected' : ''}`}>
              <input
                type="radio"
                name="time"
                value={slot.time}
                checked={selectedTime === slot.time}
                disabled={unavailable}
                onChange={() => onSelect(slot.time)}
              />
              <span className="slot-time">{formatTime(slot.time)}</span>
              <span className="slot-note">{note}</span>
            </label>
          );
        })}
      </div>

      <p id="time-error" className="field-error" role="alert">{error}</p>
    </fieldset>
  );
}
