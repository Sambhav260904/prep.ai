import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizData, CodingProblem, AnalysisResult, QuizResult } from "../types";

const apiKey = import.meta.env.VITE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to clean Markdown code blocks from JSON response
const cleanJson = (text: string): string => {
  if (!text) return "{}";
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

// System instruction based on the user's prompt
const SYSTEM_INSTRUCTION = `
You are an expert AI system designed to power an AI-based Placement Preparation Web Platform for Service-Based Companies in India (TCS, Accenture, Wipro, Infosys, etc.).
Your objective is to generate pattern-based, exam-oriented content.
Target Audience: Final-year Engineering students, Fresher job seekers.
Tone: Professional, Encouraging, Educational.
`;

const getCompanySyllabus = (company: string, section: string): string => {
  const companyLower = company.toLowerCase();
  const sectionLower = section.toLowerCase();
  
  // Generic fallback if specific mapping isn't found
  let syllabus = "Standard placement questions.";

  if (companyLower.includes('tcs')) {
    if (sectionLower.includes('aptitude')) syllabus = "TCS NQT Numerical Ability: Statistics, Probability, Time & Work, Mensuration, Number System.";
    if (sectionLower.includes('logical')) syllabus = "TCS NQT Reasoning: Data Sufficiency, Blood Relations, Seating Arrangement, Coding-Decoding.";
    if (sectionLower.includes('verbal')) syllabus = "TCS NQT Verbal: Cloze Test, Reading Comprehension, Sentence Completion, Para Jumbles.";
  } else if (companyLower.includes('accenture')) {
    if (sectionLower.includes('aptitude')) syllabus = "Accenture Cognitive: Algebra, Profit & Loss, Percentages, Equations.";
    if (sectionLower.includes('logical')) syllabus = "Accenture Critical Reasoning: Abstract Reasoning, Flowcharts, Visual Reasoning.";
    if (sectionLower.includes('verbal')) syllabus = "Accenture Verbal: Synonyms/Antonyms, Error Spotting, Sentence Correction.";
  } else if (companyLower.includes('wipro')) {
    syllabus = "Wipro NLTH Pattern: Time Speed Distance, Clocks & Calendars, Logical Deduction.";
  } else if (companyLower.includes('infosys')) {
    syllabus = "Infosys Pattern: Cryptarithmetic, Data Interpretation, Syllogisms, Critical Thinking, Puzzle Solving.";
  }

  return syllabus;
};

export const generateCompanyOverview = async (companyName: string): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
    MODULE 1: Company Exam Overview for ${companyName}.
    Generate a concise overview including:
    - Exam pattern
    - Sections & weightage
    - Difficulty level
    - Important topics
    - Time management tips
    
    Format the output as clean Markdown.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "Failed to generate overview.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error fetching company overview. Please check your API Key.";
  }
};

