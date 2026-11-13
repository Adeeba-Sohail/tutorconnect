// A friendly message with a next action. `children` holds the action buttons/links.
export default function EmptyState({ title, children }) {
  return (
    <div className="state-box state-empty">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
