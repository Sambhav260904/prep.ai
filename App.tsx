import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, QuizData, CodingProblem, QuizResult } from './types';
import { generateQuiz, generateCodingProblems } from './services/geminiService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import CodingArena from './components/CodingArena';
import Results from './components/Results';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

// Mock Auth Service representing JWT flow
const mockAuthService = {
  login: async (email: string): Promise<UserProfile> => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    return {
      name: "Rahul Sharma",
      email,
      college: "IIT Bombay",
      targetRole: "Software Engineer",
      token: "mock-jwt-token-" + Math.random().toString(36).substr(2),
      stats: { solved: 142, streak: 8, accuracy: 78 }
    };
  },
  verify: (token: string) => token.startsWith('mock-jwt-token-'),
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Data State
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [activeProblems, setActiveProblems] = useState<CodingProblem[] | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('prep_genie_token');
    const savedUser = localStorage.getItem('prep_genie_user');
    
    if (savedToken && savedUser && mockAuthService.verify(savedToken)) {
      setUser(JSON.parse(savedUser));
      setView('DASHBOARD');
    }
    setTimeout(() => setIsInitializing(false), 800);
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const userData = await mockAuthService.login("rahul.s@example.edu");
      localStorage.setItem('prep_genie_token', userData.token!);
      localStorage.setItem('prep_genie_user', JSON.stringify(userData));
      setUser(userData);
      setView('DASHBOARD');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('prep_genie_token');
    localStorage.removeItem('prep_genie_user');
    setUser(null);
    setView('LANDING');
  };

  const startQuiz = async (company: string, section: string, difficulty: string) => {
    setIsLoading(true);
    const data = await generateQuiz(company, section, difficulty);
    setIsLoading(false);
    if (data) {
      setActiveQuiz(data);
      setView('QUIZ_ACTIVE');
    }
  };

  const startCoding = async (company: string, difficulty: string) => {
    setIsLoading(true);
    const problems = await generateCodingProblems(company, difficulty);
    setIsLoading(false);
    if (problems) {
      setActiveProblems(problems);
      setView('CODING_ACTIVE');
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">Booting PrepGenie Core</p>
      </div>
    );
  }

  if (view === 'LANDING') {
    return (
      <div className="min-h-screen bg-[#fafbff] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
           <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-violet-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-slate-100 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
           <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4 animate-in fade-in slide-in-from-top-4">
                 <Sparkles className="w-3.5 h-3.5" /> Trusted by 10k+ Students
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight font-outfit leading-[1.1]">
                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Placement</span> Code.
              </h1>
              <p className="text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 font-medium">
                The ultimate AI-powered preparation lab for service-based giants like TCS, Accenture, and Wipro. 
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                 <button 
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                 >
                   {isLoggingIn ? 'Verifying Session...' : 'Get Started Now'}
                   {!isLoggingIn && <ArrowRight className="w-5 h-5" />}
                 </button>
                 <button className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-slate-50">
                   Watch Demo
                 </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                 <div className="text-center lg:text-left">
                    <p className="text-2xl font-extrabold text-slate-900 font-outfit">200+</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company Patterns</p>
                 </div>
                 <div className="text-center lg:text-left">
                    <p className="text-2xl font-extrabold text-slate-900 font-outfit">98%</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accuracy Rate</p>
                 </div>
                 <div className="text-center lg:text-left">
                    <p className="text-2xl font-extrabold text-slate-900 font-outfit">Real</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Exam Simulations</p>
                 </div>
              </div>
           </div>

           <div className="relative group perspective-1000 hidden lg:block">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl glass-card animate-float">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                       <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-900 font-outfit">PrepGenie Smart Analysis</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module active • 08:42:11</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="h-4 bg-slate-100 rounded-full w-[90%]"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-[75%]"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-[85%]"></div>
                    <div className="pt-4 flex justify-between">
                       <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></div>
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Globe className="w-4 h-4" /></div>
                       </div>
                       <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center">System Optimized</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Layout user={user} onLogout={handleLogout} activeView={view} setView={setView}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-8 border-indigo-100 rounded-full"></div>
            <div className="w-24 h-24 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-outfit mb-2">Curating Pattern for {activeQuiz?.quizMeta?.company || 'Assessment'}...</h2>
          <p className="text-slate-500 font-medium">Gemini is analyzing millions of exam tokens to provide the best challenge.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout} activeView={view} setView={setView}>
      {view === 'DASHBOARD' && (
        <Dashboard user={user} onStartQuiz={startQuiz} onStartCoding={startCoding} />
      )}
      
      {view === 'QUIZ_ACTIVE' && activeQuiz && (
        <Quiz 
          data={activeQuiz} 
          onComplete={(r) => { setQuizResult(r); setView('RESULTS'); }} 
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