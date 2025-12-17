import React, { useEffect, useState } from 'react';
import { AnalysisResult, QuizResult } from '../types';
import { analyzePerformance } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Target, TrendingUp, Lightbulb, ArrowRight, RefreshCcw } from 'lucide-react';

interface ResultsProps {
  result: QuizResult;
  company: string;
  section: string;
  onBackToDashboard: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, company, section, onBackToDashboard }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const data = await analyzePerformance(result, company, section);
      setAnalysis(data);
      setLoading(false);
    };
    fetchAnalysis();
  }, [result, company, section]);

  const chartData = [
    { name: 'Your Score', value: result.scorePercentage },
    { name: 'Avg Passing', value: 70 },
    { name: 'Topper', value: 95 },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
         <h2 className="text-xl font-bold text-slate-800 mb-2">Generating Performance Report</h2>
         <p className="text-slate-500">Gemini AI is analyzing your answers and patterns...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Col: Stats */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
            <h2 className="text-slate-500 font-medium mb-4">Overall Score</h2>
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-4">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                 <circle 
                    cx="80" cy="80" r="70" 
                    stroke="#4f46e5" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * result.scorePercentage) / 100}
                    className="transition-all duration-1000 ease-out"
                 />
               </svg>
               <span className="absolute text-4xl font-bold text-slate-800">{result.scorePercentage}%</span>
            </div>
            <p className="text-sm font-medium text-slate-600 bg-slate-100 py-2 px-4 rounded-full inline-block">
              {result.correctAnswers} / {result.totalQuestions} Correct
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-64">
            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Benchmarking</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: AI Analysis */}
        <div className="w-full md:w-2/3 space-y-6">
           {analysis && (
             <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-100 p-5 rounded-xl">
                    <h3 className="flex items-center gap-2 font-bold text-green-800 mb-3">
                      <TrendingUp className="w-5 h-5" /> Strengths
                    </h3>
                    <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                      {analysis.strengthAreas?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 p-5 rounded-xl">
                    <h3 className="flex items-center gap-2 font-bold text-orange-800 mb-3">
                      <Target className="w-5 h-5" /> Focus Areas
                    </h3>
                    <ul className="list-disc list-inside text-sm text-orange-700 space-y-1">
                      {analysis.weakAreas?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
                   <h3 className="flex items-center gap-2 font-bold text-indigo-900 mb-4">
                      <Lightbulb className="w-5 h-5" /> AI Recommendations
                   </h3>
                   <div className="space-y-3">
                      {analysis.suggestions?.map((sug, i) => (
                        <div key={i} className="flex gap-3 bg-white p-3 rounded-lg border border-indigo-100/50 shadow-sm">
                           <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                             {i + 1}
                           </div>
                           <p className="text-sm text-slate-700">{sug}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4">Recommended Next Steps</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.nextTopics?.map((topic, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
             </>
           )}

           <div className="flex justify-end pt-4">
              <button 
                onClick={onBackToDashboard}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
              >
                <RefreshCcw className="w-4 h-4" />
                Back to Dashboard
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Results;