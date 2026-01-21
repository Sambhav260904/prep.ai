import React, { useState } from 'react';
import { Company } from '../types';
import { Briefcase, Code, Brain, BookOpen, Calculator, ChevronRight, SlidersHorizontal, TrendingUp, Target, Clock, Star } from 'lucide-react';

const COMPANIES: Company[] = [
  { id: 'tcs', name: 'TCS', color: 'bg-blue-600', logo: 'T', category: 'Generalist' },
  { id: 'infosys', name: 'Infosys', color: 'bg-blue-500', logo: 'I', category: 'Generalist' },
  { id: 'wipro', name: 'Wipro', color: 'bg-indigo-600', logo: 'W', category: 'Generalist' },
  { id: 'accenture', name: 'Accenture', color: 'bg-purple-600', logo: 'A', category: 'Top Tier' },
  { id: 'cognizant', name: 'Cognizant', color: 'bg-cyan-600', logo: 'C', category: 'Top Tier' },
  { id: 'capgemini', name: 'Capgemini', color: 'bg-sky-600', logo: 'C', category: 'Top Tier' },
];

const MODULES = [
  { id: 'APTITUDE', name: 'Aptitude', icon: Calculator, desc: 'Numerical ability' },
  { id: 'LOGICAL', name: 'Logical', icon: Brain, desc: 'Critical thinking' },
  { id: 'VERBAL', name: 'Verbal', icon: BookOpen, desc: 'Grammar & Vocab' },
  { id: 'CODING', name: 'Coding', icon: Code, desc: 'Algorithms' },
];

interface DashboardProps {
  user: any;
  onStartQuiz: (company: string, section: string, difficulty: string) => void;
  onStartCoding: (company: string, difficulty: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onStartQuiz, onStartCoding }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [difficulty, setDifficulty] = useState('Medium');

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color} shadow-sm`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit mb-2">
             Welcome back, {user.name.split(' ')[0]}! 👋
           </h1>
           <p className="text-slate-500 font-medium">Your preparation roadmap is ready for today.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <p className="text-xs font-bold text-slate-700">Live Practice Server: Active</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatCard label="Total Solved" value={user.stats.solved} icon={Star} color="bg-indigo-600" />
         <StatCard label="Accuracy" value={`${user.stats.accuracy}%`} icon={TrendingUp} color="bg-emerald-500" />
         <StatCard label="Active Streak" value={`${user.stats.streak} Days`} icon={Clock} color="bg-amber-500" />
         <StatCard label="Target Company" value={selectedCompany?.name || 'None'} icon={Target} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Companies */}
        <div className="lg:col-span-4 space-y-4">
           <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-900 font-outfit flex items-center gap-2">
                 <Briefcase className="w-5 h-5 text-indigo-600" /> Target Companies
              </h2>
           </div>
           <div className="space-y-3">
              {COMPANIES.map(company => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className={`w-full group p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                    selectedCompany?.id === company.id 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600' 
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl ${company.color} flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-slate-200`}>
                    {company.logo}
                  </div>
                  <div className="text-left">
                     <h3 className="font-bold text-slate-800 group-hover:text-indigo-700">{company.name}</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{company.category}</p>
                  </div>
                  <ChevronRight className={`ml-auto w-4 h-4 transition-transform duration-300 ${selectedCompany?.id === company.id ? 'translate-x-1 text-indigo-600' : 'text-slate-300 group-hover:translate-x-1'}`} />
                </button>
              ))}
           </div>
        </div>

        {/* Right: Modules */}
        <div className="lg:col-span-8">
           {selectedCompany ? (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                   
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-3">
                           Ready for {selectedCompany.name}?
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">Choose a module to start practicing</p>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                        <select 
                          value={difficulty} 
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {MODULES.map(module => (
                        <button
                          key={module.id}
                          onClick={() => module.id === 'CODING' ? onStartCoding(selectedCompany.name, difficulty) : onStartQuiz(selectedCompany.name, module.id, difficulty)}
                          className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 text-left relative"
                        >
                          <div className="flex items-center justify-between mb-4">
                             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                <module.icon className="w-6 h-6" />
                             </div>
                             <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-wider group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                {module.id === 'CODING' ? '3 LABS' : '25 QUESTIONS'}
                             </span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700">{module.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{module.desc}</p>
                          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                             <ChevronRight className="w-5 h-5 text-indigo-600" />
                          </div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Info Tip */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-3xl text-white flex items-center justify-between shadow-xl shadow-indigo-100">
                    <div className="max-w-md">
                       <h4 className="text-lg font-bold mb-1">Did you know?</h4>
                       <p className="text-sm text-indigo-100 opacity-90 leading-relaxed">
                          {selectedCompany.name} focuses heavily on {selectedCompany.id === 'accenture' ? 'Logical flowcharts' : 'Numerical ability'} in their first round.
                       </p>
                    </div>
                    <div className="hidden sm:block">
                       <BookOpen className="w-12 h-12 text-white/20" />
                    </div>
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center p-8 space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                   <Target className="w-10 h-10" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800">No Company Selected</h3>
                   <p className="text-slate-400 max-w-xs mx-auto">Pick a company from the left panel to unlock personalized practice modules.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;