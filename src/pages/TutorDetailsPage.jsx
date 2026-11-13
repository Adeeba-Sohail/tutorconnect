import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import AvailabilityOverview from '../components/AvailabilityOverview.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PriceTable from '../components/PriceTable.jsx';
import RulesNote from '../components/RulesNote.jsx';
import ShortlistButton from '../components/ShortlistButton.jsx';
import TutorDataGate from '../components/TutorDataGate.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { useTutorData } from '../context/TutorDataContext.jsx';
import { getLevelLabel } from '../data/levels.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { formatPKR } from '../utils/format.js';
import { weekdayName } from '../utils/dates.js';

function TutorProfile() {
  const { tutorId } = useParams(); // the :tutorId part of /tutors/:tutorId
  const { tutors } = useTutorData();
  const { isShortlisted, toggle } = useShortlist();
  const { allBookings, now } = useBooking();
  const tutor = tutors.find((item) => item.id === tutorId);

  useDocumentTitle(tutor ? tutor.name : 'Tutor not found');

  // Invalid ID in the URL: explain and offer a way forward.
  if (!tutor) {
    return (
      <EmptyState title="We could not find that tutor">
        <p>
          There is no tutor with the ID “{tutorId}”. The link may be old or mistyped.
        </p>
        <Link className="btn btn-primary" to="/tutors">Browse all tutors</Link>
      </EmptyState>
    );
  }

  return (
    <article className="profile">
      <p><Link to="/tutors">← Back to all tutors</Link></p>

      <header className="profile-head">
        <Avatar name={tutor.name} photo={tutor.photo} size="large" />
        <div>
          <h1>{tutor.name}</h1>
          <p className="lead">{tutor.title}</p>
          <p className="muted">
            ★ {tutor.rating.toFixed(1)} ({tutor.reviewCount} reviews) · {tutor.experienceYears} years of
            experience · Based in {tutor.city}, teaches online
          </p>
        </div>
      </header>

      {/* Main action first, so it is visible without scrolling (also on mobile) */}
      <div className="profile-actions">
        {tutor.paused ? (
          <button type="button" className="btn btn-primary" disabled>Booking unavailable</button>
        ) : (
          <Link className="btn btn-primary" to={`/book/${tutor.id}`}>Book a session</Link>
        )}
        <ShortlistButton tutorName={tutor.name} isShortlisted={isShortlisted(tutor.id)} onToggle={() => toggle(tutor.id)} />
      </div>

      <div className="profile-layout">
        <div className="profile-main">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading">About</h2>
            {/* Fallback text when the record has no biography */}
            <p>{tutor.bio || 'This tutor has not added a biography yet.'}</p>
            {tutor.teachingStyle && (
              <p><strong>Teaching style:</strong> {tutor.teachingStyle}</p>
            )}
          </section>

          <section aria-labelledby="quals-heading">
            <h2 id="quals-heading">Qualifications</h2>
            {tutor.qualifications.length > 0 ? (
              <ul>
                {tutor.qualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Qualifications have not been listed yet.</p>
            )}
          </section>

          <section aria-labelledby="prices-heading">
            <h2 id="prices-heading">Prices</h2>
            <PriceTable hourlyRate={tutor.hourlyRate} />
          </section>

          <section aria-labelledby="availability-heading">
            <h2 id="availability-heading">Upcoming availability</h2>
            <AvailabilityOverview tutor={tutor} bookings={allBookings} now={now} />
          </section>

          <RulesNote />
        </div>

        <aside className="card profile-side" aria-label="Tutor summary">
          <h2>Summary</h2>
          {tutor.paused && <p className="badge badge-warning">Not accepting bookings right now</p>}
          <dl className="facts facts-stacked">
            <div><dt>Price</dt><dd>{formatPKR(tutor.hourlyRate)} per hour</dd></div>
            <div><dt>Subjects</dt><dd>{tutor.subjects.join(', ')}</dd></div>
            <div><dt>Levels</dt><dd>{getLevelLabel(tutor.levelFrom)} to {getLevelLabel(tutor.levelTo)}</dd></div>
            <div><dt>Languages</dt><dd>{tutor.languages.length > 0 ? tutor.languages.join(', ') : 'Not listed'}</dd></div>
            <div><dt>Teaching days</dt><dd>{tutor.availableDays.map((day) => weekdayName(day).slice(0, 3)).join(', ')}</dd></div>
          </dl>

        </aside>
      </div>
    </article>
  );
}

export default function TutorDetailsPage() {
  return (
    <div className="container">
      <TutorDataGate>
        <TutorProfile />
      </TutorDataGate>
    </div>
  );
}
