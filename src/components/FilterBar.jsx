import { useState } from 'react';
import { LEVELS, SUBJECTS } from '../data/levels.js';
import { PRICE_LIMITS, SORT_OPTIONS } from '../utils/filtering.js';
import { formatPKR } from '../utils/format.js';

// A controlled form: every input's value comes from the `filters` prop, and every
// change is sent UP to the page through the onChange callback prop.
export default function FilterBar({ filters, onChange, onClear, hasActiveFilters, activeCount }) {
  const [open, setOpen] = useState(false); // used on small screens only

  function handleField(event) {
    const { name, type, value, checked } = event.target;
    onChange({ [name]: type === 'checkbox' ? checked : value });
  }

  return (
    <form className="filter-bar" role="search" aria-label="Search and filter tutors" onSubmit={(event) => event.preventDefault()}>
      <div className="filter-top">
        <div className="field">
          <label htmlFor="filter-q">Search</label>
          <input
            id="filter-q"
            name="q"
            type="search"
            placeholder="Name, subject, city or keyword"
            value={filters.q}
            onChange={handleField}
          />
        </div>
        {/* Mobile only: keeps the results near the top of a small screen */}
        <button
          type="button"
          className="btn btn-secondary btn-small filter-toggle"
          aria-expanded={open}
          aria-controls="filter-fields"
          onClick={() => setOpen((previous) => !previous)}
        >
          {open ? 'Hide filters' : `Show filters and sorting${activeCount > 0 ? ` (${activeCount} active)` : ''}`}
        </button>
      </div>

      <div id="filter-fields" className={`filter-fields${open ? ' open' : ''}`}>
        <div className="field">
          <label htmlFor="filter-subject">Subject</label>
          <select id="filter-subject" name="subject" value={filters.subject} onChange={handleField}>
            <option value="">Any subject</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-level">Education level</label>
          <select id="filter-level" name="level" value={filters.level} onChange={handleField}>
            <option value="">Any level</option>
            {LEVELS.map((level) => (
              <option key={level.id} value={level.id}>{level.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-rate">Maximum price per hour</label>
          <select id="filter-rate" name="maxRate" value={filters.maxRate} onChange={handleField}>
            <option value="">Any price</option>
            {PRICE_LIMITS.map((limit) => (
              <option key={limit} value={limit}>Up to {formatPKR(limit)}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-sort">Sort by</label>
          <select id="filter-sort" name="sort" value={filters.sort} onChange={handleField}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <label className="inline-label">
            <input type="checkbox" name="acceptingOnly" checked={filters.acceptingOnly} onChange={handleField} />
            Only tutors accepting bookings
          </label>
          <button type="button" className="btn btn-quiet btn-small" onClick={onClear} disabled={!hasActiveFilters}>
            Clear filters
          </button>
        </div>
      </div>
    </form>
  );
}
