import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import FindTutorsPage from './pages/FindTutorsPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ShortlistPage from './pages/ShortlistPage.jsx';
import TutorDetailsPage from './pages/TutorDetailsPage.jsx';

// Route table: which page is shown for which URL.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tutors" element={<FindTutorsPage />} />
        <Route path="tutors/:tutorId" element={<TutorDetailsPage />} />
        <Route path="book/:tutorId" element={<BookingPage />} />
        <Route path="confirmation/:reference" element={<ConfirmationPage />} />
        <Route path="shortlist" element={<ShortlistPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
