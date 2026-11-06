import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastProvider } from './components/shared/ToastProvider';
import { SettingsProvider } from './lib/SettingsProvider';
import { I18nProvider } from './i18n/I18nProvider';
import LotusLoader from './brand/LotusLoader';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const History = lazy(() => import('./pages/History'));
const Leadership = lazy(() => import('./pages/Leadership'));
const Board = lazy(() => import('./pages/Board'));
const Office = lazy(() => import('./pages/Office'));
const Institutions = lazy(() => import('./pages/Institutions'));
const InstitutionProfile = lazy(() => import('./pages/InstitutionProfile'));
const Results = lazy(() => import('./pages/Results'));
const Competition = lazy(() => import('./pages/Competition'));
const Magazine = lazy(() => import('./pages/Magazine'));
const Notices = lazy(() => import('./pages/Notices'));
const Downloads = lazy(() => import('./pages/Downloads'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// The admin dashboard is loaded separately and is not linked anywhere on the public site.
const AdminApp = lazy(() => import('./admin/AdminApp'));

const App: React.FC = () => (
  <Router>
      <I18nProvider>
        <ToastProvider>
          <SettingsProvider>
            <Routes>
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<LotusLoader label="Opening dashboard…" />}>
                    <AdminApp />
                  </Suspense>
                }
              />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="about/history" element={<History />} />
                <Route path="about/leadership" element={<Leadership />} />
                <Route path="about/board" element={<Board />} />
                <Route path="about/office" element={<Office />} />
                <Route path="institutions" element={<Institutions />} />
                <Route path="institutions/:category" element={<Institutions />} />
                <Route path="institutions/:category/:slug" element={<InstitutionProfile />} />
                <Route path="results" element={<Results />} />
                <Route path="competition" element={<Competition />} />
                <Route path="vikas-magazine" element={<Magazine />} />
                <Route path="notices" element={<Notices />} />
                <Route path="downloads" element={<Downloads />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </SettingsProvider>
        </ToastProvider>
      </I18nProvider>
  </Router>
);

export default App;
