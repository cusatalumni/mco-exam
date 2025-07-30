

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
import LandingPage from './components/LandingPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // This could redirect to a login page, but our flow directs from the page itself.
    // So, redirecting to home is a safe fallback.
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // This effect handles the redirection after a successful login.
        // It waits until the user object is populated before navigating away
        // from the auth callback page, thus fixing the race condition.
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
            <main className="flex-grow container mx-auto px-4 py-8">
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
