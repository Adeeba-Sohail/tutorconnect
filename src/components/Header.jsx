import { Link, NavLink } from 'react-router-dom';
import { useShortlist } from '../context/ShortlistContext.jsx';

export default function Header() {
  const { count } = useShortlist();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="TutorConnect home">
          <span className="brand-mark" aria-hidden="true">TC</span>
          <span className="brand-name">TutorConnect</span>
        </Link>
        <nav aria-label="Main navigation">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end>Home</NavLink>
            </li>
            <li>
              <NavLink to="/tutors">Find Tutors</NavLink>
            </li>
            <li>
              <NavLink to="/shortlist">Shortlist ({count})</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
