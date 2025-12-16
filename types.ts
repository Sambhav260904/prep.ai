export type ViewState = 'LANDING' | 'DASHBOARD' | 'QUIZ_SETUP' | 'QUIZ_ACTIVE' | 'CODING_ACTIVE' | 'RESULTS';

export interface UserProfile {
  name: string;
  college: string;
  targetRole: string;
}

export interface Company {
  id: string;
  name: string;
  color: string;
  logo: string;
}

export type QuestionType = 'APTITUDE' | 'LOGICAL' | 'VERBAL' | 'CODING';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizMeta {
  company: string;
  section: string;
  topic: string;
  difficulty: string;
  timeLimit: string;
}

export interface QuizData {
  quizMeta: QuizMeta;
  questions: QuizQuestion[];
}

export interface CodingProblem {
  title: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  solutionCode: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeTaken: number; // in seconds
  details: {
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface AnalysisResult {
  scorePercentage: number;
  accuracy: string;
  strengthAreas: string[];
  weakAreas: string[];
  suggestions: string[];
  nextTopics: string[];
}