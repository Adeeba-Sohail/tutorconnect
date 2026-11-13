import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ActiveFilters from '../components/ActiveFilters.jsx';
import EmptyState from '../components/EmptyState.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ShortlistNotice from '../components/ShortlistNotice.jsx';
import TutorCard from '../components/TutorCard.jsx';
import TutorDataGate from '../components/TutorDataGate.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { useShortlist } from '../context/ShortlistContext.jsx';
import { useTutorData } from '../context/TutorDataContext.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { getNextAvailableSlot } from '../utils/availability.js';
import {
  DEFAULT_FILTERS,
  clearedValue,
  describeActiveFilters,
  filterTutors,
  filtersFromParams,
  getRelaxationSuggestions,
  paramsFromFilters,
  sortTutors,
} from '../utils/filtering.js';

function TutorResults() {
  const { tutors } = useTutorData();
  const { entries, isShortlisted, toggle } = useShortlist();
  const { allBookings, now } = useBooking();

  // The filters live in the URL (?q=...&level=...), not in component state.
  // The URL survives opening a profile and pressing Back, a refresh, and sharing a link.
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);

  // replace: true stops every keystroke from adding a new browser-history entry.
  function updateFilters(nextFilters) {
    setSearchParams(paramsFromFilters(nextFilters), { replace: true });
  }
  function handleFilterChange(changes) {
    updateFilters({ ...filters, ...changes });
  }
  function removeFilter(key) {
    updateFilters({ ...filters, [key]: clearedValue(key) });
  }
  function clearFilters() {
    updateFilters({ ...DEFAULT_FILTERS, sort: filters.sort });
  }

  const activeFilters = describeActiveFilters(filters);
  const hasActiveFilters = activeFilters.length > 0;

  // Derived values: recalculated from tutors + filters, never stored.
  const results = sortTutors(filterTutors(tutors, filters), filters.sort);
  const visibleIds = new Set(results.map((tutor) => tutor.id));
  const shortlistedTutors = entries.filter((entry) => entry.tutor).map((entry) => entry.tutor);

  return (
    <>
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        activeCount={activeFilters.length}
      />

      <ActiveFilters filters={activeFilters} onRemove={removeFilter} />

      <ShortlistNotice
        shortlistedTutors={shortlistedTutors}
        visibleIds={visibleIds}
        hasActiveFilters={hasActiveFilters}
        onShowAll={clearFilters}
      />

      <p className="result-count" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'tutor' : 'tutors'} found
      </p>

      {tutors.length === 0 ? (
        // Empty DATASET: nothing exists at all.
        <EmptyState title="No tutors are listed right now">
          <p>The tutor list is empty at the moment. Please check back later.</p>
        </EmptyState>
      ) : results.length === 0 ? (
        // No MATCHES: tutors exist, but not for this search. Offer ways forward.
        <NoMatches filters={filters} tutors={tutors} onRemove={removeFilter} onClear={clearFilters} />
      ) : (
        <div className="grid grid-3">
          {results.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              nextSlot={getNextAvailableSlot(tutor, allBookings, now)}
              isShortlisted={isShortlisted(tutor.id)}
              onToggleShortlist={toggle}
            />
          ))}
        </div>
      )}
    </>
  );
}

function NoMatches({ filters, tutors, onRemove, onClear }) {
  const suggestions = getRelaxationSuggestions(tutors, filters);
  return (
    <EmptyState title="No tutors match your search">
      <p>None of the {tutors.length} tutors fit all of your filters at once.</p>
      {suggestions.length > 0 && (
        <>
          <p><strong>Try removing one filter:</strong></p>
          <ul className="suggestion-list">
            {suggestions.map((suggestion) => (
              <li key={suggestion.key}>
                <button type="button" className="btn btn-secondary btn-small" onClick={() => onRemove(suggestion.key)}>
                  Remove “{suggestion.label}” ({suggestion.count} {suggestion.count === 1 ? 'tutor' : 'tutors'})
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <button type="button" className="btn btn-primary" onClick={onClear}>
        Clear all filters
      </button>
    </EmptyState>
  );
}

export default function FindTutorsPage() {
  useDocumentTitle('Find tutors');
  return (
    <div className="container">
      <h1>Find a tutor</h1>
      <TutorDataGate>
        <TutorResults />
      </TutorDataGate>
    </div>
  );
}
