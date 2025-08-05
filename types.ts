

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface UserAnswer {
  questionId: number;
  answer: number; // The index of the selected option
}

export interface TestResult {
  testId: string;
  userId: string;
  examId: string; // Link back to the specific exam configuration
  answers: UserAnswer[];
  score: number; // Percentage
  correctCount: number;
  totalQuestions: number;
  timestamp: number;
  review: AnswerReview[];
}

export interface AnswerReview {
    questionId: number;
    question: string;
    options: string[];
    userAnswer: number; // index of user's answer
    correctAnswer: number; // index of correct answer
}

export interface CertificateData {
    certificateNumber: string;
    candidateName: string;
    finalScore: number;
    date: string;
    totalQuestions: number;
    organization: Organization;
    certificateTitle: string;
    certificateBody: string;
    signature1Name: string;
    signature1Title: string;
    signature2Name: string;
    signature2Title: string;
}

// The structure of the JWT payload coming from the main site
export interface TokenPayload {
    user: User;
    paidExamIds: string[];
    iat?: number;
    exp?: number;
}


// =================================================================
// DYNAMIC CONFIGURATION TYPES
// =================================================================

export interface CertificateTemplate {
    id: string;
    // Title and body are now per-exam
    signature1Name: string;
    signature1Title: string;
    signature2Name: string;
    signature2Title: string;
}

export interface RecommendedBook {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    affiliateLinks: { // These should be the full, final affiliate URLs
        com: string;
        in: string;
        ae: string;
    };
}

export interface Exam {
    id: string;
    name: string;
    description: string;
    price: number;
    questionSourceUrl: string;
    numberOfQuestions: number;
    passScore: number;
    certificate?: {
        title: string;
        body: string;
    };
    recommendedBook?: RecommendedBook;
    isPractice: boolean;
    productSlug?: string;
    durationMinutes?: number;
}

export interface ExamProductCategory {
    id: string;
    name: string;
    description: string;
    practiceExamId: string;
    certificationExamId: string;
}

export interface Organization {
    id: string;
    name: string;
    website: string;
    logo: string; // base64 string
    exams: Exam[];
    examProductCategories: ExamProductCategory[];
    certificateTemplates: CertificateTemplate[];
    masterBookList: RecommendedBook[];
}