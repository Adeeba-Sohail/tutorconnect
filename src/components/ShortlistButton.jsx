// Toggle button. aria-pressed tells screen readers whether the tutor is saved,
// and the visible text changes too, so colour is never the only signal.
export default function ShortlistButton({ tutorName, isShortlisted, onToggle }) {
  return (
    <button
      type="button"
      className="btn btn-secondary btn-small"
      aria-pressed={isShortlisted}
      aria-label={`${isShortlisted ? 'Remove' : 'Save'} ${tutorName} ${isShortlisted ? 'from' : 'to'} shortlist`}
      onClick={onToggle}
    >
      {isShortlisted ? '★ Saved' : '☆ Save'}
    </button>
  );
}
