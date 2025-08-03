import type { Question, UserAnswer, TestResult, CertificateData, Organization, Exam, ExamProductCategory, User } from '../types';
import { logoBase64 } from '../assets/logo';


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
    { id: 'topic-medical-billing', name: 'Medical Billing' }, // Add new topic for mapping
];

const EXAM_PRODUCT_CATEGORIES: ExamProductCategory[] = [
    { id: 'prod-cpc', name: 'CPC', description: 'A test series designed to prepare you for the AAPC CPC (Certified Professional Coder) certification.', practiceExamId: 'exam-cpc-practice', certificationExamId: 'exam-cpc-cert' },
    { id: 'prod-cca', name: 'CCA', description: 'A test series aligned with AHIMA’s CCA (Certified Coding Associate) exam blueprint.', practiceExamId: 'exam-cca-practice', certificationExamId: 'exam-cca-cert' },
    { id: 'prod-ccs', name: 'CCS', description: 'A comprehensive test series for the AHIMA CCS (Certified Coding Specialist) credential.', practiceExamId: 'exam-ccs-practice', certificationExamId: 'exam-ccs-cert' },
    { id: 'prod-billing', name: 'Medical Billing', description: 'A test series covering core concepts in medical billing and reimbursement.', practiceExamId: 'exam-billing-practice', certificationExamId: 'exam-billing-cert' },
    { id: 'prod-risk', name: 'Risk Adjustment Coding', description: 'A test series on risk adjustment models and hierarchical condition categories (HCC).', practiceExamId: 'exam-risk-practice', certificationExamId: 'exam-risk-cert' },
    { id: 'prod-icd', name: 'ICD-10-CM', description: 'A test series focusing on ICD-10-CM diagnosis coding proficiency.', practiceExamId: 'exam-icd-practice', certificationExamId: 'exam-icd-cert' },
    { id: 'prod-cpb', name: 'CPB', description: 'A test series for the AAPC CPB (Certified Professional Biller) certification.', practiceExamId: 'exam-cpb-practice', certificationExamId: 'exam-cpb-cert' },
    { id: 'prod-crc', name: 'CRC', description: 'A test series on risk adjustment models and hierarchical condition categories (HCC) for the CRC certification.', practiceExamId: 'exam-crc-practice', certificationExamId: 'exam-crc-cert' },
    { id: 'prod-cpma', name: 'CPMA', description: 'A test series for the AAPC CPMA (Certified Professional Medical Auditor) certification.', practiceExamId: 'exam-cpma-practice', certificationExamId: 'exam-cpma-cert' },
    { id: 'prod-coc', name: 'COC', description: 'A test series for the AAPC COC (Certified Outpatient Coder) certification.', practiceExamId: 'exam-coc-practice', certificationExamId: 'exam-coc-cert' },
    { id: 'prod-cic', name: 'CIC', description: 'A test series for the AAPC CIC (Certified Inpatient Coder) certification.', practiceExamId: 'exam-cic-practice', certificationExamId: 'exam-cic-cert' },
    { id: 'prod-mta', name: 'Medical Terminology & Anatomy', description: 'A foundational test series covering core medical terminology and anatomy.', practiceExamId: 'exam-mta-practice', certificationExamId: 'exam-mta-cert' },
];

