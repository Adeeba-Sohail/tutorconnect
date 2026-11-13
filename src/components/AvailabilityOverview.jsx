import { Link } from 'react-router-dom';
import { MAX_BOOKINGS_PER_SLOT } from '../rules/capacityRule.js';
import { getSlotsForDate, getTeachingDates } from '../utils/availability.js';
import { formatDateShort } from '../utils/dates.js';
import { formatTime } from '../utils/format.js';

// "Who is free when" for the next few teaching days. Each free slot is a link that
// opens the booking form with that date and time already chosen, so the student
// can book directly (no message to the tutor is needed).
export default function AvailabilityOverview({ tutor, bookings, now, days = 5 }) {
  const dates = getTeachingDates(tutor, now).slice(0, days);

  if (tutor.paused) {
    return <p className="badge badge-warning">Not accepting bookings right now.</p>;
  }
  if (dates.length === 0) return <p>No teaching days in the next 30 days.</p>;

  return (
    <div className="availability">
      <p className="hint">
        Choose a free time to start booking. Each slot takes up to {MAX_BOOKINGS_PER_SLOT} bookings.
      </p>
      <ul className="availability-list">
        {dates.map((date) => (
          <li key={date}>
            <h3>{formatDateShort(date)}</h3>
            <ul className="availability-slots">
              {getSlotsForDate(tutor, date, bookings, now).map((slot) => {
                const note = slot.past ? 'passed' : slot.status === 'full' ? 'full' : `${slot.remaining} left`;
                return (
                  <li key={slot.time} className={slot.selectable ? '' : 'is-unavailable'}>
                    {slot.selectable ? (
                      <Link
                        className="slot-link"
                        to={`/book/${tutor.id}?date=${date}&time=${slot.time}`}
                        aria-label={`Book ${formatDateShort(date)} at ${formatTime(slot.time)}, ${note}`}
                      >
                        <span className="slot-time">{formatTime(slot.time)}</span>{' '}
                        <span className="slot-note">{note}</span>
                      </Link>
                    ) : (
                      <>
                        <span className="slot-time">{formatTime(slot.time)}</span>{' '}
                        <span className="slot-note">{note}</span>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}