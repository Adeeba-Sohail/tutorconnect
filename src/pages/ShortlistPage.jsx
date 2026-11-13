import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import TutorDataGate from '../components/TutorDataGate.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { DISCOUNT_RATE, DURATION_OPTIONS, calculateSessionPrice } from '../rules/pricingRule.js';
import { formatDuration, formatPKR } from '../utils/format.js';

function ShortlistContent() {
  const navigate = useNavigate();
  const { entries, remove, setDuration, clear } = useShortlist();
  const { startBooking } = useBooking();

  if (entries.length === 0) {
    return (
      <EmptyState title="Your shortlist is empty">
        <p>Save tutors with the “Save” button to compare them here.</p>
        <Link className="btn btn-primary" to="/tutors">Find a tutor</Link>
      </EmptyState>
    );
  }

  const missing = entries.filter((entry) => !entry.tutor);
  const available = entries.filter((entry) => entry.tutor);

  function handleBook(entry) {
    startBooking(entry.tutorId, entry.duration);
    navigate(`/book/${entry.tutorId}`);
  }

  return (
    <>
      {missing.length > 0 && (
        <div className="alert alert-warning" role="alert">
          <h2>{missing.length} saved {missing.length === 1 ? 'tutor is' : 'tutors are'} no longer listed</h2>
          <p>They cannot be booked right now. Remove them, or try again later.</p>
          <ul>
            {missing.map((entry) => (
              <li key={entry.tutorId}>
                Tutor ID {entry.tutorId}{' '}
                <button type="button" className="btn btn-quiet btn-small" onClick={() => remove(entry.tutorId)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="shortlist">
        {available.map(({ tutor, duration }) => {
          const price = calculateSessionPrice(tutor.hourlyRate, duration);
          return (
            <li key={tutor.id} className="card shortlist-item">
              <div className="tutor-card-head">
                <Avatar name={tutor.name} photo={tutor.photo} />
                <div className="tutor-card-title">
                  <h2><Link to={`/tutors/${tutor.id}`}>{tutor.name}</Link></h2>
                  <p className="muted">{tutor.subjects.join(', ')} · {formatPKR(tutor.hourlyRate)} / hour</p>
                  {tutor.paused && <p className="badge badge-warning">Not accepting bookings right now</p>}
                </div>
              </div>

              <div className="field">
                <label htmlFor={`duration-${tutor.id}`}>Preferred session length</label>
                <select id={`duration-${tutor.id}`} value={duration} onChange={(event) => setDuration(tutor.id, Number(event.target.value))}>
                  {DURATION_OPTIONS.map((minutes) => (
                    <option key={minutes} value={minutes}>{formatDuration(minutes)}</option>
                  ))}
                </select>
              </div>

              <p className="price">
                Estimated price: <strong>{price ? formatPKR(price.total) : '—'}</strong>
                {price?.discountApplied && <span className="muted"> ({DISCOUNT_RATE * 100}% discount included)</span>}
              </p>

              <div className="button-row">
                <button type="button" className="btn btn-primary btn-small" onClick={() => handleBook({ tutorId: tutor.id, duration })} disabled={tutor.paused}>
                  Book a session
                </button>
                <button type="button" className="btn btn-quiet btn-small" onClick={() => remove(tutor.id)}>
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <button type="button" className="btn btn-quiet" onClick={clear}>Clear whole shortlist</button>
    </>
  );
}

export default function ShortlistPage() {
  useDocumentTitle('Your shortlist');
  return (
    <div className="container">
      <h1>Your shortlist</h1>
      <TutorDataGate>
        <ShortlistContent />
      </TutorDataGate>
    </div>
  );
}
