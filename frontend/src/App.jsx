import { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardPage from './pages/DashboardPage';
import LogSymptomsPage from './pages/LogSymptomsPage';
import SymptomHistoryPage from './pages/SymptomHistoryPage';
import HealthAnalyticsPage from './pages/HealthAnalyticsPage';
import AboutPage from './pages/AboutPage';
import { usePatientSymptoms } from './hooks/usePatientSymptoms';
import { DEMO_PATIENT_ID } from './utils/severity';

const PAGE_METADATA = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Overview of recorded symptoms and 30-day severity trends',
  },
  '/log': {
    title: 'Log Symptoms',
    subtitle: 'Record a new symptom entry with severity rating',
  },
  '/history': {
    title: 'Symptom History',
    subtitle: 'Chronological symptom log timeline',
  },
  '/analytics': {
    title: 'Health Analytics',
    subtitle: '30-day daily average symptom severity patterns',
  },
  '/about': {
    title: 'About HealthTrack',
    subtitle: 'Platform guide, severity scale, and medical disclaimer',
  },
};

function AppShell() {
  const [patientId, setPatientId] = useState(DEMO_PATIENT_ID);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { symptoms, trends, metrics, loading, error, refresh } =
    usePatientSymptoms(patientId);

  const meta = PAGE_METADATA[location.pathname] || PAGE_METADATA['/'];

  const handleSymptomCreated = (savedRecord) => {
    if (savedRecord?.patientId && savedRecord.patientId !== patientId) {
      setPatientId(savedRecord.patientId);
    } else {
      refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          key={patientId}
          title={meta.title}
          subtitle={meta.subtitle}
          patientId={patientId}
          onPatientIdChange={setPatientId}
          onRefresh={refresh}
          isRefreshing={loading}
          onOpenMenu={() => setMobileMenuOpen(true)}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  patientId={patientId}
                  symptoms={symptoms}
                  trends={trends}
                  metrics={metrics}
                  loading={loading}
                  error={error}
                  onRefresh={refresh}
                />
              }
            />
            <Route
              path="/log"
              element={
                <LogSymptomsPage
                  patientId={patientId}
                  onSymptomCreated={handleSymptomCreated}
                />
              }
            />
            <Route
              path="/history"
              element={
                <SymptomHistoryPage
                  patientId={patientId}
                  symptoms={symptoms}
                  loading={loading}
                  error={error}
                  onRefresh={refresh}
                />
              }
            />
            <Route
              path="/analytics"
              element={
                <HealthAnalyticsPage
                  patientId={patientId}
                  trends={trends}
                  loading={loading}
                  error={error}
                  onRefresh={refresh}
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
