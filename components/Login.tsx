import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';
import toast from 'react-hot-toast';

// This component handles the auth callback from the external site.
const Login: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { user, loginWithToken } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const token = searchParams.get('token');
        
        // Only process token if we don't have a user yet
        if (token && !user) {
            try {
                loginWithToken(token);
                // The component will re-render when the `user` state from context updates.
                // The navigation is now handled declaratively in the return statement.
            } catch (e: any) {
                const errorMessage = e.message || 'Invalid login token. Please try again.';
                toast.error(errorMessage);
                setError(errorMessage);
            }
        } else if (!token && !user) {
            const errorMessage = 'Login token not found.';
            toast.error(errorMessage);
            setError(errorMessage);
        } else if (user) {
            // User is already logged in, no need to process, just redirect.
            setIsProcessing(false);
        }

    }, [searchParams, loginWithToken, user]);

    // If there was an error during token processing, redirect to the home page.
    if (error) {
        return <Navigate to="/" replace />;
    }

    // Once the user object is available in the context (either from the token or existing session),
    // redirect to the dashboard or the intended page.
    if (user) {
        const redirectTo = searchParams.get('redirect_to') || '/dashboard';
        if (isProcessing) { // Only show toast on initial successful login
             toast.success('Logged in successfully!');
        }
        return <Navigate to={redirectTo} replace />;
    }

    // While waiting for the token to be processed and user state to update, show a spinner.
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-slate-900">Finalizing Login</h2>
                <Spinner />
                <p className="text-slate-500">Please wait while we securely log you in...</p>
            </div>
        </div>
    );
};

export default Login;