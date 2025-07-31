
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { useAppContext } from './context/AppContext';

import Login from './components/Login'; // This is now the AuthCallback
import Dashboard from './components/Dashboard';
import Test from './components/Test';
import Results from './components/Results';
import Certificate from './components/Certificate';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage'; // The main storefront
import Spinner from './components/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { isInitializing } = useAppContext();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Spinner />
          <p className="mt-4 text-slate-500">Preparing Application...</p>
      </div>
    );
  }

  if (!user) {
    // If the user is not logged in, redirect to the landing page.
    // Pass the intended destination in the state so the landing page can be context-aware.
    return <Navigate to="/" replace state={{ from: location, needsLogin: true }} />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
    // The post-login navigation logic has been moved to Login.tsx to fix race conditions.
    // This component is now only responsible for rendering the main layout and routes.
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
            <Header />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<Login />} />
                    
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/test/:examId" element={<ProtectedRoute><Test /></ProtectedRoute>} />
                    <Route path="/results/:testId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
                    <Route path="/certificate/sample" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
                    <Route path="/certificate/:testId" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
                
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
            <AppContent />
            <Toaster position="top-right" reverseOrder={false} />
        </HashRouter>
    </AuthProvider>
  );
};
export default App;
