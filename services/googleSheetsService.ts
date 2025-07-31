

import type { User, Question, UserAnswer, TestResult, CertificateData, Organization, Exam, ExamProductCategory, CertificateTemplate, AnswerReview } from '../types';
import { logoBase64 } from '../assets/logo';
import { ameliaReedSignatureBase64 } from '../assets/ameliaReedSignature';

const EXAM_PRODUCT_CATEGORIES: ExamProductCategory[] = [
    { id: 'prod-cpc', name: 'CPC', description: 'A test series designed to prepare you for the AAPC CPC (Certified Professional Coder) certification.', practiceExamId: 'exam-cpc-practice', certificationExamId: 'exam-cpc-cert' },
    { id: 'prod-cca', name: 'CCA', description: 'A test series aligned with AHIMA’s CCA (Certified Coding Associate) exam blueprint.', practiceExamId: 'exam-cca-practice', certificationExamId: 'exam-cca-cert' },
    { id: 'prod-ccs', name: 'CCS', description: 'A comprehensive test series for the AHIMA CCS (Certified Coding Specialist) credential.', practiceExamId: 'exam-ccs-practice', certificationExamId: 'exam-ccs-cert' },
    { id: 'prod-cpb', name: 'CPB', description: 'A test series for the AAPC CPB (Certified Professional Biller) certification.', practiceExamId: 'exam-cpb-practice', certificationExamId: 'exam-cpb-cert' },
    { id: 'prod-crc', name: 'CRC', description: 'A test series on risk adjustment models and hierarchical condition categories (HCC).', practiceExamId: 'exam-crc-practice', certificationExamId: 'exam-crc-cert' },
    { id: 'prod-icd', name: 'ICD-10-CM', description: 'A test series focusing on ICD-10-CM diagnosis coding proficiency.', practiceExamId: 'exam-icd-practice', certificationExamId: 'exam-icd-cert' },
    { id: 'prod-cpma', name: 'CPMA', description: 'A test series for the AAPC CPMA (Certified Professional Medical Auditor) certification.', practiceExamId: 'exam-cpma-practice', certificationExamId: 'exam-cpma-cert' },
    { id: 'prod-coc', name: 'COC', description: 'A test series for the AAPC COC (Certified Outpatient Coder) certification.', practiceExamId: 'exam-coc-practice', certificationExamId: 'exam-coc-cert' },
    { id: 'prod-cic', name: 'CIC', description: 'A test series for the AAPC CIC (Certified Inpatient Coder) certification.', practiceExamId: 'exam-cic-practice', certificationExamId: 'exam-cic-cert' },
    { id: 'prod-mta', name: 'Medical Terminology & Anatomy', description: 'A foundational test series covering core medical terminology and anatomy.', practiceExamId: 'exam-mta-practice', certificationExamId: 'exam-mta-cert' },
    { id: 'prod-cppm', name: 'CPPM', description: 'A test series for the AAPC CPPM (Certified Physician Practice Manager) certification.', practiceExamId: 'exam-cppm-practice', certificationExamId: 'exam-cppm-cert' },
    { id: 'prod-cemc', name: 'CEMC', description: 'A test series for the AAPC CEMC (Certified Evaluation and Management Coder) certification.', practiceExamId: 'exam-cemc-practice', certificationExamId: 'exam-cemc-cert' },
];

const CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
    {
        id: 'cert-template-main',
        title: 'Medical Coding Specialist',
        body: 'For successfully passing the certification exam with a score of {finalScore}%. This certification recognizes expertise in professional fee coding.',
        signatureName: 'Dr. Amelia Reed',
        signatureTitle: 'Program Director',
        signatureImage: ameliaReedSignatureBase64,
    }
];

