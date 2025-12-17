import React, { useState } from 'react';
import { CodingProblem } from '../types';
import { Code, Copy, ChevronLeft, ChevronRight, BookOpen, Cpu, FileCode, Check } from 'lucide-react';

interface CodingArenaProps {
  problems: CodingProblem[];
  onExit: () => void;
}

const CodingArena: React.FC<CodingArenaProps> = ({ problems, onExit }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const problem = problems[currentProblemIndex];

  // Advanced syntax highlighting with VS Code Dark theme colors tailored for Java
  const highlightCode = (text: string) => {
    if (!text) return '';

    // 1. Escape HTML entities
    let code = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 2. Shield Strings and Comments
    const placeholders: string[] = [];
    const shield = (match: string) => {
        placeholders.push(match);
        return `___PLACEHOLDER_${placeholders.length - 1}___`;
    };

    // Regex for strings ("...", '...') and comments (//..., /*...*/)
    code = code.replace(/(".*?"|'.*?'|\/\/.*$|\/\*[\s\S]*?\*\/)/gm, shield);

    // 3. Highlight Logic

    // Annotations: Teal
    code = code.replace(/(@\w+)/g, '<span class="text-[#4ec9b0]">$1</span>');

    // Functions: Word followed by ( -> Yellow
    code = code.replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="text-[#dcdcaa]">$1</span>');

    // Keywords: Purple
    const keywords = /\b(public|private|protected|class|interface|enum|extends|implements|static|final|abstract|try|catch|finally|throw|throws|if|else|switch|case|default|break|continue|return|for|while|do|package|import|synchronized|volatile|transient|native|strictfp|assert)\b/g;
    code = code.replace(keywords, '<span class="text-[#c586c0]">$1</span>');

    // Primitives / Special / Types: Blue
    const primitives = /\b(void|int|boolean|char|byte|short|long|float|double|new|this|super|instanceof|true|false|null|var|const)\b/g;
    code = code.replace(primitives, '<span class="text-[#569cd6]">$1</span>');

    // Classes (Heuristic: Starts with Uppercase): Teal
    code = code.replace(/\b([A-Z]\w*)\b/g, '<span class="text-[#4ec9b0]">$1</span>');

    // Numbers: Light Green
    code = code.replace(/\b(\d+)\b/g, '<span class="text-[#b5cea8]">$1</span>');

    // 4. Restore shielded content
    code = code.replace(/___PLACEHOLDER_(\d+)___/g, (_, index) => {
        const original = placeholders[Number(index)];
        const isComment = original.startsWith('//') || original.startsWith('/*');
        // Green for comments, Orange/Brown for strings
        const color = isComment ? 'text-[#6a9955]' : 'text-[#ce9178]';
        return `<span class="${color}">${original}</span>`;
    });

    return code;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(problem.solutionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-100px)] gap-6 px-4 pb-8 lg:pb-0 min-h-screen lg:min-h-0">
      {/* LEFT: Problem Statement */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shrink-0 h-auto lg:h-full order-1">
        {/* Header with Nav */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col gap-4 sticky top-0 z-10 lg:static">
             <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                     <span className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
                        <Code className="w-5 h-5" />
                     </span>
                     <h2 className="font-bold text-slate-800 text-lg">Problem {currentProblemIndex + 1}</h2>
                 </div>
                 <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-0.5 shadow-sm">
                    <button
                        onClick={() => setCurrentProblemIndex(p => Math.max(0, p - 1))}
                        disabled={currentProblemIndex === 0}
                        className="p-1.5 hover:bg-slate-50 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all text-slate-600"
                        title="Previous Problem"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <button
                        onClick={() => setCurrentProblemIndex(p => Math.min(problems.length - 1, p + 1))}
                        disabled={currentProblemIndex === problems.length - 1}
                        className="p-1.5 hover:bg-slate-50 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all text-slate-600"
                        title="Next Problem"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
             </div>
             <h3 className="text-xl font-bold text-slate-900 leading-tight">{problem.title}</h3>
        </div>

        {/* Content - Scrollable on Desktop, Auto Height on Mobile */}
        <div className="flex-1 lg:overflow-y-auto p-6 space-y-6 custom-scrollbar">
             <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p className="whitespace-pre-wrap">{problem.problemStatement}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Input Format</h4>
                    <p className="text-sm font-mono text-slate-600 bg-white p-2 rounded border border-slate-200 break-words">{problem.inputFormat}</p>
                </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Output Format</h4>
                    <p className="text-sm font-mono text-slate-600 bg-white p-2 rounded border border-slate-200 break-words">{problem.outputFormat}</p>
                </div>
             </div>

             <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Sample Test Cases</h4>
                <div className="bg-[#1e1e1e] rounded-xl p-5 font-mono text-sm shadow-md overflow-x-auto text-[#d4d4d4]">
                    <div className="mb-4 pb-4 border-b border-white/10">
                        <span className="text-slate-400 text-xs block mb-1.5 uppercase tracking-wide">Input</span>
                        <div className="bg-black/30 p-2 rounded whitespace-pre-wrap">{problem.sampleInput}</div>
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs block mb-1.5 uppercase tracking-wide">Output</span>
                        <div className="text-[#b5cea8] bg-black/30 p-2 rounded whitespace-pre-wrap">{problem.sampleOutput}</div>
                    </div>
                </div>
             </div>

             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm flex gap-2">
                 <span className="font-bold shrink-0">Constraints:</span>
                 <span className="font-mono break-all">{problem.constraints}</span>
             </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-20">
             <button onClick={onExit} className="text-slate-500 hover:text-slate-800 font-bold text-sm flex items-center gap-2 transition-colors">
                 &larr; Return to Dashboard
             </button>
        </div>
      </div>

      {/* RIGHT: Solution Viewer */}
      <div className="w-full lg:w-1/2 flex flex-col h-auto lg:h-full space-y-4 shrink-0 order-2">
           {/* Approach Card */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 shrink-0">
               <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-lg">
                   <BookOpen className="w-5 h-5 text-indigo-600" />
                   Approach & Logic
               </h3>
               <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                   {problem.approach}
               </p>
               <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
                   <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                       <Cpu className="w-3.5 h-3.5" /> Time: <span className="text-slate-800">{problem.timeComplexity}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                       <FileCode className="w-3.5 h-3.5" /> Space: <span className="text-slate-800">{problem.spaceComplexity}</span>
                   </div>
               </div>
           </div>

           {/* Code Card */}
           <div className="flex-1 bg-[#1e1e1e] rounded-2xl shadow-xl border border-slate-700 overflow-hidden flex flex-col lg:min-h-0 min-h-[400px]">
                {/* Window Controls Header */}
                <div className="flex items-center justify-between p-3 border-b border-[#333] bg-[#252526]">
                    <div className="flex items-center gap-2 px-2">
                        <div className="flex gap-1.5 group">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                        </div>
                        <span className="ml-4 text-xs font-mono text-slate-400 font-medium opacity-80">Solution.java</span>
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors flex items-center gap-2 text-xs font-medium"
                        title="Copy Code"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? <span className="text-green-400">Copied</span> : 'Copy'}
                    </button>
                </div>
                
                {/* Code Editor Area */}
                <div className="flex-1 overflow-auto custom-scrollbar bg-[#1e1e1e] flex text-sm font-mono leading-relaxed relative">
                    {/* Line Numbers */}
                    <div className="py-4 pl-3 pr-4 text-right text-[#858585] select-none bg-[#1e1e1e] sticky left-0 min-w-[3.5rem] border-r border-[#333]/50 z-10">
                        {problem.solutionCode.split('\n').map((_, i) => (
                            <div key={i} className="leading-relaxed">{i + 1}</div>
                        ))}
                    </div>
                    {/* Code Content */}
                    <div className="p-4 w-full">
                         <pre className="m-0 bg-transparent text-[#d4d4d4]" style={{ tabSize: 4, fontFamily: "Consolas, Monaco, 'Courier New', monospace" }}>
                             <code dangerouslySetInnerHTML={{ __html: highlightCode(problem.solutionCode) }} />
                         </pre>
                    </div>
                </div>
           </div>
      </div>
    </div>
  );
};

export default CodingArena;