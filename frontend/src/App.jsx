
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthProvider';
import RootLayout from './layout/RootLayout.jsx';
import Dashboard from './pages/DashboardPage.jsx';
import Map from './pages/MapPage.jsx';
import Settings from './pages/SettingsPage.jsx';
import Intro from './pages/IntroPage.jsx';
import Login from './pages/auth/LoginPage.jsx';
import RegisterFlow from './pages/auth/RegisterFlow.jsx';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) return <Intro />;

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterFlow />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<RootLayout />} >
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<Map />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
