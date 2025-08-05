



import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './components/Login'; // This is now the AuthCallback
import Dashboard from './components/Dashboard';
import Test from './components/Test';
import Results from './components/Results';
import Certificate from './components/Certificate';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Instructions from './components/Instructions';
import Integration from './components/Integration';
import SuggestedBooksSidebar from './components/SuggestedBooksSidebar';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
    const location = useLocation();
    const showSidebar = ['/dashboard', '/results'].some(path => location.pathname.startsWith(path));

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
            <Header />
            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <main className="w-full lg:flex-grow">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/auth" element={<Login />} />
                            <Route path="/instructions" element={<Instructions />} />
                            <Route path="/integration" element={<Integration />} />
                            
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/test/:examId" element={<ProtectedRoute><Test /></ProtectedRoute>} />
                            <Route path="/results/:testId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
                            <Route path="/certificate/sample" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
                            <Route path="/certificate/:testId" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
                        
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                    {showSidebar && (
                        <aside className="lg:w-1/3 lg:max-w-sm flex-shrink-0">
                            <SuggestedBooksSidebar />
                        </aside>
                    )}
                </div>
            </div>
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