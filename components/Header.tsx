

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { LogOut, UserCircle, LogIn } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { activeOrg } = useAppContext();

  const handleLogout = () => {
    logout();
    // Redirect to a dedicated logout endpoint on the external site for a clean SSO session termination
    window.location.href = 'https://www.coding-online.net/app-logout';
  };

  const headerLink = user ? "/dashboard" : "/";
  // Always send a default redirect path to ensure a smooth return.
  const loginLink = `https://www.coding-online.net/app-login?redirect_to=${encodeURIComponent('/dashboard')}`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {activeOrg ? (
            <Link to={headerLink} className="flex items-center space-x-3">
                 <img
                    src={activeOrg.logo}
                    alt={`${activeOrg.name} Logo`}
                    className="h-14 w-14 object-contain"
                />
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-900 font-serif">
                        {activeOrg.name}
                    </span>
                    <span className="text-md text-slate-500 font-serif">
                        {activeOrg.website}
                    </span>
                </div>
            </Link>
        ) : (
             <div className="flex items-center space-x-3">
                 <div className="h-14 w-14 bg-slate-200 rounded-full animate-pulse"></div>
                 <div className="flex flex-col">
                    <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                 </div>
             </div>
        )}
       
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2 text-slate-600">
                <UserCircle size={20} />
                <span className="hidden sm:inline">Welcome, {user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
             <a
                href={loginLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                <LogIn size={16} />
                <span>Login / Register</span>
              </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;