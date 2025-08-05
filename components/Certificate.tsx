
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { googleSheetsService } from '../services/googleSheetsService';
import type { CertificateData } from '../types';
import Spinner from './Spinner';
import { Download, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { signatureBase64 } from '../assets/signature';

const Watermark: React.FC<{ text: string }> = ({ text }) => (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-6 gap-4 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center -rotate-45">
                <p className="text-gray-400 font-bold text-3xl md:text-4xl tracking-widest opacity-20 select-none whitespace-nowrap">
                    {text}
                </p>
            </div>
        ))}
    </div>
);

const Certificate: React.FC = () => {
    const { testId = 'sample' } = useParams<{ testId?: string }>();
    const history = useHistory();
    const { user } = useAuth();
    const { activeOrg } = useAppContext();
    const [certData, setCertData] = useState<CertificateData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const certificateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCertificateData = async () => {
            if (!user || !activeOrg) {
                toast.error("Invalid data. Cannot generate certificate.");
                history.push('/dashboard');
                return;
            }
            
            setIsLoading(true);
            try {
                const data = await googleSheetsService.getCertificateData(user, testId, activeOrg.id);
                if (data) {
                    setCertData(data);
                } else {
                    toast.error("Certificate not earned for this test.");
                    history.push('/dashboard');
                }
            } catch (error) {
                toast.error("Failed to load certificate data.");
                history.push('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertificateData();
    }, [testId, user, activeOrg, history]);

    const handleDownload = async () => {
        if (!certificateRef.current) return;
        setIsDownloading(true);
        toast.loading('Generating PDF...');

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 3, useCORS: true, backgroundColor: null,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificate-of-Completion.pdf`);
            toast.dismiss();
            toast.success("Certificate downloaded!");
        } catch(error) {
            toast.dismiss();
            toast.error("Could not download PDF. Please try again.");
            console.error(error);
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return <div className="flex flex-col items-center justify-center h-64"><Spinner /><p className="mt-4 text-slate-600">Loading your certificate...</p></div>;
    }

    if (!certData) {
        return <div className="text-center p-8"><p>No certificate data available.</p></div>;
    }

    const { organization, template } = certData;
    const bodyText = template.body.replace('{finalScore}', certData.finalScore.toString());

    return (
        <div className="max-w-5xl mx-auto bg-slate-100 p-4 sm:p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                 <button
                    onClick={() => history.push('/dashboard')}
                    className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg transition"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Dashboard</span>
                </button>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-green-400"
                >
                    {isDownloading ? <Spinner/> : <Download size={20} />}
                    <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                </button>
            </div>
            
            <div ref={certificateRef} className="w-full aspect-[1.414/1] bg-white p-4 font-serif-display shadow-lg border-8 border-teal-900 relative overflow-hidden">
                 {testId === 'sample' && <Watermark text="Draft" />}
                 {testId !== 'sample' && <Watermark text={organization.name} />}
                <div className="w-full h-full border-2 border-teal-700 flex flex-col p-6">
                    
                    <div className="flex items-center space-x-3">
                        <img src={organization.logo} alt={`${organization.name} Logo`} className="h-14 w-14 object-contain" />
                        <div className="flex flex-col text-left">
                            <span className="text-2xl font-bold text-slate-800 font-serif">{organization.name}</span>
                            <span className="text-sm text-slate-500 font-serif">{organization.website}</span>
                        </div>
                    </div>
                                        
                    <div className="flex-grow flex flex-col items-center justify-center text-center">
                        <p className="text-xl text-slate-600 tracking-wider">Certificate of Achievement in</p>
                        <p className="text-4xl font-bold text-teal-800 tracking-wide mt-1">{template.title}</p>
                        
                        <div className="w-1/3 mx-auto my-4 border-b border-slate-400"></div>

                        <p className="text-lg text-slate-600">This certificate is proudly presented to</p>
                        
                        <p className="text-5xl font-script text-teal-800 my-4">
                            {certData.candidateName}
                        </p>
                        
                        <p className="text-base text-slate-700 max-w-3xl leading-relaxed" dangerouslySetInnerHTML={{ __html: bodyText }} />
                    </div>
                    
                    <div className="pt-4 mt-auto">
                         <div className="flex justify-center items-center w-full">
                            <div className="text-center w-72">
                               <img 
                                  src={signatureBase64} 
                                  alt={`${template.signature1Name} Signature`}
                                  className="h-16 mx-auto object-contain mb-2"
                                />
                               <div className="border-t border-slate-400 pt-2">
                                  <p className="text-sm text-slate-700 tracking-wider">
                                    <strong>{template.signature1Name}</strong>
                                  </p>
                                  <p className="text-xs text-slate-600 tracking-wider">
                                    {template.signature1Title}
                                  </p>
                               </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-300 mt-6">
                            <span>Certificate No: <strong>{certData.certificateNumber}</strong></span>
                            <span>Date of Issue: <strong>{certData.date}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificate;