export const generateQuiz = async (company: string, section: string, difficulty: string): Promise<QuizData | null> => {
  try {
    const model = "gemini-2.5-flash";
    const syllabus = getCompanySyllabus(company, section);
    
    const prompt = `
    MODULE 2: Quiz Generation Engine
    Create a high-quality placement quiz for:
    - Company: ${company}
    - Section: ${section}
    - Syllabus Focus: ${syllabus}
    - Difficulty: ${difficulty}
    - Number of Questions: 25

    IMPORTANT: 
    1. Ensure questions strictly follow the pattern of ${company}.
    2. Provide a 'Structured Explanation' for each question using these headers inside the explanation string:
       - **Concept**: The underlying formula or logic.
       - **Solution**: Step-by-step calculation or reasoning.
       - **Tip**: A shortcut or quick trick if applicable.

    Return STRICT JSON compatible with the schema.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quizMeta: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                section: { type: Type.STRING },
                topic: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                timeLimit: { type: Type.STRING },
              }
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      try {
        const data = JSON.parse(cleanJson(response.text));
        // Strict Validation to prevent undefined[0] errors
        if (data && data.quizMeta && Array.isArray(data.questions) && data.questions.length > 0) {
           // Post-processing to ensure all questions have options array
           data.questions.forEach((q: any) => {
              if (!Array.isArray(q.options)) {
                q.options = [];
              }
              if (!q.explanation) {
                q.explanation = "No explanation provided.";
              }
           });
           return data as QuizData;
        }
        console.warn("Gemini returned invalid quiz structure:", data);
      } catch (e) {
        console.error("JSON Parse Error:", e);
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return null;
  }
};

export const generateCodingProblems = async (company: string, difficulty: string): Promise<CodingProblem[] | null> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
    MODULE 3: Coding Practice Generator
    Generate 3 UNIQUE coding problems for ${company} with ${difficulty} difficulty.
    These must be based on previous year ${company} question papers.
    
    For each problem, include a 'solutionCode' in Java that solves the problem efficiently.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  problemStatement: { type: Type.STRING },
                  inputFormat: { type: Type.STRING },
                  outputFormat: { type: Type.STRING },
                  constraints: { type: Type.STRING },
                  sampleInput: { type: Type.STRING },
                  sampleOutput: { type: Type.STRING },
                  approach: { type: Type.STRING },
                  timeComplexity: { type: Type.STRING },
                  spaceComplexity: { type: Type.STRING },
                  solutionCode: { type: Type.STRING, description: "Full working solution code in Java" },
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      try {
        const data = JSON.parse(cleanJson(response.text));
        if (data && Array.isArray(data.problems) && data.problems.length > 0) {
            return data.problems as CodingProblem[];
        }
      } catch (e) {
        console.error("JSON Parse Error in Coding:", e);
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Coding Error:", error);
    return null;
  }
};

export const analyzePerformance = async (result: QuizResult, company: string, section: string): Promise<AnalysisResult | null> => {
    try {
      const model = "gemini-2.5-flash";
      const prompt = `
      MODULE 4: Performance Evaluation
      Analyze these quiz results for ${company} (${section}):
      Total Questions: ${result.totalQuestions}
      Correct Answers: ${result.correctAnswers}
      Score: ${result.scorePercentage}%
      Time Taken: ${result.timeTaken} seconds
  
      Provide structured analysis in JSON.
      `;
  
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scorePercentage: { type: Type.NUMBER },
              accuracy: { type: Type.STRING },
              strengthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              nextTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          }
        }
      });
  
      if (response.text) {
        try {
          const data = JSON.parse(cleanJson(response.text));
          // Ensure arrays exist to prevent mapping errors
          if (data) {
              data.strengthAreas = Array.isArray(data.strengthAreas) ? data.strengthAreas : [];
              data.weakAreas = Array.isArray(data.weakAreas) ? data.weakAreas : [];
              data.suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
              data.nextTopics = Array.isArray(data.nextTopics) ? data.nextTopics : [];
              return data as AnalysisResult;
          }
        } catch(e) {
           console.error("JSON Parse Error in Analysis:", e);
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return null;
    }
  };

export const executeCode = async (code: string, language: string, input: string): Promise<{ output: string; success: boolean } | null> => {
  try {
      const model = "gemini-2.5-flash";
      const prompt = `
      Act as a compiler/interpreter for ${language}.
      Execute the following code:
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Input provided to stdin:
      ${input}

      If the code compiles and runs successfully, return the output.
      If there are syntax errors or runtime errors, return the error message.
      
      Strictly return JSON: { "output": "...", "success": boolean }
      `;

      const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
              systemInstruction: "You are a code execution engine. Simulate the output exactly.",
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      output: { type: Type.STRING },
                      success: { type: Type.BOOLEAN }
                  }
              }
          }
      });

      if (response.text) {
          try {
             const data = JSON.parse(cleanJson(response.text));
             if (data && typeof data.output === 'string') {
                 return data;
             }
          } catch(e) {
             console.error("Execution JSON Error:", e);
          }
      }
      return { output: "Error parsing execution result.", success: false };
  } catch (error) {
      console.error("Gemini Execution Error:", error);
      return { output: "Error executing code via AI service.", success: false };
  }
};
