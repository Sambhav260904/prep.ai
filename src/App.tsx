import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, QuizData, CodingProblem, QuizResult } from '../types';
import { generateQuiz, generateCodingProblems } from '../services/geminiService';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import Quiz from '../components/Quiz';
import CodingArena from '../components/CodingArena';
import Results from '../components/Results';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  // Coding State
  const [activeProblems, setActiveProblems] = useState<CodingProblem[] | null>(null);
  
  // Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Protected Route Logic: Check for persistent session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('prep_genie_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('DASHBOARD');
    }
    // Artificial delay to prevent flash if user is logged in
    setTimeout(() => setIsInitializing(false), 500);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('prep_genie_user');
    setUser(null);
    setView('LANDING');
  };

  // Simulated Google Login
  // Note: Real Google Auth requires a GCP Project Client ID and Oauth setup.
  // This simulation mimics the experience for the frontend demo.
  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    
    // Simulate Network/Popup Delay
    setTimeout(() => {
        const mockUser: UserProfile = {
            name: "Rahul Sharma",
            college: "IIT Bombay",
            targetRole: "Software Engineer",
        };
        
        // Save session
        localStorage.setItem('prep_genie_user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setView('DASHBOARD');
        setIsLoggingIn(false);
    }, 1200);
  };

  const startQuiz = async (company: string, section: string, difficulty: string) => {
    setIsLoading(true);
    const data = await generateQuiz(company, section, difficulty);
    setIsLoading(false);
    if (data) {
      setActiveQuiz(data);
      setView('QUIZ_ACTIVE');
    } else {
      alert("Failed to generate quiz. Please check API Key or try again.");
    }
  };

  const startCoding = async (company: string, difficulty: string) => {
    setIsLoading(true);
    const problems = await generateCodingProblems(company, difficulty);
    setIsLoading(false);
    if (problems) {
      setActiveProblems(problems);
      setView('CODING_ACTIVE');
    } else {
      alert("Failed to generate problem. Please check API Key.");
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setView('RESULTS');
  };

  if (isInitializing) {
     return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
     );
  }

  // Views
  if (view === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-200/30 blur-3xl animate-pulse delay-700"></div>
             <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-3xl animate-pulse"></div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 relative z-10">
          <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 text-center animate-in zoom-in duration-500">
            <div className="mb-8 flex justify-center">
               <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 transition-transform hover:rotate-6">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
               </div>
            </div>
            
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              PrepGenie AI
            </h1>
            <p className="text-slate-500 mb-8 text-lg">
              Master your placement exams with AI-generated quizzes, coding challenges, and personalized analytics.
            </p>

            <button 
               onClick={handleGoogleLogin}
               disabled={isLoggingIn}
               className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md active:scale-[0.98] group disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                    />
                    <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                    />
                    <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                    />
                    <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                    />
                </svg>
              )}
              <span>{isLoggingIn ? 'Signing in...' : 'Continue with Google'}</span>
            </button>
            
            <p className="mt-6 text-xs text-slate-400">
               By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-indigo-50 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-indigo-600 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '0.8s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                 <svg className="w-8 h-8 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                 </svg>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-2 tracking-tight animate-pulse">
            Consulting Gemini AI
          </h2>
          <p className="text-slate-500 text-lg font-medium">Curating your personalized challenge...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      {view === 'DASHBOARD' && (
        <Dashboard onStartQuiz={startQuiz} onStartCoding={startCoding} />
      )}
      
      {view === 'QUIZ_ACTIVE' && activeQuiz && (
        <Quiz 
          data={activeQuiz} 
          onComplete={handleQuizComplete} 
          onExit={() => setView('DASHBOARD')} 
        />
      )}

      {view === 'CODING_ACTIVE' && activeProblems && (
        <CodingArena 
          problems={activeProblems} 
          onExit={() => setView('DASHBOARD')} 
        />
      )}

      {view === 'RESULTS' && quizResult && activeQuiz && (
        <Results 
          result={quizResult} 
          company={activeQuiz.quizMeta.company}
          section={activeQuiz.quizMeta.section}
          onBackToDashboard={() => setView('DASHBOARD')}
        />
      )}
    </Layout>
  );
};

export default App;