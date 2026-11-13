import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

// Shared page frame: skip link + header + page content + footer.
export default function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const isFirstRender = useRef(true);

  // After navigating to a new page, scroll to top and move keyboard focus to the
  // page content so keyboard and screen-reader users start at the top.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="page" tabIndex={-1} ref={mainRef}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
