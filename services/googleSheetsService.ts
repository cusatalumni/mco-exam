
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
    { id: 'prod-cpc', name: 'CPC', description: 'A test series designed to prepare you for the AAPC CPC (Certified Professional Coder) certification.', practiceExamId: 'exam-cpc-practice', certificationExamId: 'cpc-certification-exam' },
    { id: 'prod-cca', name: 'CCA', description: 'A test series aligned with AHIMA’s CCA (Certified Coding Associate) exam blueprint.', practiceExamId: 'exam-cca-practice', certificationExamId: 'cca-certification-exam' },
    { id: 'prod-ccs', name: 'CCS', description: 'A comprehensive test series for the AHIMA CCS (Certified Coding Specialist) credential.', practiceExamId: 'exam-ccs-practice', certificationExamId: 'ccs-certification-exam' },
    { id: 'prod-billing', name: 'Medical Billing', description: 'A test series covering core concepts in medical billing and reimbursement.', practiceExamId: 'exam-billing-practice', certificationExamId: 'medical-billing-certification' },
    { id: 'prod-risk', name: 'Risk Adjustment Coding', description: 'A test series on risk adjustment models and hierarchical condition categories (HCC).', practiceExamId: 'exam-risk-practice', certificationExamId: 'risk-adjustment-coding-certification' },
    { id: 'prod-icd', name: 'ICD-10-CM', description: 'A test series focusing on ICD-10-CM diagnosis coding proficiency.', practiceExamId: 'exam-icd-practice', certificationExamId: 'icd-10-cm-certification-exam' },
    { id: 'prod-cpb', name: 'CPB', description: 'A test series for the AAPC CPB (Certified Professional Biller) certification.', practiceExamId: 'exam-cpb-practice', certificationExamId: 'cpb-certification-exam' },
    { id: 'prod-crc', name: 'CRC', description: 'A test series on risk adjustment models and hierarchical condition categories (HCC) for the CRC certification.', practiceExamId: 'exam-crc-practice', certificationExamId: 'crc-certification-exam' },
    { id: 'prod-cpma', name: 'CPMA', description: 'A test series for the AAPC CPMA (Certified Professional Medical Auditor) certification.', practiceExamId: 'exam-cpma-practice', certificationExamId: 'cpma-certification-exam' },
    { id: 'prod-coc', name: 'COC', description: 'A test series for the AAPC COC (Certified Outpatient Coder) certification.', practiceExamId: 'exam-coc-practice', certificationExamId: 'coc-certification-exam' },
    { id: 'prod-cic', name: 'CIC', description: 'A test series for the AAPC CIC (Certified Inpatient Coder) certification.', practiceExamId: 'exam-cic-practice', certificationExamId: 'cic-certification-exam' },
    { id: 'prod-mta', name: 'Medical Terminology & Anatomy', description: 'A foundational test series covering core medical terminology and anatomy.', practiceExamId: 'exam-mta-practice', certificationExamId: 'medical-terminology-anatomy-certification' },
];

