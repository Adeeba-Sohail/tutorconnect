import { Link } from 'react-router-dom';
import RulesNote from '../components/RulesNote.jsx';
import TutorDataGate from '../components/TutorDataGate.jsx';
import TutorCard from '../components/TutorCard.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { useTutorData } from '../context/TutorDataContext.jsx';
import { LEVELS } from '../data/levels.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { getNextAvailableSlot } from '../utils/availability.js';
import { sortTutors } from '../utils/filtering.js';

function FeaturedTutors() {
  const { tutors } = useTutorData();
  const { isShortlisted, toggle } = useShortlist();
  const { allBookings, now } = useBooking();
  const featured = sortTutors(tutors, 'recommended').slice(0, 3);

  if (featured.length === 0) return null;
  return (
    <section className="section" aria-labelledby="featured-heading">
      <h2 id="featured-heading">Popular tutors this week</h2>
      <div className="grid grid-3">
        {featured.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} nextSlot={getNextAvailableSlot(tutor, allBookings, now)} isShortlisted={isShortlisted(tutor.id)} onToggleShortlist={toggle} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  useDocumentTitle('Online tutoring for students in Pakistan');

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">One-to-one online tutoring across Pakistan</p>
            <h1>Find the right tutor and book a session in minutes</h1>
            <p className="lead">
              Compare tutors for Primary to first-year university, check their prices and open time
              slots, and book an online session in PKR.
            </p>
            <div className="button-row">
              <Link className="btn btn-primary" to="/tutors">Find a tutor</Link>
            </div>
            <p className="hint">Simulation: no real tutors, payments or bookings.</p>
          </div>
          <svg className="hero-art" viewBox="0 0 220 160" aria-hidden="true" focusable="false">
            <rect x="10" y="20" width="200" height="120" rx="14" fill="#ffffff" stroke="#b9d3ea" strokeWidth="2" />
            <rect x="28" y="40" width="90" height="10" rx="5" fill="#9bc0e3" />
            <rect x="28" y="60" width="140" height="8" rx="4" fill="#dbe9f6" />
            <rect x="28" y="76" width="120" height="8" rx="4" fill="#dbe9f6" />
            <circle cx="168" cy="108" r="20" fill="#2f6fa8" />
            <path d="m158 108 7 7 13-14" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="28" y="104" width="70" height="20" rx="10" fill="#f3ece0" />
          </svg>
        </div>
      </section>

      <div className="container">
        <section className="section" aria-labelledby="how-heading">
          <h2 id="how-heading">How it works</h2>
          <ol className="steps">
            <li><strong>Search</strong> by subject, level and budget.</li>
            <li><strong>Compare</strong> profiles, prices and open time slots.</li>
            <li><strong>Book</strong> a session and get a booking reference.</li>
          </ol>
        </section>

        <section className="section">
          <RulesNote />
        </section>

        <section className="section" aria-labelledby="levels-heading">
          <h2 id="levels-heading">Browse by education level</h2>
          <ul className="chip-list chip-list-large">
            {LEVELS.map((level) => (
              <li key={level.id}>
                <Link className="chip chip-link" to={`/tutors?level=${level.id}`}>
                  {level.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <TutorDataGate>
          <FeaturedTutors />
        </TutorDataGate>
      </div>
    </>
  );
}
