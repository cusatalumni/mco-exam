
import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, BarChart, FileSignature, Lock, CheckCircle, PlayCircle, ArrowRight } from 'lucide-react';
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
    const { activeOrg, isInitializing } = useAppContext();
    
    const loginUrl = `https://www.coding-online.net/exam-login/`;
    const baseUrl = `https://www.coding-online.net`;

    const handleStartPractice = (examId: string) => {
        if (!user) {
            toast.error("Please log in to take a practice test.");
            return;
        }
        navigate(`/test/${examId}`);
    };
    
    // Create a lookup map for exams for easier and more performant access inside the loop.
    const examMap = useMemo(() => {
        if (!activeOrg) return new Map();
        return new Map(activeOrg.exams.map(exam => [exam.id, exam]));
    }, [activeOrg]);

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
                    <Link
                        to="/dashboard"
                        className="bg-cyan-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-lg hover:bg-cyan-700 transition-transform transform hover:scale-105 inline-block"
                    >
                        Go to Dashboard
                    </Link>
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
                            <a href={loginUrl} className="font-semibold text-cyan-600 hover:underline">
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
                <p className="text-md sm:text-lg text-center text-slate-500 max-w-2xl mx-auto mb-12">Choose from our selection of practice and certification exams to test your skills and prepare for success.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {activeOrg.examProductCategories.map(category => {
                        const practiceExam = examMap.get(category.practiceExamId);
                        const certExam = examMap.get(category.certificationExamId);

                        if (!practiceExam || !certExam) return null;

                        const isCertUnlocked = user && paidExamIds.includes(certExam.id);
                        
                        // Use the explicit productUrl from the exam configuration.
                        const purchaseUrl = certExam.productUrl ? `${baseUrl}${certExam.productUrl}` : '#';

                        return (
                            <div key={category.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 flex flex-col md:flex-row items-center gap-8 transition-all duration-300 hover:shadow-cyan-100 hover:shadow-xl">
                                {/* Left side: Info */}
                                <div className="flex-grow text-center md:text-left">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800">{category.name}</h3>
                                    <p className="text-slate-500 mt-2 max-w-xl">{category.description}</p>
                                </div>
                            
                                {/* Right side: Actions */}
                                <div className="flex-shrink-0 w-full md:w-auto md:min-w-[280px] space-y-4">
                                    {/* Practice Test Button */}
                                    <div className="text-center">
                                        <button 
                                            onClick={() => handleStartPractice(practiceExam.id)}
                                            className="w-full flex justify-center items-center bg-slate-100 border border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 transition disabled:opacity-60"
                                            disabled={!user}
                                        >
                                            <PlayCircle size={18} className="mr-2" />
                                            <span>Practice Test</span>
                                        </button>
                                        <p className="text-xs text-slate-500 mt-1">{practiceExam.numberOfQuestions} questions. {user ? `Available` : 'Login to practice.'}</p>
                                    </div>
                            
                                    {/* Certification Exam Button */}
                                    <div className="text-center">
                                        {isCertUnlocked ? (
                                            <button 
                                                onClick={() => navigate(`/test/${certExam.id}`)}
                                                className="w-full flex justify-center items-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition"
                                            >
                                                <CheckCircle size={18} className="mr-2"/> Start Certification
                                            </button>
                                        ) : (
                                            <a 
                                                href={purchaseUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex justify-center items-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition"
                                            >
                                                <Lock size={18} className="mr-2" />
                                                <span>Purchase Exam</span>
                                                <ArrowRight size={18} className="ml-2"/>
                                            </a>
                                        )}
                                        <p className="text-xs text-slate-500 mt-1">{certExam.numberOfQuestions} questions. Certificate on completion.</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;