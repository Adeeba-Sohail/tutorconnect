import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { getLevelLabel } from '../data/levels.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { DISCOUNT_RATE } from '../rules/pricingRule.js';
import { formatDateLong } from '../utils/dates.js';
import { formatDuration, formatPKR, formatTime } from '../utils/format.js';

// The final screen of the journey. The booking is looked up by its reference,
// so refreshing the page still works (bookings are saved in localStorage).
export default function ConfirmationPage() {
  const { reference } = useParams();
  const { getBooking } = useBooking();
  const booking = getBooking(reference);
  useDocumentTitle(booking ? 'Booking confirmed' : 'Booking not found');

  if (!booking) {
    return (
      <div className="container">
        <EmptyState title="We could not find that booking">
          <p>There is no simulated booking with the reference “{reference}” in this browser.</p>
          <Link className="btn btn-primary" to="/tutors">Find a tutor</Link>
        </EmptyState>
      </div>
    );
  }

  const { price } = booking;
  return (
    <div className="container confirmation">
      <div className="alert alert-success" role="status">
        <h1>Booking confirmed (simulated)</h1>
        <p>
          Your reference is <strong className="reference">{booking.reference}</strong>. No payment was
          taken and no real session was arranged.
        </p>
      </div>

      <div className="card">
        <h2>Session details</h2>
        <dl className="summary-list">
          <div><dt>Tutor</dt><dd>{booking.tutorName}</dd></div>
          <div><dt>Subject</dt><dd>{booking.subject}</dd></div>
          <div><dt>Date</dt><dd>{formatDateLong(booking.date)}</dd></div>
          <div><dt>Time</dt><dd>{formatTime(booking.time)} (Pakistan Standard Time)</dd></div>
          <div><dt>Length</dt><dd>{formatDuration(price.durationMinutes)}</dd></div>
          <div><dt>Student</dt><dd>{booking.studentName} ({booking.email})</dd></div>
          <div><dt>Education level</dt><dd>{getLevelLabel(booking.level)}</dd></div>
          <div><dt>Learning requirements</dt><dd className="wrap-text">{booking.requirements}</dd></div>
        </dl>

        <h2>Price</h2>
        <dl className="summary-list summary-price">
          <div><dt>Session price</dt><dd>{formatPKR(price.baseAmount)}</dd></div>
          {price.discountApplied && (
            <div className="summary-discount"><dt>Discount ({DISCOUNT_RATE * 100}%)</dt><dd>− {formatPKR(price.discountAmount)}</dd></div>
          )}
          <div className="summary-total"><dt>Total</dt><dd>{formatPKR(price.total)}</dd></div>
        </dl>
      </div>

      <div className="button-row">
        <Link className="btn btn-primary" to="/tutors">Book another session</Link>
        <Link className="btn btn-secondary" to="/">Back to home</Link>
      </div>
    </div>
  );
}
