import { useTutorData } from '../context/TutorDataContext.jsx';
import LoadingState from './LoadingState.jsx';
import ErrorState from './ErrorState.jsx';

// Wrap any page content that needs tutor data. It shows the loading or error
// screen first and only renders its children once the data has arrived.
export default function TutorDataGate({ children }) {
  const { status, errorMessage, reload } = useTutorData();

  if (status === 'loading') return <LoadingState />;
  if (status === 'error') return <ErrorState message={errorMessage} onRetry={reload} />;
  return children;
}
