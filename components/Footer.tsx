

import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-slate-500 text-sm">
        <div className="flex justify-center items-center space-x-4 mb-2">
            <Link to="/instructions" className="text-cyan-600 hover:underline">Instructions</Link>
            <span className="text-slate-300">|</span>
            <Link to="/integration" className="text-cyan-600 hover:underline">WordPress Integration</Link>
            <span className="text-slate-300">|</span>
            <a href="https://annapoornainfo.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">Privacy Policy</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Medical Coding Online by Annapoorna Examination App. All Rights Reserved.</p>
        <p>An <a href="https://annapoornainfo.com" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">Annapoorna Infotech</a> Venture.</p>
      </div>
    </footer>
  );
};

export default Footer;