const ALL_EXAMS: Exam[] = [
    // CPC
    { id: 'exam-cpc-practice', name: 'CPC Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cpc-cert', name: 'CPC Certification Exam', description: 'A comprehensive test series designed to prepare you for the AAPC CPC (Certified Professional Coder) certification. Includes 150 questions covering all major domains.', price: 150, questionSourceUrl: '', numberOfQuestions: 150, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
    // CCA
    { id: 'exam-cca-practice', name: 'CCA Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cca-cert', name: 'CCA Certification Exam', description: 'A test series aligned with AHIMA’s CCA (Certified Coding Associate) exam blueprint. Includes 100 questions to test your readiness.', price: 120, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
    // CCS
    { id: 'exam-ccs-practice', name: 'CCS Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-ccs-cert', name: 'CCS Certification Exam', description: 'A comprehensive test series for the AHIMA CCS (Certified Coding Specialist) credential, focusing on inpatient coding scenarios with 120 questions.', price: 180, questionSourceUrl: '', numberOfQuestions: 120, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
    // Billing
    { id: 'exam-billing-practice', name: 'Medical Billing Practice', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-billing-cert', name: 'Medical Billing', description: 'A test series covering core concepts in medical billing and reimbursement.', price: 90, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
    // Risk
    { id: 'exam-risk-practice', name: 'Risk Adjustment Practice', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-risk-cert', name: 'Risk Adjustment Coding', description: 'A test series on risk adjustment models and hierarchical condition categories (HCC).', price: 110, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
     // ICD
    { id: 'exam-icd-practice', name: 'ICD-10-CM Practice', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-icd-cert', name: 'ICD-10-CM Certification Exam', description: 'A test series focusing on ICD-10-CM diagnosis coding proficiency. Includes 110 questions to master the code set.', price: 130, questionSourceUrl: '', numberOfQuestions: 110, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
    // CPB
    { id: 'exam-cpb-practice', name: 'CPB Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cpb-cert', name: 'CPB Certification Exam', description: 'A test series for the AAPC CPB (Certified Professional Biller) certification, covering all aspects of the revenue cycle with 80 questions.', price: 100, questionSourceUrl: '', numberOfQuestions: 80, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
    // CRC
    { id: 'exam-crc-practice', name: 'CRC Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-crc-cert', name: 'CRC Certification Exam', description: 'A test series on risk adjustment models and hierarchical condition categories (HCC) for the CRC certification. Includes 90 specialized questions.', price: 110, questionSourceUrl: '', numberOfQuestions: 90, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
    // CPMA
    { id: 'exam-cpma-practice', name: 'CPMA Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cpma-cert', name: 'CPMA Certification Exam', description: 'A test series for the AAPC CPMA (Certified Professional Medical Auditor) certification. Includes 100 questions on medical documentation, fraud, and abuse.', price: 160, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
    // COC
    { id: 'exam-coc-practice', name: 'COC Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-coc-cert', name: 'COC Certification Exam', description: 'A test series for the AAPC COC (Certified Outpatient Coder) certification, focusing on outpatient hospital and ASC settings with 100 questions.', price: 140, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
    // CIC
    { id: 'exam-cic-practice', name: 'CIC Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-cic-cert', name: 'CIC Certification Exam', description: 'A test series for the AAPC CIC (Certified Inpatient Coder) certification, focusing on hospital inpatient facility coding with 100 questions.', price: 170, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
    // MTA
    { id: 'exam-mta-practice', name: 'Medical Terminology & Anatomy Practice', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, certificateTemplateId: '', isPractice: true },
    { id: 'exam-mta-cert', name: 'Medical Terminology & Anatomy Certification', description: 'A foundational test series covering core medical terminology and anatomy. Essential for all aspiring medical coders. Includes 80 questions.', price: 80, questionSourceUrl: '', numberOfQuestions: 80, passScore: 70, certificateTemplateId: 'cert-mco-1', isPractice: false },
];

// Map broader exams to the granular AI topics
const EXAM_TO_TOPIC_MAPPING: { [examId: string]: string[] } = {
    'exam-cpc-practice': ['topic-icd-10-cm', 'topic-cpt-procedural', 'topic-hcpcs-level-2'],
    'exam-cpc-cert': ['topic-icd-10-cm', 'topic-cpt-procedural', 'topic-hcpcs-level-2'],
    'exam-cca-practice': ['topic-anatomy-physiology', 'topic-medical-terminology', 'topic-compliance-auditing'],
    'exam-cca-cert': ['topic-anatomy-physiology', 'topic-medical-terminology', 'topic-compliance-auditing', 'topic-outpatient-coding'],
    'exam-ccs-practice': ['topic-inpatient-coding', 'topic-outpatient-coding', 'topic-compliance-auditing'],
    'exam-ccs-cert': ['topic-inpatient-coding', 'topic-outpatient-coding', 'topic-compliance-auditing'],
    'exam-billing-practice': ['topic-medical-billing', 'topic-hcpcs-level-2'],
    'exam-billing-cert': ['topic-medical-billing', 'topic-hcpcs-level-2'],
    'exam-risk-practice': ['topic-risk-adjustment'],
    'exam-risk-cert': ['topic-risk-adjustment'],
    'exam-icd-practice': ['topic-icd-10-cm'],
    'exam-icd-cert': ['topic-icd-10-cm'],
    'exam-cpb-practice': ['topic-medical-billing'],
    'exam-cpb-cert': ['topic-medical-billing'],
    'exam-crc-practice': ['topic-risk-adjustment'],
    'exam-crc-cert': ['topic-risk-adjustment'],
    'exam-cpma-practice': ['topic-compliance-auditing'],
    'exam-cpma-cert': ['topic-compliance-auditing'],
    'exam-coc-practice': ['topic-outpatient-coding'],
    'exam-coc-cert': ['topic-outpatient-coding'],
    'exam-cic-practice': ['topic-inpatient-coding'],
    'exam-cic-cert': ['topic-inpatient-coding'],
    'exam-mta-practice': ['topic-medical-terminology', 'topic-anatomy-physiology'],
    'exam-mta-cert': ['topic-medical-terminology', 'topic-anatomy-physiology'],
};


const MASTER_QUESTION_SOURCE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMFALpdYSsjcnERF1wOpcnIT2qrRAZoyJYzc5T8_xq_Q3eQjAJJH30iDMMlO2tKhIYYKdOVBiPqF3Y/pub?gid=743667979&single=true&output=csv';

let mockDb: {
    organizations: Organization[];
} = {
    organizations: [
        {
            id: 'org-mco',
            name: 'Medical Coding Online',
            website: 'www.coding-online.net',
            logo: logoBase64,
            exams: ALL_EXAMS.map(exam => ({
                ...exam,
                recommendedBook: exam.isPractice ? undefined : {
                    title: 'Official CPC Certification Study Guide',
                    description: 'The most comprehensive guide to prepare for your certification. Includes practice questions and detailed explanations to master the material.',
                    imageUrl: 'https://placehold.co/300x400/003366/FFFFFF/png?text=Study+Guide',
                    affiliateLinks: {
                        com: 'https://www.amazon.com/dp/164018398X?tag=mykada-20',
                        in: 'https://www.amazon.in/dp/164018398X?tag=httpcodingonl-21',
                        ae: 'https://amzn.to/46QduHx'
                    }
                }
            })),
            examProductCategories: EXAM_PRODUCT_CATEGORIES,
            certificateTemplates: [
                {
                    id: 'cert-mco-1',
                    title: 'Medical Coding Proficiency',
                    body: 'For successfully demonstrating proficiency in medical coding, including mastery of ICD-10-CM, CPT, HCPCS Level II, and coding guidelines through the completion of a comprehensive Examination with a score of {finalScore}%. This achievement reflects dedication to excellence in medical coding and preparedness for professional certification.',
                    signature1Name: 'Dr. Amelia Reed',
                    signature1Title: 'Program Director',
                    signature2Name: 'B. Manoj',
                    signature2Title: 'Chief Instructor'
                }
            ]
        }
    ]
};

const allQuestionsCache = new Map<string, Question[]>();
const categorizedQuestionsCache = new Map<string, Question[]>();

const _getResultsFromStorage = (userId: string): TestResult[] => {
    try {
        const storedResults = localStorage.getItem(`results_${userId}`);
        return storedResults ? JSON.parse(storedResults) : [];
    } catch (e) {
        console.error("Failed to parse results from localStorage", e);
        return [];
    }
};

const _saveResultsToStorage = (userId: string, results: TestResult[]): void => {
    try {
        localStorage.setItem(`results_${userId}`, JSON.stringify(results));
    } catch (e) {
        console.error("Failed to save results to localStorage", e);
    }
};


const fetchAndParseAllQuestions = async (url: string): Promise<Question[]> => {
    if (allQuestionsCache.has(url)) {
        return allQuestionsCache.get(url)!;
    }
    try {
        const response = await fetch(`${url}&_=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/csv')) {
            throw new Error('Received incorrect file type from Google Sheets.');
        }

        const csvText = await response.text();
        const lines = csvText.trim().split(/\r\n|\r|\n/).slice(1).filter(line => line.trim() !== '');

        const questions: Question[] = lines.map((line, index) => {
            try {
                const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                if (columns.length < 3) return null;

                const [questionStr, optionsStr, correctAnswerStr] = columns.map(c => c.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
                if (!questionStr || !optionsStr || !correctAnswerStr) return null;

                const correctAnswerNum = parseInt(correctAnswerStr, 10);
                if (isNaN(correctAnswerNum)) return null;

                const options = optionsStr.split('|');
                if (options.length < 2) return null;

                return { id: index + 1, question: questionStr, options, correctAnswer: correctAnswerNum };
            } catch {
                return null;
            }
        }).filter((q): q is Question => q !== null);
        
        if (questions.length === 0) throw new Error("No questions parsed from the sheet.");
        
        allQuestionsCache.set(url, questions);
        return questions;
    } catch (error) {
        console.error("Error fetching or parsing questions:", error);
        throw error;
    }
};

export const googleSheetsService = {
    initializeAndCategorizeExams: async (): Promise<void> => {
        if (categorizedQuestionsCache.size > 0) return; // Already initialized
        
        const allQuestions = await fetchAndParseAllQuestions(MASTER_QUESTION_SOURCE_URL);

        AI_EXAM_TOPICS.forEach(cat => {
             categorizedQuestionsCache.set(cat.id, allQuestions);
        });
    },
    
    getOrganizations: (): Organization[] => mockDb.organizations,
    
    getExamConfig: (orgId: string, examId: string): Exam | undefined => {
        const org = mockDb.organizations.find(o => o.id === orgId);
        return org?.exams.find(e => e.id === examId);
    },
    
    getQuestions: async (examConfig: Exam): Promise<Question[]> => {
        const topicIds = EXAM_TO_TOPIC_MAPPING[examConfig.id];
        if (!topicIds) {
            throw new Error(`No topic mapping found for exam: ${examConfig.name}`);
        }
        
        let combinedQuestions: Question[] = [];
        topicIds.forEach(topicId => {
            const questionsForTopic = categorizedQuestionsCache.get(topicId);
            if(questionsForTopic) {
                combinedQuestions.push(...questionsForTopic);
            }
        });
        
        const uniqueQuestions = Array.from(new Map(combinedQuestions.map(q => [q.id, q])).values());

        if (uniqueQuestions.length === 0) {
             throw new Error(`No questions found for the topics related to: ${examConfig.name}`);
        }

        const shuffled = [...uniqueQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(examConfig.numberOfQuestions, shuffled.length));
    },

    submitTest: async (user: User, orgId: string, examId: string, answers: UserAnswer[]): Promise<TestResult> => {
        await googleSheetsService.initializeAndCategorizeExams();
        const examConfig = googleSheetsService.getExamConfig(orgId, examId);
        if (!examConfig) {
            throw new Error("Exam configuration not found");
        }
        const questionPool = await googleSheetsService.getQuestions(examConfig);

        let correctCount = 0;
        const review: TestResult['review'] = [];

        answers.forEach(userAnswer => {
            const question = questionPool.find(q => q.id === userAnswer.questionId);
            if (question) {
                if ((userAnswer.answer + 1) === question.correctAnswer) {
                    correctCount++;
                }
                review.push({
                    questionId: question.id,
                    question: question.question,
                    options: question.options,
                    userAnswer: userAnswer.answer,
                    correctAnswer: question.correctAnswer - 1,
                });
            }
        });

        const totalQuestions = answers.length;
        const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
        const newResult: TestResult = {
            testId: `test-${Date.now()}`,
            userId: user.id,
            examId,
            answers,
            score: parseFloat(score.toFixed(2)),
            correctCount,
            totalQuestions,
            timestamp: Date.now(),
            review,
        };

        const allUserResults = _getResultsFromStorage(user.id);
        allUserResults.push(newResult);
        _saveResultsToStorage(user.id, allUserResults);

        return Promise.resolve(newResult);
    },
    
    getTestResult: async(user: User, testId: string): Promise<TestResult | null> => {
        const allUserResults = _getResultsFromStorage(user.id);
        const result = allUserResults.find(r => r.testId === testId && r.userId === user.id);
        return Promise.resolve(result || null);
    },
    
    getTestResultsForUser: async(user: User): Promise<TestResult[]> => {
        const results = _getResultsFromStorage(user.id);
        results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        return Promise.resolve(results);
    },

    getCertificateData: async (user: User, testId: string, orgId: string): Promise<CertificateData | null> => {
        if (testId === 'sample') return googleSheetsService.getSampleCertificateData(user);

        const result = await googleSheetsService.getTestResult(user, testId);
        const organization = mockDb.organizations.find(o => o.id === orgId);
        
        if (!result || !organization) return null;
        
        const exam = organization.exams.find(e => e.id === result.examId);
        const template = organization.certificateTemplates.find(t => t.id === exam?.certificateTemplateId);

        if (result && exam && template && exam.price > 0 && result.score >= exam.passScore) {
            return {
                certificateNumber: `${result.timestamp}`,
                candidateName: user.name, finalScore: result.score,
                date: new Date(result.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                totalQuestions: result.totalQuestions, organization, template
            };
        }
        return null;
    },

    getSampleCertificateData: (user: User): CertificateData => {
        const organization = mockDb.organizations[0];
        const template = organization.certificateTemplates[0];
        return {
            certificateNumber: '12345-SAMPLE',
            candidateName: user.name,
            finalScore: 95,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            totalQuestions: 10,
            organization,
            template
        };
    },
};