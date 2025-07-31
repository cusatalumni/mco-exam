

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';
import { ArrowRight, BarChart, CheckCircle, GraduationCap, Lock, PlayCircle, Award } from 'lucide-react';

const LandingPage: React.FC = () => {
    const { user, paidExamIds } = useAuth();
    const { activeOrg, isInitializing } = useAppContext();
    const navigate = useNavigate();

    if (isInitializing || !activeOrg) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Spinner />
                <p className="mt-4 text-slate-500">Loading Exams...</p>
            </div>
        );
    }
    
    const heroLoginLink = `https://www.coding-online.net/app-login?redirect_to=${encodeURIComponent('/dashboard')}`;

    const handlePracticeClick = (practiceExamId: string) => {
        if (user) {
            navigate(`/test/${practiceExamId}`);
        } else {
            const practiceLoginUrl = `https://www.coding-online.net/app-login?redirect_to=${encodeURIComponent('/test/' + practiceExamId)}`;
            window.open(practiceLoginUrl, '_blank');
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="text-center py-20 px-4 bg-white">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">Master Your Medical Coding Exams</h1>
                    <p className="text-lg text-slate-600 mb-8">
                        Our platform offers comprehensive practice exams to help you ace your certification. Log in to access your purchased tests.
                    </p>
                    <a
                        href={heroLoginLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                    >
                        <span>Get Started Now</span>
                        <ArrowRight size={18} />
                    </a>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="bg-slate-100 py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">Why Choose Us?</h2>
                     <p className="text-md text-center text-slate-500 max-w-2xl mx-auto mb-12">We provide the tools and insights you need to walk into your exam with confidence.</p>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <CheckCircle className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Realistic Exam Simulation</h3>
                            <p className="text-slate-600">Practice with exams that mirror the format, difficulty, and time constraints of the real certification tests.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <BarChart className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">AI-Powered Feedback</h3>
                            <p className="text-slate-600">Receive personalized study recommendations based on your performance to target your weak areas effectively.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <Award className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Printable Certificates</h3>
                            <p className="text-slate-600">Earn and share verifiable certificates upon successful completion of our paid certification exams.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Available Exams Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">Available Exams</h2>
                    <p className="text-md text-center text-slate-500 max-w-2xl mx-auto mb-12">Choose from our selection of practice and certification exams to test your skills and prepare for success.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {activeOrg.examProductCategories.map(category => {
                            const practiceExam = activeOrg.exams.find(e => e.id === category.practiceExamId);
                            const certExam = activeOrg.exams.find(e => e.id === category.certificationExamId);
                            if (!practiceExam || !certExam) return null;

                            const isPurchased = paidExamIds.includes(certExam.id);
                            
                            // NOTE: These purchase URLs should be updated to point to the correct WooCommerce product pages.
                             const purchaseUrl = `https://www.coding-online.net/product/${category.id.replace('prod-', '')}/`;

                            return (
                                <div key={category.id} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 grid grid-cols-1 gap-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">{category.name}</h3>
                                        <p className="text-slate-500 mt-2">{category.description}</p>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4 mt-auto pt-4">
                                        <button onClick={() => handlePracticeClick(practiceExam.id)} className="w-full flex justify-center items-center bg-slate-100 border border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 transition">
                                            <PlayCircle size={18} className="mr-2" />
                                            <span>{user ? 'Start Practice' : 'Login to Practice'}</span>
                                        </button>
                                         {isPurchased ? (
                                             <button onClick={() => navigate(`/test/${certExam.id}`)} className="w-full flex justify-center items-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition">
                                                <CheckCircle size={18} className="mr-2"/>
                                                <span>Start Certification</span>
                                            </button>
                                        ) : (
                                            <a href={purchaseUrl} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center items-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition">
                                                <Lock size={16} className="mr-2"/>
                                                <span>Purchase Exam</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
};

export default LandingPage;