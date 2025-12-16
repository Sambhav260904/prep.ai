import React, { useState, useEffect } from 'react';
import { QuizData, QuizResult } from '../types';
import { Timer, CheckCircle, XCircle, ChevronRight, AlertCircle, Lightbulb, BookOpen, Calculator } from 'lucide-react';

interface QuizProps {
  data: QuizData;
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

const Quiz: React.FC<QuizProps> = ({ data, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ id: number; answer: string; isCorrect: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Safety check for empty data
  const currentQuestion = data.questions?.[currentQuestionIndex];

  if (!currentQuestion) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Error Loading Question</h3>
            <p className="text-slate-500 mb-6">The quiz data seems to be incomplete or malformed.</p>
            <button 
                onClick={onExit}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
                Return to Dashboard
            </button>
        </div>
    );
  }

  const progress = ((currentQuestionIndex) / data.questions.length) * 100;

  const handleOptionSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    setShowExplanation(true);

    const newAnswer = {
      id: currentQuestion.id,
      answer: selectedOption,
      isCorrect,
    };

    setAnswers([...answers, newAnswer]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsPaused(true);
    const correctCount = answers.filter(a => a.isCorrect).length;
    const result: QuizResult = {
      totalQuestions: data.questions.length,
      correctAnswers: correctCount,
      scorePercentage: Math.round((correctCount / data.questions.length) * 100),
      timeTaken: timeLeft,
      details: answers.map(a => ({
        questionId: a.id,
        userAnswer: a.answer,
        isCorrect: a.isCorrect
      }))
    };
    onComplete(result);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to render structured explanation
  const renderExplanationContent = (text: string) => {
    if (!text) return <p className="text-slate-500">No explanation provided.</p>;

    // Basic markdown-like parsing for bolding
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return (
      <div className="space-y-4">
        {text.split('\n').map((line, idx) => {
          if (!line.trim()) return null;
          
          if (line.includes('**Concept**') || line.includes('**Solution**') || line.includes('**Tip**')) {
             // Header lines
             const content = line.replace(/\*\*/g, '').replace(':', '').trim();
             let icon = <BookOpen className="w-4 h-4" />;
             let colorClass = "text-blue-700 bg-blue-50 border-blue-200";

             if (content.includes('Concept')) {
               icon = <BookOpen className="w-4 h-4" />;
               colorClass = "text-indigo-700 bg-indigo-50 border-indigo-200";
             } else if (content.includes('Solution')) {
               icon = <Calculator className="w-4 h-4" />;
               colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
             } else if (content.includes('Tip')) {
               icon = <Lightbulb className="w-4 h-4" />;
               colorClass = "text-amber-700 bg-amber-50 border-amber-200";
             }

             return (
               <div key={idx} className={`flex items-start gap-2 p-3 rounded-lg border ${colorClass}`}>
                 <div className="mt-0.5">{icon}</div>
                 <div className="font-semibold text-sm">{line.replace(/\*\*/g, '')}</div>
               </div>
             );
          }
          
          return <p key={idx} className="text-slate-600 text-sm leading-relaxed pl-1">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 pb-12">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 gap-4 sticky top-4 z-20">
        <div>
          <h2 className="font-bold text-slate-800 text-lg">{data.quizMeta.company}</h2>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {data.quizMeta.section} • {data.quizMeta.difficulty}
          </p>
        </div>
        <div className="flex items-center gap-2 text-indigo-600 font-mono font-medium bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 self-end sm:self-auto">
          <Timer className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2.5 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded">
                Question {currentQuestionIndex + 1} / {data.questions.length}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-slate-900 mb-8 leading-relaxed">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group relative overflow-hidden ";
                
                if (showExplanation) {
                  if (option === currentQuestion.correctAnswer) {
                    btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                  } else if (option === selectedOption) {
                    btnClass += "border-red-500 bg-red-50 text-red-800";
                  } else {
                    btnClass += "border-slate-100 text-slate-400 opacity-60";
                  }
                } else {
                  if (selectedOption === option) {
                    btnClass += "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm";
                  } else {
                    btnClass += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showExplanation}
                    className={btnClass}
                  >
                    <span className="font-medium relative z-10 text-sm sm:text-base">{option}</span>
                    {showExplanation && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 relative z-10 shrink-0 ml-2" />
                    )}
                    {showExplanation && option === selectedOption && option !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600 relative z-10 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <button 
              onClick={onExit}
              className="text-slate-500 hover:text-red-600 font-medium text-sm transition-colors"
            >
              Quit Session
            </button>
            
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className="bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                {currentQuestionIndex === data.questions.length - 1 ? 'See Result' : 'Next'}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Explanation Panel - Now Below */}
        {showExplanation && (
           <div className="animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4 text-indigo-900 border-b border-indigo-100 pb-3">
                   <AlertCircle className="w-5 h-5 text-indigo-600" />
                   <h4 className="font-bold">Explanation</h4>
                </div>
                
                <div className="text-slate-600 text-sm">
                   {renderExplanationContent(currentQuestion.explanation)}
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;