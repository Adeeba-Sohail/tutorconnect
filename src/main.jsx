import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { BookingProvider } from './context/BookingContext.jsx';
import { DemoProvider } from './context/DemoContext.jsx';
import { ShortlistProvider } from './context/ShortlistContext.jsx';
import { TutorDataProvider } from './context/TutorDataContext.jsx';
import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DemoProvider>
        <TutorDataProvider>
          <ShortlistProvider>
            <BookingProvider>
              <App />
            </BookingProvider>
          </ShortlistProvider>
        </TutorDataProvider>
      </DemoProvider>
    </BrowserRouter>
  </StrictMode>,
);
