

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';
import toast from 'react-hot-toast';

// This component now handles the auth callback from the external site.
const Login: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            try {
                // Process the token to set the auth state.
                // Navigation will be handled by the App component once the user state is confirmed.
                loginWithToken(token);
            } catch (err: any) {
                const errorMessage = err.message || 'Invalid login token. Please try again.';
                toast.error(errorMessage);
                setError(errorMessage);
                // Redirect home on error after a delay
                setTimeout(() => navigate('/', { replace: true }), 3000);
            }
        } else {
            const errorMessage = 'Login token not found in URL.';
            toast.error(errorMessage);
            setError(errorMessage);
            // Redirect home on error after a delay
            setTimeout(() => navigate('/', { replace: true }), 3000);
        }
        // The dependency array ensures this runs only once when the component mounts.
    }, [searchParams, loginWithToken, navigate]);

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
                {error ? (
                    <>
                        <h2 className="text-2xl font-bold text-red-600">Login Failed</h2>
                        <p className="text-slate-500">{error}</p>
                        <p className="text-slate-500 text-sm mt-4">Redirecting to homepage...</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-slate-900">Finalizing Login</h2>
                        <Spinner />
                        <p className="text-slate-500">Please wait while we securely log you in...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