const EXAMS: Exam[] = [
    // CPC (Certified Professional Coder)
    { id: 'exam-cpc-practice', name: 'CPC Practice Exam', description: 'Practice for the CPC exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 50, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cpc-cert', name: 'CPC Certification Exam', description: 'Official CPC certification exam.', price: 150, questionSourceUrl: '', numberOfQuestions: 150, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false, recommendedBook: { title: 'Official CPC Certification Study Guide', description: 'The official study guide for the CPC certification. Covers all major topics and includes practice questions.', imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51kHkSOeG3L._SX396_BO1,204,203,200_.jpg', affiliateLinks: { com: 'https://amazon.com', in: 'https://amazon.in', ae: 'https://amazon.ae' } } },
    // CCA (Certified Coding Associate)
    { id: 'exam-cca-practice', name: 'CCA Practice Exam', description: 'Practice for the CCA exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 40, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cca-cert', name: 'CCA Certification Exam', description: 'Official CCA certification exam.', price: 120, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // CCS (Certified Coding Specialist)
    { id: 'exam-ccs-practice', name: 'CCS Practice Exam', description: 'Practice for the CCS exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 60, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-ccs-cert', name: 'CCS Certification Exam', description: 'Official CCS certification exam.', price: 180, questionSourceUrl: '', numberOfQuestions: 120, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // CPB (Certified Professional Biller)
    { id: 'exam-cpb-practice', name: 'CPB Practice Exam', description: 'Practice for the CPB exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 30, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cpb-cert', name: 'CPB Certification Exam', description: 'Official CPB certification exam.', price: 100, questionSourceUrl: '', numberOfQuestions: 80, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // CRC (Certified Risk Adjustment Coder)
    { id: 'exam-crc-practice', name: 'CRC Practice Exam', description: 'Practice for Risk Adjustment.', price: 0, questionSourceUrl: '', numberOfQuestions: 45, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-crc-cert', name: 'CRC Certification Exam', description: 'Official CRC certification.', price: 110, questionSourceUrl: '', numberOfQuestions: 90, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // ICD-10-CM
    { id: 'exam-icd-practice', name: 'ICD-10-CM Practice Exam', description: 'Practice for ICD-10-CM.', price: 0, questionSourceUrl: '', numberOfQuestions: 50, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-icd-cert', name: 'ICD-10-CM Certification Exam', description: 'Official ICD-10-CM certification.', price: 130, questionSourceUrl: '', numberOfQuestions: 110, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // CPMA (Certified Professional Medical Auditor)
    { id: 'exam-cpma-practice', name: 'CPMA Practice Exam', description: 'Practice for the CPMA exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 50, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cpma-cert', name: 'CPMA Certification Exam', description: 'Official CPMA certification exam.', price: 160, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // COC (Certified Outpatient Coder)
    { id: 'exam-coc-practice', name: 'COC Practice Exam', description: 'Practice for the COC exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 50, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-coc-cert', name: 'COC Certification Exam', description: 'Official COC certification exam.', price: 140, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // CIC (Certified Inpatient Coder)
    { id: 'exam-cic-practice', name: 'CIC Practice Exam', description: 'Practice for the CIC exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 50, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cic-cert', name: 'CIC Certification Exam', description: 'Official CIC certification exam.', price: 170, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // MTA (Medical Terminology & Anatomy)
    { id: 'exam-mta-practice', name: 'Medical Terminology & Anatomy Practice', description: 'Practice for MTA.', price: 0, questionSourceUrl: '', numberOfQuestions: 40, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-mta-cert', name: 'Medical Terminology & Anatomy Certification', description: 'Official MTA certification.', price: 80, questionSourceUrl: '', numberOfQuestions: 80, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // CPPM (Certified Physician Practice Manager)
    { id: 'exam-cppm-practice', name: 'CPPM Practice Exam', description: 'Practice for the CPPM exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 50, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cppm-cert', name: 'CPPM Certification Exam', description: 'Official CPPM certification exam.', price: 190, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // CEMC (Certified Evaluation and Management Coder)
    { id: 'exam-cemc-practice', name: 'CEMC Practice Exam', description: 'Practice for the CEMC exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 45, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cemc-cert', name: 'CEMC Certification Exam', description: 'Official CEMC certification exam.', price: 175, questionSourceUrl: '', numberOfQuestions: 90, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
];


const ORGANIZATION: Organization = {
    id: 'org-coding-online',
    name: 'Coding Online',
    website: 'www.coding-online.net',
    logo: logoBase64,
    exams: [],
    examProductCategories: [],
    certificateTemplates: [],
};

class GoogleSheetsService {
    private organizations: Organization[] = [];
    private testResults: TestResult[] = [];
    private allQuestions: Map<string, Question[]> = new Map();


    constructor() {
        this.testResults.push({
            testId: 'result-123-pass', userId: 'user-001', examId: 'exam-cpc-cert', answers: [],
            score: 85, correctCount: 128, totalQuestions: 150, timestamp: new Date('2023-10-26').getTime(), review: [],
        });
        this.testResults.push({
            testId: 'result-456-fail', userId: 'user-001', examId: 'exam-cpc-cert', answers: [],
            score: 62, correctCount: 93, totalQuestions: 150, timestamp: new Date('2023-10-20').getTime(), review: [],
        });
    }

    private generateMockQuestions(exam: Exam): Question[] {
        if (this.allQuestions.has(exam.id)) {
            return this.allQuestions.get(exam.id)!;
        }
        const questions: Question[] = [];
        for (let i = 1; i <= exam.numberOfQuestions; i++) {
            questions.push({
                id: i,
                question: `This is question number ${i} for the ${exam.name}. What is the correct option?`,
                options: [`Option A for Q${i}`, `Option B for Q${i}`, `Option C for Q${i}`, `Option D for Q${i}`],
                correctAnswer: i % 4,
            });
        }
        this.allQuestions.set(exam.id, questions);
        return questions;
    }
    
    public async initializeAndCategorizeExams(): Promise<void> {
        const mainOrg = { ...ORGANIZATION };
        mainOrg.exams = [...EXAMS];
        mainOrg.examProductCategories = [...EXAM_PRODUCT_CATEGORIES];
        mainOrg.certificateTemplates = [...CERTIFICATE_TEMPLATES];
        
        mainOrg.exams.forEach(exam => this.generateMockQuestions(exam));
        
        this.organizations = [mainOrg];
        return Promise.resolve();
    }

    public getOrganizations(): Organization[] {
        return this.organizations;
    }

    public getExamConfig(orgId: string, examId: string): Exam | undefined {
        const org = this.organizations.find(o => o.id === orgId);
        return org?.exams.find(e => e.id === examId);
    }
    
    public async getQuestions(examConfig: Exam): Promise<Question[]> {
        return Promise.resolve(this.allQuestions.get(examConfig.id) || []);
    }
    
    public async getTestResultsForUser(userId: string): Promise<TestResult[]> {
        return Promise.resolve(this.testResults.filter(r => r.userId === userId).sort((a,b) => b.timestamp - a.timestamp));
    }

    public getTestResult(testId: string, userId: string): Promise<TestResult | undefined> {
        const result = this.testResults.find(r => r.testId === testId && r.userId === userId);
        return Promise.resolve(result);
    }

    public async submitTest(userId: string, orgId: string, examId: string, userAnswers: UserAnswer[]): Promise<TestResult> {
        const exam = this.getExamConfig(orgId, examId);
        if (!exam) throw new Error('Exam not found');
        
        const questions = this.allQuestions.get(exam.id) || [];
        if (questions.length === 0) throw new Error('Questions not found for this exam.');

        let correctCount = 0;
        const review: AnswerReview[] = [];

        userAnswers.forEach(userAnswer => {
            const question = questions.find(q => q.id === userAnswer.questionId);
            if (question) {
                if (userAnswer.answer === question.correctAnswer) {
                    correctCount++;
                }
                review.push({
                    questionId: question.id,
                    question: question.question,
                    options: question.options,
                    userAnswer: userAnswer.answer,
                    correctAnswer: question.correctAnswer
                });
            }
        });
        
        const newResult: TestResult = {
            testId: `result-${Date.now()}`, userId, examId, answers: userAnswers,
            score: Math.round((correctCount / exam.numberOfQuestions) * 100),
            correctCount, totalQuestions: exam.numberOfQuestions, timestamp: Date.now(),
            review: review.sort((a,b) => a.questionId - b.questionId),
        };

        this.testResults.push(newResult);
        return Promise.resolve(newResult);
    }
    
    public async getCertificateData(testId: string, user: User, orgId: string): Promise<CertificateData | null> {
        const org = this.organizations.find(o => o.id === orgId);
        if (!org) return null;

        if (testId === 'sample') {
            const sampleTemplate = org.certificateTemplates[0];
            return {
                certificateNumber: 'SAMPLE-12345', candidateName: user.name, finalScore: 95,
                date: new Date().toLocaleDateString(), totalQuestions: 150, organization: org, template: sampleTemplate,
            };
        }

        const result = await this.getTestResult(testId, user.id);
        const exam = result ? this.getExamConfig(org.id, result.examId) : null;
        
        if (!result || !exam || exam.isPractice) return null;

        const isPass = result.score >= exam.passScore;
        if (!isPass) return null;

        const template = org.certificateTemplates.find(t => t.id === exam.certificateTemplateId);
        if (!template) return null;

        return {
            certificateNumber: `${exam.id.toUpperCase()}-${result.timestamp}`,
            candidateName: user.name, finalScore: result.score, date: new Date(result.timestamp).toLocaleDateString(),
            totalQuestions: result.totalQuestions, organization: org, template,
        };
    }
}

export const googleSheetsService = new GoogleSheetsService();