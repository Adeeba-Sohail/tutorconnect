import { Link } from 'react-router-dom';

// Tells the student when saved tutors are hidden by the current search or filters,
// so a filter never makes a saved tutor silently "disappear".
export default function ShortlistNotice({ shortlistedTutors, visibleIds, onShowAll, hasActiveFilters }) {
  if (shortlistedTutors.length === 0) return null;

  const hidden = shortlistedTutors.filter((tutor) => !visibleIds.has(tutor.id));

  return (
    <div className={`alert ${hidden.length > 0 ? 'alert-warning' : 'alert-info'}`} role="status">
      <p>
        <strong>Your shortlist: {shortlistedTutors.length} saved.</strong>{' '}
        <Link to="/shortlist">View shortlist</Link>
      </p>
      {hidden.length > 0 && (
        <p>
          {hidden.length} saved {hidden.length === 1 ? 'tutor is' : 'tutors are'} hidden by your current
          search or filters: {hidden.map((tutor) => tutor.name).join(', ')}.{' '}
          {hasActiveFilters && (
            <button type="button" className="link-button" onClick={onShowAll}>Clear filters to see them</button>
          )}
        </p>
      )}
    </div>
  );
}
