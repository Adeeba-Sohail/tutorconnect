// Shows each filter that is switched on, with a button to remove just that one.
export default function ActiveFilters({ filters, onRemove }) {
  if (filters.length === 0) return null;
  return (
    <ul className="chip-list active-filters" aria-label="Active filters">
      {filters.map((filter) => (
        <li key={filter.key}>
          <button type="button" className="chip chip-button" onClick={() => onRemove(filter.key)} aria-label={`Remove filter ${filter.label}`}>
            {filter.label} <span aria-hidden="true">✕</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