const ALL_EXAMS: Exam[] = [
    // Practice Exams
    { id: 'exam-cpc-practice', name: 'CPC Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-cca-practice', name: 'CCA Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-ccs-practice', name: 'CCS Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-billing-practice', name: 'Medical Billing Practice', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-risk-practice', name: 'Risk Adjustment Practice', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-icd-practice', name: 'ICD-10-CM Practice', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-cpb-practice', name: 'CPB Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-crc-practice', name: 'CRC Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-cpma-practice', name: 'CPMA Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-coc-practice', name: 'COC Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-cic-practice', name: 'CIC Practice Test', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    { id: 'exam-mta-practice', name: 'Medical Terminology & Anatomy Practice', description: '', price: 0, questionSourceUrl: '', numberOfQuestions: 10, passScore: 70, isPractice: true, durationMinutes: 15 },
    
    // Certification Exams - productSlug must match the WooCommerce Product SKU
    { id: 'cpc-certification-exam', productSlug: 'cpc-certification-exam', name: 'CPC Certification Exam', description: 'A comprehensive test series designed to prepare you for the AAPC CPC (Certified Professional Coder) certification. Includes 100 questions covering all major domains.', price: 150, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Proficiency in Certified Professional Coder (CPC) Concepts', body: 'For demonstrating advanced proficiency in medical coding principles, including mastery of CPT®, ICD-10-CM, and HCPCS Level II code sets. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%, reflecting preparedness for professional certification.' } },
    { id: 'cca-certification-exam', productSlug: 'cca-certification-exam', name: 'CCA Certification Exam', description: 'A test series aligned with AHIMA’s CCA (Certified Coding Associate) exam blueprint. Includes 100 questions to test your readiness.', price: 120, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Competency in Certified Coding Associate (CCA) Standards', body: 'For successfully demonstrating competency in coding standards aligned with the AHIMA CCA® exam blueprint. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%, reflecting a strong foundation in medical coding.' } },
    { id: 'ccs-certification-exam', productSlug: 'ccs-certification-exam', name: 'CCS Certification Exam', description: 'A comprehensive test series for the AHIMA CCS (Certified Coding Specialist) credential, focusing on inpatient coding scenarios with 100 questions.', price: 180, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Specialization in Certified Coding Specialist (CCS)', body: 'For demonstrating specialized skill in classifying medical data for inpatient settings, consistent with AHIMA CCS® credential standards. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%, reflecting expertise in complex coding scenarios.' } },
    { id: 'medical-billing-certification', productSlug: 'medical-billing-certification', name: 'Medical Billing Certification', description: 'A test series covering core concepts in medical billing and reimbursement.', price: 90, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Proficiency in Medical Billing', body: 'For successfully demonstrating proficiency in the principles of medical billing, reimbursement cycles, and claims processing. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%, showcasing readiness for a career in medical billing.' } },
    { id: 'risk-adjustment-coding-certification', productSlug: 'risk-adjustment-coding-certification', name: 'Risk Adjustment Coding Certification', description: 'A test series on risk adjustment models and hierarchical condition categories (HCC).', price: 110, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Specialization in Risk Adjustment Coding (CRC)', body: 'For demonstrating specialized knowledge in risk adjustment models and hierarchical condition categories (HCC), vital for the CRC® certification. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%, reflecting expertise in value-based reimbursement.' } },
    { id: 'icd-10-cm-certification-exam', productSlug: 'icd-10-cm-certification-exam', name: 'ICD-10-CM Certification Exam', description: 'A test series focusing on ICD-10-CM diagnosis coding proficiency. Includes 100 questions to master the code set.', price: 130, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Mastery in ICD-10-CM Coding', body: 'For successfully demonstrating a comprehensive mastery of the ICD-10-CM code set for diagnosis coding across various healthcare settings. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%, indicating a high level of coding accuracy and knowledge.' } },
    { id: 'cpb-certification-exam', productSlug: 'cpb-certification-exam', name: 'CPB Certification Exam', description: 'A test series for the AAPC CPB (Certified Professional Biller) certification, covering all aspects of the revenue cycle with 100 questions.', price: 100, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Proficiency in Certified Professional Biller (CPB)', body: 'For demonstrating proficiency in all aspects of the revenue cycle, consistent with the AAPC CPB® credential. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%, reflecting a thorough understanding of professional billing.' } },
    { id: 'crc-certification-exam', productSlug: 'crc-certification-exam', name: 'CRC Certification Exam', description: 'A test series on risk adjustment models and hierarchical condition categories (HCC) for the CRC certification. Includes 100 specialized questions.', price: 110, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Specialization in Certified Risk Adjustment Coder (CRC)', body: 'For demonstrating expertise in risk adjustment models and hierarchical condition category (HCC) coding for accurate reimbursement, aligned with the AAPC CRC® credential. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%.'} },
    { id: 'cpma-certification-exam', productSlug: 'cpma-certification-exam', name: 'CPMA Certification Exam', description: 'A test series for the AAPC CPMA (Certified Professional Medical Auditor) certification. Includes 100 questions on medical documentation, fraud, and abuse.', price: 160, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Specialization in Certified Professional Medical Auditor (CPMA)', body: 'For successfully demonstrating specialized skill in medical documentation auditing, fraud, and abuse detection, as required for the AAPC CPMA® credential. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%.' } },
    { id: 'coc-certification-exam', productSlug: 'coc-certification-exam', name: 'COC Certification Exam', description: 'A test series for the AAPC COC (Certified Outpatient Coder) certification, focusing on outpatient hospital and ASC settings with 100 questions.', price: 140, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Proficiency in Certified Outpatient Coder (COC)', body: 'For demonstrating proficiency in outpatient hospital and ambulatory surgery center (ASC) coding, consistent with the AAPC COC® credential. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%.' } },
    { id: 'cic-certification-exam', productSlug: 'cic-certification-exam', name: 'CIC Certification Exam', description: 'A test series for the AAPC CIC (Certified Inpatient Coder) certification, focusing on hospital inpatient facility coding with 100 questions.', price: 170, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Proficiency in Certified Inpatient Coder (CIC)', body: 'For demonstrating a high level of expertise in hospital inpatient facility coding, aligned with the AAPC CIC® credential. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%.' } },
    { id: 'medical-terminology-anatomy-certification', productSlug: 'medical-terminology-anatomy-certification', name: 'Medical Terminology & Anatomy Certification', description: 'A foundational test series covering core medical terminology and anatomy. Essential for all aspiring medical coders. Includes 100 questions.', price: 80, questionSourceUrl: '', numberOfQuestions: 100, passScore: 70, isPractice: false, durationMinutes: 150, certificate: { title: 'Certificate of Foundational Knowledge in Medical Terminology & Anatomy', body: 'For successfully establishing a strong foundational understanding of core medical terminology and human anatomy, essential for all medical coding professions. This achievement is recognized upon completion of a comprehensive examination with a score of {finalScore}%.' } },
];

// Map broader exams to the granular AI topics
const EXAM_TO_TOPIC_MAPPING: { [examId: string]: string[] } = {
    'exam-cpc-practice': ['topic-icd-10-cm', 'topic-cpt-procedural', 'topic-hcpcs-level-2'],
    'cpc-certification-exam': ['topic-icd-10-cm', 'topic-cpt-procedural', 'topic-hcpcs-level-2'],
    'exam-cca-practice': ['topic-anatomy-physiology', 'topic-medical-terminology', 'topic-compliance-auditing'],
    'cca-certification-exam': ['topic-anatomy-physiology', 'topic-medical-terminology', 'topic-compliance-auditing', 'topic-outpatient-coding'],
    'exam-ccs-practice': ['topic-inpatient-coding', 'topic-outpatient-coding', 'topic-compliance-auditing'],
    'ccs-certification-exam': ['topic-inpatient-coding', 'topic-outpatient-coding', 'topic-compliance-auditing'],
    'exam-billing-practice': ['topic-medical-billing', 'topic-hcpcs-level-2'],
    'medical-billing-certification': ['topic-medical-billing', 'topic-hcpcs-level-2'],
    'exam-risk-practice': ['topic-risk-adjustment'],
    'risk-adjustment-coding-certification': ['topic-risk-adjustment'],
    'exam-icd-practice': ['topic-icd-10-cm'],
    'icd-10-cm-certification-exam': ['topic-icd-10-cm'],
    'exam-cpb-practice': ['topic-medical-billing'],
    'cpb-certification-exam': ['topic-medical-billing'],
    'exam-crc-practice': ['topic-risk-adjustment'],
    'crc-certification-exam': ['topic-risk-adjustment'],
    'exam-cpma-practice': ['topic-compliance-auditing'],
    'cpma-certification-exam': ['topic-compliance-auditing'],
    'exam-coc-practice': ['topic-outpatient-coding'],
    'coc-certification-exam': ['topic-outpatient-coding'],
    'exam-cic-practice': ['topic-inpatient-coding'],
    'cic-certification-exam': ['topic-inpatient-coding'],
    'exam-mta-practice': ['topic-medical-terminology', 'topic-anatomy-physiology'],
    'medical-terminology-anatomy-certification': ['topic-medical-terminology', 'topic-anatomy-physiology'],
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

    submitTest: async (user: User, orgId: string, examId: string, answers: UserAnswer[], questions: Question[]): Promise<TestResult> => {
        const questionPool = questions;
        const answerMap = new Map(answers.map(a => [a.questionId, a.answer]));

        let correctCount = 0;
        const review: TestResult['review'] = [];

        questionPool.forEach(question => {
            const userAnswerIndex = answerMap.get(question.id);
            const isAnswered = userAnswerIndex !== undefined;
            const isCorrect = isAnswered && (userAnswerIndex! + 1) === question.correctAnswer;
            
            if (isCorrect) {
                correctCount++;
            }
            review.push({
                questionId: question.id,
                question: question.question,
                options: question.options,
                userAnswer: isAnswered ? userAnswerIndex! : -1, // Use -1 for unanswered
                correctAnswer: question.correctAnswer - 1,
            });
        });

        const totalQuestions = questionPool.length;
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
        const isAdmin = !!user.isAdmin;
        
        if (!result || !organization) return null;
        
        const exam = organization.exams.find(e => e.id === result.examId);
        const signatureTemplate = organization.certificateTemplates.find(t => t.id === 'cert-mco-1');

        if (result && exam && exam.certificate && signatureTemplate) {
             const canView = (exam.price > 0 && result.score >= exam.passScore) || isAdmin;
             if (canView) {
                return {
                    certificateNumber: `${result.timestamp}`,
                    candidateName: user.name,
                    finalScore: result.score,
                    date: new Date(result.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    totalQuestions: result.totalQuestions,
                    organization,
                    certificateTitle: exam.certificate.title,
                    certificateBody: exam.certificate.body,
                    signature1Name: signatureTemplate.signature1Name,
                    signature1Title: signatureTemplate.signature1Title,
                    signature2Name: signatureTemplate.signature2Name,
                    signature2Title: signatureTemplate.signature2Title,
                };
             }
        }
        return null;
    },

    getSampleCertificateData: (user: User): CertificateData => {
        const organization = mockDb.organizations[0];
        const signatureTemplate = organization.certificateTemplates[0];
        return {
            certificateNumber: '12345-SAMPLE',
            candidateName: user.name,
            finalScore: 95,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            totalQuestions: 10,
            organization,
            certificateTitle: 'Sample Certificate of Proficiency',
            certificateBody: 'For successfully demonstrating proficiency in an exam with a score of {finalScore}%. This achievement reflects dedication to excellence and preparedness for professional certification.',
            signature1Name: signatureTemplate.signature1Name,
            signature1Title: signatureTemplate.signature1Title,
            signature2Name: signatureTemplate.signature2Name,
            signature2Title: signatureTemplate.signature2Title,
        };
    },
};
