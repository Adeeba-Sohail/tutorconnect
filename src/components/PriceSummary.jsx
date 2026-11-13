import { DISCOUNT_RATE, DISCOUNT_THRESHOLD_MINUTES } from '../rules/pricingRule.js';
import { formatDateLong } from '../utils/dates.js';
import { formatDuration, formatPKR, formatTime } from '../utils/format.js';

// Live summary of the booking. Every value is DERIVED from the form + rules;
// nothing here is stored separately.
export default function PriceSummary({ tutor, form, price }) {
  return (
    <section className="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading">Booking summary</h2>
      <dl className="summary-list">
        <div><dt>Tutor</dt><dd>{tutor.name}</dd></div>
        <div><dt>Subject</dt><dd>{form.subject || 'Not chosen yet'}</dd></div>
        <div><dt>Date</dt><dd>{form.date ? formatDateLong(form.date) : 'Not chosen yet'}</dd></div>
        <div><dt>Time</dt><dd>{form.time ? formatTime(form.time) : 'Not chosen yet'}</dd></div>
        <div><dt>Length</dt><dd>{price ? formatDuration(price.durationMinutes) : 'Not chosen yet'}</dd></div>
      </dl>

      {price ? (
        <dl className="summary-list summary-price">
          <div><dt>Rate</dt><dd>{formatPKR(tutor.hourlyRate)} / hour</dd></div>
          <div><dt>Session price</dt><dd>{formatPKR(price.baseAmount)}</dd></div>
          {price.discountApplied ? (
            <div className="summary-discount">
              <dt>Discount ({DISCOUNT_RATE * 100}% for sessions over {DISCOUNT_THRESHOLD_MINUTES} min)</dt>
              <dd>− {formatPKR(price.discountAmount)}</dd>
            </div>
          ) : (
            <div>
              <dt>Discount</dt>
              <dd>None</dd>
            </div>
          )}
          <div className="summary-total"><dt>Total</dt><dd>{formatPKR(price.total)}</dd></div>
        </dl>
      ) : (
        <p className="muted">Choose a session length to see the price.</p>
      )}

      {price && !price.discountApplied && (
        <p className="hint">
          Sessions longer than {DISCOUNT_THRESHOLD_MINUTES} minutes (90 or 120) get {DISCOUNT_RATE * 100}% off.
        </p>
      )}
      <p className="hint">Simulation only: no payment is taken.</p>
    </section>
  );
}
