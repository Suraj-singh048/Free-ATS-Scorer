import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-3 text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-200 border-t-brand-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-brand-600 rounded-full animate-ping" />
        </div>
      </div>
      <p className="text-base font-extrabold text-slate-900">Analyzing Resumes & Job Requirements...</p>
      <p className="text-xs font-bold text-slate-700">Running AI keyword extraction & ATS match engine</p>
    </div>
  );
}

export default LoadingSpinner;
