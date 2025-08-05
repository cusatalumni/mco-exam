import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, BarChart, FileSignature, Lock, CheckCircle, PlayCircle, ArrowRight, ShoppingCart } from 'lucide-react';
import Spinner from './Spinner';
import toast from 'react-hot-toast';

const FeatureCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-3">
            <Icon className="text-cyan-500 mr-4" size={32} />
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-slate-600">{children}</p>
    </div>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, paidExamIds } = useAuth();
    const { activeOrg, isInitializing, examProducts } = useAppContext();
    
    // URLs from the WordPress integration guide for role-based redirection
    const prodAppUrl = 'https://exams.coding-online.net/';
    const adminAppUrl = 'https://mco-exam-jkfzdt3bj-manoj-balakrishnans-projects-aa177a85.vercel.app/';

    const loginUrl = `https://www.coding-online.net/exam-login/`;
    // Dynamically get the current app's base URL to ensure redirects work in any environment.
    const appUrl = window.location.origin + window.location.pathname;
    
    const appDashboardPath = '#/dashboard';
    const fullLoginUrl = `${loginUrl}?redirect_to=${encodeURIComponent(appUrl + appDashboardPath)}`;

    // Helper function to handle navigation for logged-in users, respecting admin/prod environments
    const handleNavigation = (path: string) => {
        if (!user) return;
        
        const targetBaseUrl = user.isAdmin ? adminAppUrl : prodAppUrl;
        const currentHostname = window.location.hostname;
        const targetHostname = new URL(targetBaseUrl).hostname;

        if (currentHostname === targetHostname) {
            navigate(path); // We are in the correct environment, use client-side routing
        } else {
            window.location.href = targetBaseUrl + '#' + path; // We need to switch environments, do a full redirect
        }
    };

    const handleStartPractice = (examId: string) => {
        if (!user) {
            toast.error("Please log in to take a practice test.");
            const practicePath = `#/test/${examId}`;
            // Construct a dynamic login URL that redirects back to the practice test on the current app instance.
            const practiceLoginUrl = `${loginUrl}?redirect_to=${encodeURIComponent(appUrl + practicePath)}`;
            window.location.href = practiceLoginUrl;
            return;
        }
        if (examId) {
            handleNavigation(`/test/${examId}`);
        } else {
            toast.error("Practice exam not configured for this product.");
        }
    };
    
    if (isInitializing || !activeOrg) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Spinner />
                <p className="mt-4 text-slate-500">Preparing the exams...</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-16 sm:space-y-24">
            {/* Hero Section */}
            <section className="text-center py-12 sm:py-20 bg-white rounded-xl shadow-lg">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4">Master Your Medical Coding Exams</h1>
                <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                    Our platform offers comprehensive practice exams to help you ace your certification. Log in to access your purchased tests.
                </p>
                {user ? (
                    <button
                        onClick={() => handleNavigation('/dashboard')}
                        className="bg-cyan-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-lg hover:bg-cyan-700 transition-transform transform hover:scale-105 inline-block"
                    >
                        Go to Dashboard
                    </button>
                ) : (
                    <div className="flex flex-col items-center">
                        <a
                            href="https://www.coding-online.net/wp-login.php?action=register"
                            className="bg-cyan-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-lg hover:bg-cyan-700 transition-transform transform hover:scale-105 inline-block"
                        >
                            Get Started Now
                        </a>
                        <p className="mt-4 text-slate-500">
                            Already have an account?{' '}
                            <a href={fullLoginUrl} className="font-semibold text-cyan-600 hover:underline">
                                Log In
                            </a>
                        </p>
                    </div>
                )}
            </section>
            
            {/* Features Section */}
            <section>
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 mb-4">Why Choose Us?</h2>
                <p className="text-md sm:text-lg text-center text-slate-500 max-w-2xl mx-auto mb-12">We provide the tools and insights you need to walk into your exam with confidence.</p>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard icon={BarChart} title="Realistic Exam Simulation">
                        Practice with exams that mirror the format, difficulty, and time constraints of the real certification tests.
                    </FeatureCard>
                    <FeatureCard icon={BrainCircuit} title="AI-Powered Feedback">
                        Receive personalized study recommendations based on your performance to target your weak areas effectively.
                    </FeatureCard>
                    <FeatureCard icon={FileSignature} title="Printable Certificates">
                        Earn and share verifiable certificates upon successful completion of our paid certification exams to showcase your skills.
                    </FeatureCard>
                </div>
            </section>

            {/* Exam Showcase */}
            <section>
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 mb-4">Available Exams</h2>
                <p className="text-md sm:text-lg text-center text-slate-500 max-w-2xl mx-auto mb-12">Choose from our selection of certification exams, fetched live from our main store.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {examProducts.length > 0 ? examProducts.map(product => {
                        const isCertUnlocked = user && paidExamIds.includes(product.certification_exam_id);
                        
                        return (
                            <div key={product.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-cyan-100 hover:shadow-xl">
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800">{product.name}</h3>
                                    <p className="text-slate-500 mt-2" dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                         <button 
                                            onClick={() => handleStartPractice(product.practice_exam_id)}
                                            className="flex justify-center items-center bg-white border border-slate-300 text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-slate-100 transition-colors duration-200 text-sm"
                                        >
                                            <PlayCircle size={16} className="mr-2" />
                                            <span>Practice</span>
                                        </button>
                                        <div className="text-lg font-bold text-slate-700 text-right" dangerouslySetInnerHTML={{ __html: product.price_html }} />
                                    </div>
                            
                                    {isCertUnlocked ? (
                                        <button 
                                            onClick={() => handleNavigation(`/test/${product.certification_exam_id}`)}
                                            className="w-full flex justify-center items-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition"
                                        >
                                            <CheckCircle size={18} className="mr-2"/> Start Certification Exam
                                        </button>
                                    ) : (
                                        <a 
                                            href={product.purchase_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex justify-center items-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition"
                                        >
                                            <ShoppingCart size={18} className="mr-2" />
                                            <span>Purchase on Main Site</span>
                                            <ArrowRight size={18} className="ml-2"/>
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="text-center text-slate-500 md:col-span-2">No exam products found. Please check back later.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;