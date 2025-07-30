

import type { User, Question, UserAnswer, TestResult, CertificateData, Organization, Exam, ExamProductCategory, CertificateTemplate, AnswerReview } from '../types';
import { logoBase64 } from '../assets/logo';
import { ameliaReedSignatureBase64 } from '../assets/ameliaReedSignature';

const AI_EXAM_TOPICS = [
    { id: 'topic-icd-10-cm', name: 'ICD-10-CM Fundamentals' },
    { id: 'topic-cpt-procedural', name: 'CPT Procedural Coding' },
    { id: 'topic-hcpcs-level-2', name: 'HCPCS Level II' },
    { id: 'topic-anatomy-physiology', name: 'Anatomy & Physiology' },
    { id: 'topic-compliance-auditing', name: 'Compliance and Auditing' },
    { id: 'topic-inpatient-coding', name: 'Inpatient Coding Challenge' },
    { id: 'topic-outpatient-coding', name: 'Outpatient Coding Challenge' },
    { id: 'topic-risk-adjustment', name: 'Risk Adjustment (HCC)' },
    { id: 'topic-medical-terminology', name: 'Medical Terminology' },
    { id: 'topic-medical-billing', name: 'Medical Billing' },
];

const EXAM_PRODUCT_CATEGORIES: ExamProductCategory[] = [
    { id: 'prod-cpc', name: 'CPC', description: 'A test series designed to prepare you for the AAPC CPC (Certified Professional Coder) certification.', practiceExamId: 'exam-cpc-practice', certificationExamId: 'exam-cpc-cert' },
    { id: 'prod-cca', name: 'CCA', description: 'A test series aligned with AHIMA’s CCA (Certified Coding Associate) exam blueprint.', practiceExamId: 'exam-cca-practice', certificationExamId: 'exam-cca-cert' },
    { id: 'prod-ccs', name: 'CCS', description: 'A comprehensive test series for the AHIMA CCS (Certified Coding Specialist) credential.', practiceExamId: 'exam-ccs-practice', certificationExamId: 'exam-ccs-cert' },
    { id: 'prod-billing', name: 'Medical Billing', description: 'A test series covering core concepts in medical billing and reimbursement.', practiceExamId: 'exam-billing-practice', certificationExamId: 'exam-billing-cert' },
    { id: 'prod-risk', name: 'Risk Adjustment Coding', description: 'A test series on risk adjustment models and hierarchical condition categories (HCC).', practiceExamId: 'exam-risk-practice', certificationExamId: 'exam-risk-cert' },
    { id: 'prod-icd', name: 'ICD-10-CM', description: 'A test series focusing on ICD-10-CM diagnosis coding.', practiceExamId: 'exam-icd-practice', certificationExamId: 'exam-icd-cert' },
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
    // CPC
    { id: 'exam-cpc-practice', name: 'CPC Practice Exam', description: 'Practice for the CPC exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 50, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cpc-cert', name: 'CPC Certification Exam', description: 'Official CPC certification exam.', price: 150, questionSourceUrl: '', numberOfQuestions: 150, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false, recommendedBook: { title: 'Official CPC Certification Study Guide', description: 'The official study guide for the CPC certification. Covers all major topics and includes practice questions.', imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51kHkSOeG3L._SX396_BO1,204,203,200_.jpg', affiliateLinks: { com: 'https://amazon.com', in: 'https://amazon.in', ae: 'https://amazon.ae' } } },
    // CCA
    { id: 'exam-cca-practice', name: 'CCA Practice Exam', description: 'Practice for the CCA exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 40, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cca-cert', name: 'CCA Certification Exam', description: 'Official CCA certification exam.', price: 120, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // CCS
    { id: 'exam-ccs-practice', name: 'CCS Practice Exam', description: 'Practice for the CCS exam.', price: 0, questionSourceUrl: '', numberOfQuestions: 60, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-ccs-cert', name: 'CCS Certification Exam', description: 'Official CCS certification exam.', price: 180, questionSourceUrl: '', numberOfQuestions: 120, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // Medical Billing
    { id: 'exam-billing-practice', name: 'Medical Billing Practice Exam', description: 'Practice for Medical Billing.', price: 0, questionSourceUrl: '', numberOfQuestions: 30, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-billing-cert', name: 'Medical Billing Certification', description: 'Official Medical Billing certification.', price: 90, questionSourceUrl: '', numberOfQuestions: 80, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // Risk Adjustment
    { id: 'exam-risk-practice', name: 'Risk Adjustment Practice Exam', description: 'Practice for Risk Adjustment.', price: 0, questionSourceUrl: '', numberOfQuestions: 45, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-risk-cert', name: 'Risk Adjustment Certification', description: 'Official Risk Adjustment certification.', price: 110, questionSourceUrl: '', numberOfQuestions: 90, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
    // ICD-10-CM
    { id: 'exam-icd-practice', name: 'ICD-10-CM Practice Exam', description: 'Practice for ICD-10-CM.', price: 0, questionSourceUrl: '', numberOfQuestions: 50, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-icd-cert', name: 'ICD-10-CM Certification Exam', description: 'Official ICD-10-CM certification.', price: 130, questionSourceUrl: '', numberOfQuestions: 110, passScore: 70, certificateTemplateId: 'cert-template-main', isPractice: false },
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