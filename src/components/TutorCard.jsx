import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import ShortlistButton from './ShortlistButton.jsx';
import { getLevelLabel } from '../data/levels.js';
import { DISCOUNT_RATE, DISCOUNT_THRESHOLD_MINUTES } from '../rules/pricingRule.js';
import { formatDateShort } from '../utils/dates.js';
import { formatPKR, formatTime } from '../utils/format.js';

// One tutor in a list. It only DISPLAYS data it receives through props.
// Price, discount and next free slot are shown here so students can compare
// options BEFORE opening a profile.
export default function TutorCard({ tutor, nextSlot, isShortlisted, onToggleShortlist }) {
  let availability;
  if (tutor.paused) availability = <span className="badge badge-warning">Not accepting bookings</span>;
  else if (nextSlot) availability = <span className="badge badge-success">Next free: {formatDateShort(nextSlot.date)}, {formatTime(nextSlot.time)}</span>;
  else availability = <span className="badge badge-warning">No free slots in the next 30 days</span>;

  return (
    <article className="card tutor-card">
      <div className="tutor-card-head">
        <Avatar name={tutor.name} photo={tutor.photo} />
        <div className="tutor-card-title">
          <h3>
            <Link to={`/tutors/${tutor.id}`}>{tutor.name}</Link>
          </h3>
          <p className="muted clamp-2">{tutor.title}</p>
        </div>
      </div>

      <ul className="chip-list" aria-label="Subjects">
        {tutor.subjects.map((subject) => (
          <li key={subject} className="chip">{subject}</li>
        ))}
      </ul>

      <dl className="facts">
        <div>
          <dt>Levels</dt>
          <dd>{getLevelLabel(tutor.levelFrom)} to {getLevelLabel(tutor.levelTo)}</dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>{tutor.experienceYears} {tutor.experienceYears === 1 ? 'year' : 'years'}</dd>
        </div>
        <div>
          <dt>Qualification</dt>
          {/* Same row on every card; a fallback keeps cards comparable when data is missing */}
          <dd className="clamp-2">{tutor.qualifications[0] ?? 'Not listed yet'}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>★ {tutor.rating.toFixed(1)} ({tutor.reviewCount} reviews)</dd>
        </div>
      </dl>

      <p className="availability-line">{availability}</p>

      <div className="card-footer">
        <p className="price">
          <strong>{formatPKR(tutor.hourlyRate)}</strong> <span className="muted">/ hour</span>
          <span className="price-note">{DISCOUNT_RATE * 100}% off sessions over {DISCOUNT_THRESHOLD_MINUTES} min</span>
        </p>
        <div className="card-actions">
          <ShortlistButton tutorName={tutor.name} isShortlisted={isShortlisted} onToggle={() => onToggleShortlist(tutor.id)} />
          <Link className="btn btn-primary btn-small" to={`/tutors/${tutor.id}`}>
            View profile
          </Link>
        </div>
      </div>
    </article>
  );
}
