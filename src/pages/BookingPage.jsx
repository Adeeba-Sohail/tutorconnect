import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import PriceSummary from '../components/PriceSummary.jsx';
import SlotPicker from '../components/SlotPicker.jsx';
import TutorDataGate from '../components/TutorDataGate.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { useTutorData } from '../context/TutorDataContext.jsx';
import { LEVELS, getLevelLabel } from '../data/levels.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { checkLevelEligibility } from '../rules/eligibilityRule.js';
import { DISCOUNT_RATE, DISCOUNT_THRESHOLD_MINUTES, DURATION_OPTIONS, calculateSessionPrice } from '../rules/pricingRule.js';
import { BOOKING_WINDOW_DAYS, getSlotsForDate, tutorTeachesOn } from '../utils/availability.js';
import { addDays, isValidDateKey, toDateKey } from '../utils/dates.js';
import { formatDuration, formatPKR } from '../utils/format.js';
import { FIELD_LABELS, FIELD_ORDER, REQUIREMENTS_MAX, validateBooking } from '../utils/validation.js';

// Made outside the component because the time is read only when a booking is created.
function createBookingMeta() {
  const timestamp = Date.now();
  return {
    reference: `TC-${timestamp.toString(36).toUpperCase()}`,
    createdAt: new Date(timestamp).toISOString(),
  };
}

