// Shown when loading fails. The Retry button is the main action.
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-box state-error" role="alert">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Try again
      </button>
      <p className="hint">
        Marking note: if the failure was switched on in “Demo controls” (page footer), choose “Load
        normally” there before retrying.
      </p>
    </div>
  );
}
