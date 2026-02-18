import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PrayerTimes from './pages/PrayerTimes';
import Quran from './pages/Quran';
import Adhkar from './pages/Adhkar';
import Tracker from './pages/Tracker';
import Stories from './pages/Stories';
import Settings from './pages/Settings';
import Login from './pages/Login';
import DownloadPage from './pages/Download';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PrayerProvider } from './contexts/PrayerContext';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prayer-times" element={<PrayerTimes />} />
        <Route path="/quran" element={<Quran />} />
        <Route path="/adhkar" element={<Adhkar />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PrayerProvider>
          <Router>
            <MainApp />
          </Router>
        </PrayerProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;