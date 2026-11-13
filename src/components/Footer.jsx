import DemoPanel from './DemoPanel.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-note">
          <strong>TutorConnect is a fictional academic project.</strong> All tutors, prices and
          bookings are simulated. No payments are taken and nothing is sent to a server. Please use
          fictional names and emails.
        </p>
        <DemoPanel />
      </div>
    </footer>
  );
}
