

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './components/Login'; // This is now the AuthCallback
import Dashboard from './components/Dashboard';
import Test from './components/Test';
import Results from './components/Results';
import Certificate from './components/Certificate';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage'; // The main storefront

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Save the user's intended destination to construct a smart login link.
    // In this restored version, we might not need a dedicated redirect component,
    // but the logic remains sound if we wanted to show a "please log in" modal.
    return <Navigate to="/" replace state={{ from: location, needsLogin: true }} />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user && location.pathname === '/auth') {
            const params = new URLSearchParams(location.search);
            const redirectPath = params.get('redirect_to') || '/dashboard';
            
            toast.success('Logged in successfully!');
            navigate(redirectPath, { replace: true });
        }
    }, [user, location.pathname, location.search, navigate]);

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
