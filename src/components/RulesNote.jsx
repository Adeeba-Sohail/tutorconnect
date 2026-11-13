import { MAX_BOOKINGS_PER_SLOT } from '../rules/capacityRule.js';
import { DISCOUNT_RATE, DISCOUNT_THRESHOLD_MINUTES } from '../rules/pricingRule.js';

// The three operating rules in plain words, shown before a student commits.
export default function RulesNote() {
  return (
    <section className="card rules-note" aria-labelledby="rules-heading">
      <h2 id="rules-heading">Good to know before you book</h2>
      <ul>
        <li><strong>Limited places:</strong> each tutor takes at most {MAX_BOOKINGS_PER_SLOT} bookings per date and time slot.</li>
        <li><strong>Your level matters:</strong> you can only book tutors who teach your education level.</li>
        <li><strong>Longer sessions cost less per hour:</strong> sessions over {DISCOUNT_THRESHOLD_MINUTES} minutes get {DISCOUNT_RATE * 100}% off.</li>
      </ul>
    </section>
  );
}
