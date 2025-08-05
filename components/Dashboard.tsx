
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { googleSheetsService } from '../services/googleSheetsService';
import type { TestResult } from '../types';
import Spinner from './Spinner';
import { BookCopy, History, FlaskConical, Eye, FileText, BarChart, BadgePercent, Trophy, ArrowRight, Home, RefreshCw, Star, Zap, CheckCircle, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, paidExamIds, isSubscribed } = useAuth();
    const { activeOrg } = useAppContext();
    const [results, setResults] = useState<TestResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ avgScore: 0, bestScore: 0, examsTaken: 0 });
    const [practiceStats, setPracticeStats] = useState({ attemptsTaken: 0, attemptsAllowed: 0 });

    const loginUrl = 'https://www.coding-online.net/exam-login/';
    const appUrl = user?.isAdmin 
        ? 'https://mco-exam-jkfzdt3bj-manoj-balakrishnans-projects-aa177a85.vercel.app/'
        : 'https://exams.coding-online.net/';
    
    const appDashboardPath = '#/dashboard';
    const syncUrl = `${loginUrl}?redirect_to=${encodeURIComponent(appUrl + appDashboardPath)}`;


    useEffect(() => {
        if (!user || !activeOrg) return;
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const userResults = await googleSheetsService.getTestResultsForUser(user);
                setResults(userResults);
                
                if (userResults.length > 0) {
                    const totalScore = userResults.reduce((sum, r) => sum + r.score, 0);
                    const avg = totalScore / userResults.length;
                    const best = Math.max(...userResults.map(r => r.score));
                    setStats({
                        avgScore: parseFloat(avg.toFixed(1)),
                        bestScore: best,
                        examsTaken: userResults.length
                    });
                } else {
                    setStats({ avgScore: 0, bestScore: 0, examsTaken: 0 });
                }

                const practiceExamIds = new Set(activeOrg.exams.filter(e => e.isPractice).map(e => e.id));
                const practiceAttemptsTaken = userResults.filter(r => practiceExamIds.has(r.examId)).length;
                setPracticeStats({ attemptsTaken: practiceAttemptsTaken, attemptsAllowed: 10 });

            } catch (error) {
                console.error("Failed to fetch dashboard results:", error);
                toast.error("Could not load your exam history.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [user, activeOrg]);

    const processedPurchasedExams = useMemo(() => {
        if (!activeOrg) return [];
        
        // Match purchased exams using the exam ID, which corresponds to the WooCommerce SKU.
        return activeOrg.exams
            .filter(e => !e.isPractice && paidExamIds.includes(e.id))
            .map(exam => {
                const examResults = results.filter(r => r.examId === exam.id);
                const attemptsMade = examResults.length;
                const hasPassed = examResults.some(r => r.score >= exam.passScore);
                const bestScore = examResults.length > 0 ? Math.max(...examResults.map(r => r.score)) : null;
    
                let status: 'passed' | 'attempts_exceeded' | 'available' = 'available';
                if (hasPassed) {
                    status = 'passed';
                } else if (attemptsMade >= 3) {
                    status = 'attempts_exceeded';
                }
    
                return {
                    ...exam,
                    attemptsMade,
                    status,
                    bestScore
                };
            });
    }, [activeOrg, paidExamIds, results]);


    if (isLoading || !activeOrg) {
        return <div className="flex flex-col items-center justify-center h-64"><Spinner /><p className="mt-4">Loading your dashboard...</p></div>;
    }

    const getExamName = (examId: string) => activeOrg.exams.find(e => e.id === examId)?.name || 'Unknown Exam';
    const practiceExams = activeOrg.exams.filter(e => e.isPractice);
    

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                <span className="text-slate-500 hidden sm:block">Welcome back, {user?.name}!</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                     {/* New Purchase Notification */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center space-x-3">
                            <RefreshCw className="text-blue-600" size={24} />
                            <div>
                                <p className="font-semibold text-blue-800">Just made a purchase?</p>
                                <p className="text-sm text-blue-700">Click the button below to sync your latest exams to your dashboard.</p>
                            </div>
                        </div>
                        <a
                            href={syncUrl}
                            className="mt-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            title="This takes you to our main site to securely sync your purchased exams with your account."
                        >
                            Sync My Exams
                        </a>
                    </div>

                    {/* My Certification Exams */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center mb-4"><BookCopy className="mr-3 text-cyan-500" /> My Certification Exams</h2>
                        <div className="space-y-3">
                            {processedPurchasedExams.length > 0 ? processedPurchasedExams.map(exam => {
                                const canTakeTest = exam.status === 'available';
                                
                                let buttonContent: React.ReactNode;
                                if (exam.status === 'passed') {
                                    buttonContent = <><CheckCircle size={16} className="mr-2"/> Passed</>;
                                } else if (exam.status === 'attempts_exceeded') {
                                    buttonContent = 'Attempts Exceeded';
                                } else if (exam.attemptsMade > 0) {
                                    buttonContent = 'Retake Exam';
                                } else {
                                    buttonContent = 'Start Exam';
                                }

                                return (
                                     <div key={exam.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-slate-800">{exam.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-sm text-slate-500">{exam.numberOfQuestions} questions</p>
                                                {exam.status === 'passed' && (
                                                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={12}/>Passed</span>
                                                )}
                                                {exam.status === 'attempts_exceeded' && (
                                                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">3/3 Attempts Used</span>
                                                )}
                                                {exam.status === 'available' && exam.attemptsMade > 0 && (
                                                    <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">{exam.attemptsMade}/3 Attempts</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            {exam.bestScore !== null && (
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-500">Best</p>
                                                    <p className="font-bold text-lg text-cyan-600">{exam.bestScore}%</p>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => navigate(`/test/${exam.id}`)}
                                                disabled={!canTakeTest}
                                                className="flex-grow flex items-center justify-center bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                                            >
                                                {buttonContent}
                                            </button>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="text-center py-6 text-slate-500">
                                    <p>You haven't purchased any certification exams yet.</p>
                                    <button onClick={() => navigate('/')} className="mt-2 text-sm font-semibold text-cyan-600 hover:text-cyan-800 flex items-center gap-1 mx-auto">
                                        Browse Exams <ArrowRight size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Practice Exams */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center"><FlaskConical className="mr-3 text-cyan-500" /> Practice Tests</h2>
                         <div className="space-y-3">
                            {practiceExams.length > 0 ? practiceExams.map(exam => {
                                const canTakeTest = isSubscribed || practiceStats.attemptsTaken < 10;
                                return (
                                    <div key={exam.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                                        <div>
                                            <h3 className="font-bold text-slate-700">{exam.name}</h3>
                                            <p className="text-sm text-slate-500">{exam.numberOfQuestions} questions</p>
                                            {isSubscribed && (
                                                <p className="text-xs text-green-500 mt-1">Unlimited attempts available.</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => navigate(`/test/${exam.id}`)}
                                            disabled={!canTakeTest}
                                            className="w-full sm:w-auto bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Start Practice
                                        </button>
                                    </div>
                                )
                            }) : (
                                <p className="text-center py-6 text-slate-500">No practice exams available.</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Exam History */}
                     <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center"><History className="mr-3 text-cyan-500" /> Exam History</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b bg-slate-50 text-slate-600">
                                        <th className="p-3">Exam Name</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Score</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.length > 0 ? results.map(result => {
                                        const exam = activeOrg.exams.find(e => e.id === result.examId);
                                        const isPass = exam ? result.score >= exam.passScore : false;
                                        return (
                                            <tr key={result.testId} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="p-3 font-semibold">{getExamName(result.examId)}</td>
                                                <td className="p-3 text-slate-500">{new Date(result.timestamp).toLocaleDateString()}</td>
                                                <td className={`p-3 font-bold ${isPass ? 'text-green-600' : 'text-red-600'}`}>{result.score}%</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {isPass ? 'Passed' : 'Failed'}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button onClick={() => navigate(`/results/${result.testId}`)} className="text-cyan-600 hover:text-cyan-800 flex items-center text-xs">
                                                        <Eye size={14} className="mr-1" /> Review
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-slate-500">You haven't taken any exams yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                     </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                     {/* Free Practice Status Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Star className="mr-2 text-yellow-500"/> Free Practice Status</h3>
                        {isSubscribed ? (
                            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="font-bold text-green-700">Pro Plan Active</p>
                                <p className="text-sm text-green-600">You have unlimited practice attempts!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                    <span className="font-medium text-slate-600">Attempts Taken</span>
                                    <span className="font-bold text-slate-800 text-lg">{practiceStats.attemptsTaken}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                    <span className="font-medium text-slate-600">Total Attempts Allowed</span>
                                    <span className="font-bold text-slate-800 text-lg">{practiceStats.attemptsAllowed}</span>
                                </div>
                                <div className="mt-4">
                                    <button 
                                        disabled 
                                        className="w-full bg-slate-200 text-slate-500 font-bold py-2 px-3 rounded-lg transition text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                                        title="Subscription feature coming soon!">
                                        <Zap size={16} /> Upgrade for Unlimited
                                    </button>
                                    <p className="text-xs text-center text-slate-400 mt-2">Coming Soon</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Stats Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">At a Glance</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                <span className="font-medium text-slate-600 flex items-center gap-2"><BarChart size={16}/> Exams Taken</span>
                                <span className="font-bold text-slate-800 text-lg">{stats.examsTaken}</span>
                            </div>
                             <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                <span className="font-medium text-slate-600 flex items-center gap-2"><BadgePercent size={16}/> Average Score</span>
                                <span className="font-bold text-slate-800 text-lg">{stats.avgScore}%</span>
                            </div>
                             <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                <span className="font-medium text-slate-600 flex items-center gap-2"><Trophy size={16}/> Best Score</span>
                                <span className="font-bold text-green-600 text-lg">{stats.bestScore}%</span>
                            </div>
                        </div>
                    </div>
                    {/* Actions Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Actions</h3>
                        <div className="space-y-3">
                             <button onClick={() => navigate('/')} className="w-full bg-cyan-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-cyan-700 transition text-sm flex items-center justify-center gap-2">
                                <Home size={16} /> Browse All Exams
                            </button>
                            <button onClick={() => navigate('/certificate/sample')} className="w-full bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-lg hover:bg-slate-200 transition text-sm flex items-center justify-center gap-2">
                               <FileText size={16} /> Preview Certificate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;