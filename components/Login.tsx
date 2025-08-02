import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';
import toast from 'react-hot-toast';

// This component now handles the auth callback from the external site.
const Login: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const redirectTo = searchParams.get('redirect_to') || '/dashboard';

        if (token) {
            try {
                loginWithToken(token);
                toast.success('Logged in successfully!');
                navigate(redirectTo, { replace: true });
            } catch (error: any) {
                toast.error(error.message || 'Invalid login token. Please try again.');
                console.error("Token processing error:", error);
                navigate('/', { replace: true });
            }
        } else {
            toast.error('Login token not found.');
            navigate('/', { replace: true });
        }
    }, [searchParams, loginWithToken, navigate]);

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