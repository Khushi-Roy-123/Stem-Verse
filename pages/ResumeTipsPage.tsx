
import React from 'react';
import { DocumentTextIcon, CheckCircleIcon, ExternalLinkIcon, DocumentIcon } from '../components/icons';
import ResumeAnalyzer from '../components/ResumeAnalyzer';

const bestPractices = [
    "Keep it to one page, especially if you have less than 10 years of experience.",
    "Use reverse-chronological order (most recent experience first).",
    "Tailor your resume for each job application by highlighting relevant skills and projects.",
    "Proofread meticulously for any spelling or grammar errors. Use a tool like Grammarly.",
    "Use a clean, professional font (e.g., Calibri, Cambria, Georgia) in a readable size (10-12pt).",
];

const atsTips = [
    "Avoid using tables, columns, headers, or footers as they can confuse ATS parsers.",
    "Use standard section headings like 'Education', 'Experience', 'Skills', 'Projects'.",
    "Submit your resume as a .pdf or .docx file unless specified otherwise.",
    "Use keywords from the job description naturally throughout your resume.",
];

const actionVerbs = ["Developed", "Engineered", "Architected", "Implemented", "Designed", "Optimized", "Analyzed", "Automated", "Collaborated", "Launched", "Validated", "Debugged"];

const ResumeTipsPage: React.FC = () => {
  return (
    <div className="animate-fade-in-up space-y-12 max-w-7xl mx-auto">
      <div className="text-center">
        <DocumentTextIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">AI-Powered Resume Hub</h1>
        <p className="text-gray-600 mt-2 max-w-3xl mx-auto">Craft a compelling resume that stands out to recruiters and Applicant Tracking Systems (ATS).</p>
      </div>

      <ResumeAnalyzer />

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">STEM Resume Best Practices</h2>
                <ul className="space-y-3">
                    {bestPractices.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">ATS-Friendly Formatting</h2>
                <ul className="space-y-3">
                    {atsTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Powerful Action Verbs for STEM</h2>
            <p className="text-gray-600 mb-4">Start your bullet points with strong verbs to showcase your accomplishments.</p>
            <div className="flex flex-wrap gap-3">
                {actionVerbs.map(verb => (
                    <span key={verb} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full font-mono text-sm">{verb}</span>
                ))}
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default ResumeTipsPage;