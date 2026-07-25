import { useState } from 'react';
import { Card, CardBody } from './ui/Card';

function CoverLetterGenerator({ coverLetterData, fileName }) {
  const [copied, setCopied] = useState(false);

  const letterText =
    coverLetterData?.full_letter_text ||
    `Dear Hiring Manager,\n\nI am writing to express my strong interest in the target role. With my background in software development, technical project management, and scalable architecture, I am confident in my ability to deliver immediate impact.\n\nThroughout my career, I have consistently driven technical solutions, optimized performance, and collaborated across multi-functional teams. My experience aligns directly with the core requirements of your team.\n\nThank you for your time and consideration. I look forward to discussing how my skills and experience can contribute to your organization's goals.\n\nSincerely,\nCandidate`;

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="p-2 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <h2 className="text-xl font-display font-extrabold text-white">
              AI Tailored Cover Letter Generator
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            A custom cover letter generated specifically for this job description, highlighting candidate experience overlaps and key technical qualifications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-2 shrink-0"
        >
          {copied ? (
            <span>Copied to Clipboard!</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Copy Cover Letter</span>
            </>
          )}
        </button>
      </div>

      {/* Main Cover Letter Document View */}
      <Card className="max-w-4xl mx-auto shadow-md">
        <CardBody className="p-8 sm:p-12">
          <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">
              {coverLetterData?.headline || 'Tailored Application Cover Letter'}
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Ready to Send
            </span>
          </div>

          <div className="prose text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {letterText}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default CoverLetterGenerator;
