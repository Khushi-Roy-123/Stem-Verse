import React, { useState } from 'react';
import { analyzeResume } from '../services/geminiService';
import { ResumeAnalysisResult } from '../types';
import { SparklesIcon, CheckCircleIcon, TrophyIcon } from './icons';

const ResumeAnalyzer: React.FC = () => {
    const [resumeText, setResumeText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (resumeText.trim().length < 50) {
            setError('Please paste at least 50 characters of your resume to analyze.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        const result = await analyzeResume(resumeText);

        if (result) {
            setAnalysisResult(result);
        } else {
            setError('There was an error analyzing your resume. Please try again.');
        }

        setIsLoading(false);
    };
    
    const scoreColor = (score: number) => {
        if (score >= 8) return 'text-blue-600';
        if (score >= 5) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Side */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyze Your Resume</h2>
                    <p className="text-gray-600 mb-4">Paste your resume content below. Our AI will provide feedback to help you improve it.</p>
                    <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume here..."
                        className="w-full h-80 bg-gray-100 border border-gray-300 rounded-lg p-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || resumeText.trim() === ''}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-5 h-5" />
                                Get AI Feedback
                            </>
                        )}
                    </button>
                    {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
                </div>

                {/* Output Side */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Analysis</h3>
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                           <p>Analyzing content...</p>
                        </div>
                    )}
                    {!isLoading && !analysisResult && (
                         <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                            <TrophyIcon className="w-12 h-12 mb-4 text-blue-300"/>
                            <p>Your feedback will appear here once you submit your resume for analysis.</p>
                        </div>
                    )}
                    {analysisResult && (
                        <div className="animate-fade-in space-y-5">
                            <div className="text-center bg-gray-100 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-500">Overall Score</p>
                                <p className={`text-6xl font-bold ${scoreColor(analysisResult.score)}`}>{analysisResult.score}<span className="text-3xl text-gray-400">/10</span></p>
                                <p className="text-gray-700 mt-2">{analysisResult.overall}</p>
                            </div>
                            
                             <div>
                                <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5"/>
                                    What's Working Well
                                </h4>
                                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm pl-2">
                                    {analysisResult.positivePoints.map((point, i) => <li key={i}>{point}</li>)}
                                </ul>
                            </div>
                            
                             <div>
                                <h4 className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                                     <SparklesIcon className="w-5 h-5"/>
                                    Areas for Improvement
                                </h4>
                                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm pl-2">
                                    {analysisResult.areasForImprovement.map((point, i) => <li key={i}>{point}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalyzer;