

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { googleSheetsService } from '../services/googleSheetsService';
import type { TestResult } from '../types';
import Spinner from './Spinner';
import { BookCopy, History, FlaskConical, Eye, FileText, BarChart, BadgePercent, Trophy, ArrowRight, Home, RefreshCw, Database } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, paidExamIds, token } = useAuth();
    const { activeOrg } = useAppContext();
    const [results, setResults] = useState<TestResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTesting, setIsTesting] = useState(false);
    const [stats, setStats] = useState({ avgScore: 0, bestScore: 0, examsTaken: 0 });

    useEffect(() => {
        if (!user || !token) return;
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const userResults = await googleSheetsService.getTestResultsForUser(token);
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
            } catch (error) {
                console.error("Failed to fetch dashboard results:", error);
                toast.error("Could not load your exam history.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [user, token]);

    const handleTestConnection = async () => {
        setIsTesting(true);
        const toastId = toast.loading('Testing database connection...');
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message, { id: toastId });
            } else {
                toast.error(`Error: ${data.message}`, { id: toastId });
            }
        } catch (error) {
            toast.error('Failed to perform health check.', { id: toastId });
        } finally {
            setIsTesting(false);
        }
    };


    if (isLoading || !activeOrg) {
        return <div className="flex flex-col items-center justify-center h-64"><Spinner /><p className="mt-4">Loading your dashboard...</p></div>;
    }

    const getExamName = (examId: string) => activeOrg.exams.find(e => e.id === examId)?.name || 'Unknown Exam';
    const purchasedExams = activeOrg.exams.filter(e => paidExamIds.includes(e.id) && !e.isPractice);
    const practiceExams = activeOrg.exams.filter(e => e.isPractice);

    const getBestScoreForExam = (examId: string) => {
        const examResults = results.filter(r => r.examId === examId);
        if (examResults.length === 0) return null;
        return Math.max(...examResults.map(r => r.score));
    };

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
                            href={`https://www.coding-online.net/exam-login/?redirect_to=/dashboard`}
                            className="mt-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Sync My Exams
                        </a>
                    </div>

                    {/* My Certification Exams */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center mb-4"><BookCopy className="mr-3 text-cyan-500" /> My Certification Exams</h2>
                        <div className="space-y-3">
                            {purchasedExams.length > 0 ? purchasedExams.map(exam => {
                                const bestScore = getBestScoreForExam(exam.id);
                                return (
                                     <div key={exam.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                                        <div>
                                            <h3 className="font-bold text-slate-800">{exam.name}</h3>
                                            <p className="text-sm text-slate-500">{exam.numberOfQuestions} questions</p>
                                        </div>
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            {bestScore !== null && (
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-500">Best</p>
                                                    <p className="font-bold text-lg text-cyan-600">{bestScore}%</p>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => navigate(`/test/${exam.id}`)}
                                                className="flex-grow bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-700 transition"
                                            >
                                                {bestScore !== null ? 'Retake Exam' : 'Start Exam'}
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
                            {practiceExams.length > 0 ? practiceExams.map(exam => (
                                <div key={exam.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                                    <div>
                                        <h3 className="font-bold text-slate-700">{exam.name}</h3>
                                        <p className="text-sm text-slate-500">{exam.numberOfQuestions} questions</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/test/${exam.id}`)}
                                        className="w-full sm:w-auto bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition"
                                    >
                                        Start Practice
                                    </button>
                                </div>
                            )) : (
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
'use client';

import { useState } from 'react';

export default function TestRedisButton() {
  const [result, setResult] = useState<string | null>(null);

  const handleTest = async () => {
    setResult('Testing...');
    const res = await fetch('/api/test-redis');
    const data = await res.json();

    if (data.success) {
      setResult(`✅ Redis returned: ${data.value}`);
    } else {
      setResult(`❌ Error: ${data.error}`);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleTest}
        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
      >
        Test DB Connection
      </button>
      {result && <p className="mt-2 text-slate-700">{result}</p>}
    </div>
  );
}

                            <button onClick={handleTestConnection} disabled={isTesting} className="w-full bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-lg hover:bg-slate-200 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                               {isTesting ? <Spinner /> : <Database size={16} />}
                               {isTesting ? 'Testing...' : 'Test DB Connection'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;