import { useState } from 'react';
import { Card, CardBody } from './ui/Card';
import Badge from './ui/Badge';

function AtsTextVisualizer({ rawText, fileName, formattingChecks }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!rawText) return;
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = rawText ? rawText.trim().split(/\s+/).filter(Boolean).length : 0;
  const characterCount = rawText ? rawText.length : 0;
  const lineCount = rawText ? rawText.split('\n').filter(Boolean).length : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="p-2 bg-brand-500/20 text-brand-400 rounded-xl border border-brand-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </span>
            <h2 className="text-xl font-display font-extrabold text-white">
              Raw ATS Text Parser Debugger
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            This visualizer displays the exact plain text extracted by commercial ATS algorithms (Workday, Taleo, Greenhouse) from <span className="text-brand-300 font-bold">{fileName}</span>. Use this to verify that no sections, contact details, or job titles were lost or scrambled.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-2 shrink-0"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied Extracted Text!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Copy Plain Text</span>
            </>
          )}
        </button>
      </div>

      {/* Parser Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Word Count</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{wordCount}</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Extracted Words</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lines Extracted</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{lineCount}</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Text Line Breaks</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Characters</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{characterCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Raw Character Count</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parse Health</p>
          <p className={`text-2xl font-extrabold mt-1 ${
            (formattingChecks?.parsing_health_score || 90) >= 80 ? 'text-emerald-600' : 'text-amber-600'
          }`}>
            {formattingChecks?.parsing_health_score || 90}%
          </p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Parser Accuracy Score</p>
        </div>
      </div>

      {/* Main Text Content Visualizer */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 flex items-center">
              <svg className="w-5 h-5 text-brand-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Extracted Plain Text Stream
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              Monospaced Plain Text
            </span>
          </div>

          <div className="bg-slate-950 text-slate-200 p-5 rounded-xl font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto max-h-[500px] shadow-inner border border-slate-800">
            {rawText ? (
              <pre className="whitespace-pre-wrap font-mono break-words">{rawText}</pre>
            ) : (
              <p className="text-slate-500 italic">No raw text stream available for this document.</p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default AtsTextVisualizer;
