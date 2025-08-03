import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { redis } from '../../services/redis';
import { googleSheetsService } from '../../services/googleSheetsService';
import type { UserAnswer, TestResult, Exam, TokenPayload } from '../../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.ANNAPOORNA_JWT_SECRET_KEY;

    if (!secret) {
        console.error("JWT secret key is not configured on the server.");
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        const decoded = jwt.verify(token, secret) as TokenPayload;
        const userId = decoded.user.id;
        const { orgId, examId, answers } = req.body as { orgId: string, examId: string, answers: UserAnswer[] };

        if (!orgId || !examId || !answers) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        await googleSheetsService.initializeAndCategorizeExams();
        
        const examConfig = googleSheetsService.getExamConfig(orgId, examId) as Exam;
        if (!examConfig) {
             return res.status(404).json({ message: "Exam configuration not found" });
        }
        const questionPool = await googleSheetsService.getQuestions(examConfig);

        let correctCount = 0;
        const review: TestResult['review'] = [];

        answers.forEach(userAnswer => {
            const question = questionPool.find(q => q.id === userAnswer.questionId);
            if (question) {
                if ((userAnswer.answer + 1) === question.correctAnswer) correctCount++;
                review.push({
                    questionId: question.id,
                    question: question.question,
                    options: question.options,
                    userAnswer: userAnswer.answer,
                    correctAnswer: question.correctAnswer - 1
                });
            }
        });

        const totalQuestions = answers.length;
        const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
        const newResult: TestResult = {
            testId: `test-${Date.now()}`,
            userId, examId, answers,
            score: parseFloat(score.toFixed(2)),
            correctCount, totalQuestions,
            timestamp: Date.now(),
            review
        };
        
        const resultToStore = {
            ...newResult,
            answers: JSON.stringify(newResult.answers),
            review: JSON.stringify(newResult.review),
        };

        // Save to Redis
        const pipeline = redis.pipeline();
        pipeline.hset(`result:${newResult.testId}`, resultToStore);
        pipeline.sadd(`user:${userId}:results`, newResult.testId);
        await pipeline.exec();

        return res.status(200).json(newResult);

    } catch (error) {
        console.error("Error submitting test:", error);
         if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}