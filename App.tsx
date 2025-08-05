
import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Test from './components/Test';
import Results from './components/Results';
import Certificate from './components/Certificate';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Instructions from './components/Instructions';
import Integration from './components/Integration';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Redirect to="/" />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Switch>
                    <Route path="/" exact>
                        <LandingPage />
                    </Route>
                    <Route path="/auth">
                        <Login />
                    </Route>
                    <Route path="/instructions">
                        <Instructions />
                    </Route>
                    <Route path="/integration">
                        <Integration />
                    </Route>
                    
                    <Route path="/dashboard">
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    </Route>
                    <Route path="/test/:examId">
                        <ProtectedRoute><Test /></ProtectedRoute>
                    </Route>
                    <Route path="/results/:testId">
                        <ProtectedRoute><Results /></ProtectedRoute>
                    </Route>
                    <Route path="/certificate/sample">
                        <ProtectedRoute><Certificate /></ProtectedRoute>
                    </Route>
                    <Route path="/certificate/:testId">
                        <ProtectedRoute><Certificate /></ProtectedRoute>
                    </Route>
                
                    <Route path="*">
                        <Redirect to="/" />
                    </Route>
                </Switch>
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