function BookingForm({ tutor }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { now, allBookings, draft, saveDraft, clearDraft, addBooking } = useBooking();

  // Start from the saved draft only if it belongs to THIS tutor.
  const saved = draft && draft.tutorId === tutor.id ? draft : null;
  // A free slot chosen on the profile arrives as /book/:id?date=YYYY-MM-DD&time=HH:MM
  // It is used only if the date is real and the time is one of this tutor's slots.
  const presetDate = searchParams.get('date') ?? '';
  const presetTime = searchParams.get('time') ?? '';
  const hasPreset = isValidDateKey(presetDate) && tutor.timeSlots.includes(presetTime);
  const [form, setForm] = useState(() => ({
    studentName: '',
    email: '',
    level: saved?.level ?? '',
    subject: saved?.subject || (tutor.subjects.length === 1 ? tutor.subjects[0] : ''),
    date: hasPreset ? presetDate : saved?.date ?? '',
    time: hasPreset ? presetTime : saved?.time ?? '',
    duration: saved?.duration ?? 60,
    requirements: '',
  }));

  const [touched, setTouched] = useState({}); // fields the user has left
  const [submitted, setSubmitted] = useState(false);

  // Effect: save the NON-personal choices so a refresh does not lose them.
  // (Name, email and requirements are deliberately not saved.)
  useEffect(() => {
    saveDraft({
      tutorId: tutor.id,
      level: form.level,
      subject: form.subject,
      date: form.date,
      time: form.time,
      duration: form.duration,
    });
  }, [tutor.id, form.level, form.subject, form.date, form.time, form.duration, saveDraft]);

  // ----- Derived values (recalculated on every render, never stored) -----
  const allErrors = validateBooking(form, tutor, allBookings, now);
  const visibleErrors = {};
  FIELD_ORDER.forEach((field) => {
    if (allErrors[field] && (submitted || touched[field])) visibleErrors[field] = allErrors[field];
  });
  const errorList = FIELD_ORDER.filter((field) => visibleErrors[field]);

  // Choices that were restored from storage (or changed by new availability) and
  // are no longer valid. Explained straight away, even before the student touches them.
  const conflictFields = ['level', 'subject', 'date', 'time'].filter(
    (field) => form[field] && allErrors[field] && !visibleErrors[field],
  );

  const slots = form.date ? getSlotsForDate(tutor, form.date, allBookings, now) : [];
  const teachesOnDate = form.date ? tutorTeachesOn(tutor, form.date) : true;
  const price = calculateSessionPrice(tutor.hourlyRate, form.duration);
  const levelCheck = form.level ? checkLevelEligibility(tutor, form.level) : null;
  const minDate = toDateKey(now);
  const maxDate = toDateKey(addDays(now, BOOKING_WINDOW_DAYS));

  // ----- Event handlers -----
  function handleChange(event) {
    const { name, value } = event.target;
    // Copy the old form and replace one field (never change state directly).
    setForm((previous) => ({
      ...previous,
      [name]: name === 'duration' ? Number(value) : value,
      // A different date has different slots, so clear the chosen time.
      ...(name === 'date' ? { time: '' } : {}),
    }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));
  }

  function handleSlotSelect(time) {
    setForm((previous) => ({ ...previous, time }));
    setTouched((previous) => ({ ...previous, time: true }));
  }

  function focusField(field) {
    document.getElementById(`field-${field}`)?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setSubmitted(true);

    if (Object.keys(allErrors).length > 0) {
      const firstProblem = FIELD_ORDER.find((field) => allErrors[field]);
      if (firstProblem) focusField(firstProblem);
      return; // valid input stays in the form
    }

    const booking = {
      ...createBookingMeta(),
      tutorId: tutor.id,
      tutorName: tutor.name,
      hourlyRate: tutor.hourlyRate,
      studentName: form.studentName.trim(),
      email: form.email.trim(),
      level: form.level,
      subject: form.subject,
      date: form.date,
      time: form.time,
      requirements: form.requirements.trim(),
      price,
      simulated: true,
    };
    addBooking(booking);
    clearDraft();
    navigate(`/confirmation/${booking.reference}`);
  }

  function renderError(field) {
    return (
      <p id={`error-${field}`} className="field-error" role="alert">
        {visibleErrors[field]}
      </p>
    );
  }
  const ariaFor = (field, helpId) => ({
    'aria-invalid': visibleErrors[field] ? 'true' : 'false',
    'aria-describedby': [helpId, visibleErrors[field] ? `error-${field}` : null].filter(Boolean).join(' ') || undefined,
  });

  return (
    <div className="booking-layout">
      <form id="booking-form" className="booking-form" onSubmit={handleSubmit} noValidate>
        {(errorList.length > 0 || allErrors.form) && (
          <div className="alert alert-error" role="alert" aria-labelledby="error-summary-title">
            <h2 id="error-summary-title">Please fix {errorList.length || 1} {errorList.length === 1 ? 'problem' : 'problems'}</h2>
            {allErrors.form && <p>{allErrors.form}</p>}
            <ul>
              {errorList.map((field) => (
                <li key={field}>
                  <button type="button" className="link-button" onClick={() => focusField(field)}>
                    {FIELD_LABELS[field]}: {visibleErrors[field]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {conflictFields.length > 0 && (
          <div className="alert alert-warning" role="alert">
            <h2>Some of your earlier choices need to be changed</h2>
            <p>Availability or rules have changed since you made these choices:</p>
            <ul>
              {conflictFields.map((field) => (
                <li key={field}>
                  <button type="button" className="link-button" onClick={() => focusField(field)}>
                    {FIELD_LABELS[field]}: {allErrors[field]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset className="form-section">
          <legend>1. Student details</legend>
          <p className="hint">Simulation: please use a fictional name and email.</p>
          <div className="field">
            <label htmlFor="field-studentName">Student name</label>
            <input id="field-studentName" name="studentName" type="text" autoComplete="off" value={form.studentName} onChange={handleChange} onBlur={handleBlur} {...ariaFor('studentName')} />
            {renderError('studentName')}
          </div>
          <div className="field">
            <label htmlFor="field-email">Email address</label>
            <input id="field-email" name="email" type="email" autoComplete="off" value={form.email} onChange={handleChange} onBlur={handleBlur} {...ariaFor('email')} />
            {renderError('email')}
          </div>
          <div className="field">
            <label htmlFor="field-level">Education level</label>
            <select id="field-level" name="level" value={form.level} onChange={handleChange} onBlur={handleBlur} {...ariaFor('level', 'level-help')}>
              <option value="">Choose a level</option>
              {LEVELS.map((level) => (
                <option key={level.id} value={level.id}>{level.label}</option>
              ))}
            </select>
            <p id="level-help" className="field-help">
              {tutor.name} teaches {getLevelLabel(tutor.levelFrom)} to {getLevelLabel(tutor.levelTo)}.
              {levelCheck?.eligible && ' ✓ Your level is covered.'}
            </p>
            {renderError('level')}
          </div>
          <div className="field">
            <label htmlFor="field-subject">Subject</label>
            <select id="field-subject" name="subject" value={form.subject} onChange={handleChange} onBlur={handleBlur} {...ariaFor('subject')}>
              <option value="">Choose a subject</option>
              {tutor.subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            {renderError('subject')}
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>2. Date, time and length</legend>
          <div className="field">
            <label htmlFor="field-date">Date</label>
            <input id="field-date" name="date" type="date" min={minDate} max={maxDate} value={form.date} onChange={handleChange} onBlur={handleBlur} {...ariaFor('date', 'date-help')} />
            <p id="date-help" className="field-help">
              Teaches on: {tutor.availableDays.map((day) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')}. Bookings open {BOOKING_WINDOW_DAYS} days ahead.
            </p>
            {renderError('date')}
          </div>

          <SlotPicker slots={slots} selectedTime={form.time} onSelect={handleSlotSelect} error={visibleErrors.time} hasDate={Boolean(form.date)} teachesOnDate={teachesOnDate} />

          <div className="field">
            <label htmlFor="field-duration">Session length</label>
            <select id="field-duration" name="duration" value={form.duration} onChange={handleChange} onBlur={handleBlur} {...ariaFor('duration', 'duration-help')}>
              {DURATION_OPTIONS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {formatDuration(minutes)}{minutes > DISCOUNT_THRESHOLD_MINUTES ? ` (${DISCOUNT_RATE * 100}% off)` : ''}
                </option>
              ))}
            </select>
            <p id="duration-help" className="field-help">
              Sessions longer than {DISCOUNT_THRESHOLD_MINUTES} minutes get {DISCOUNT_RATE * 100}% off. Exactly {DISCOUNT_THRESHOLD_MINUTES} minutes does not.
            </p>
            {renderError('duration')}
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>3. Learning requirements</legend>
          <div className="field">
            <label htmlFor="field-requirements">What would you like help with?</label>
            <textarea id="field-requirements" name="requirements" value={form.requirements} onChange={handleChange} onBlur={handleBlur} {...ariaFor('requirements', 'requirements-help')} />
            <p id="requirements-help" className="field-help">
              {form.requirements.trim().length} / {REQUIREMENTS_MAX} characters
            </p>
            {renderError('requirements')}
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary desktop-submit">Confirm simulated booking</button>
          <Link className="btn btn-quiet" to={`/tutors/${tutor.id}`}>Cancel</Link>
        </div>
      </form>

      <aside className="card summary-card">
        <PriceSummary tutor={tutor} form={form} price={price} />
      </aside>

      {/* Small screens: total price and the main action stay visible while scrolling */}
      <div className="mobile-bar">
        <p className="mobile-bar-total">
          <span className="muted">Total</span> <strong>{price ? formatPKR(price.total) : '—'}</strong>
        </p>
        <button type="submit" form="booking-form" className="btn btn-primary">Confirm booking</button>
      </div>
    </div>
  );
}

function BookingContent() {
  const { tutorId } = useParams();
  const { tutors } = useTutorData();
  const tutor = tutors.find((item) => item.id === tutorId);
  useDocumentTitle(tutor ? `Book ${tutor.name}` : 'Tutor not found');

  if (!tutor) {
    return (
      <EmptyState title="We could not find that tutor">
        <p>You cannot book “{tutorId}” because no tutor has that ID.</p>
        <Link className="btn btn-primary" to="/tutors">Choose a tutor</Link>
      </EmptyState>
    );
  }

  return (
    <>
      <p><Link to={`/tutors/${tutor.id}`}>← Back to {tutor.name}</Link></p>
      <h1>Book a session with {tutor.name}</h1>
      <p className="muted">This is a simulated booking. No payment is taken.</p>
      {/* key makes React rebuild the form when the tutor changes */}
      <BookingForm key={tutor.id} tutor={tutor} />
    </>
  );
}

export default function BookingPage() {
  return (
    <div className="container">
      <TutorDataGate>
        <BookingContent />
      </TutorDataGate>
    </div>
  );
}
