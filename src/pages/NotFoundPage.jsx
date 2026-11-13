import { Link, useLocation } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

// Shown for any URL that matches no route.
export default function NotFoundPage() {
  const { pathname } = useLocation();
  useDocumentTitle('Page not found');

  return (
    <div className="container">
      <EmptyState title="Page not found">
        <p>There is no page at <code>{pathname}</code>.</p>
        <div className="button-row">
          <Link className="btn btn-primary" to="/tutors">Find a tutor</Link>
          <Link className="btn btn-secondary" to="/">Go to the home page</Link>
        </div>
      </EmptyState>
    </div>
  );
}
