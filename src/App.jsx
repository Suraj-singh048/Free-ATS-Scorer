import { useState } from 'react';
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import ResultsPanel from './components/ResultsPanel';
import LoadingSpinner from './components/LoadingSpinner';
import { Card, CardBody } from './components/ui/Card';
import { analyzeResumes } from './services/api';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (jobDescription, files, mode = 'job_match') => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const data = await analyzeResumes(jobDescription, files, mode);
      setResults(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing resumes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Header onReset={results ? handleReset : null} />

      <main className="flex-grow max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!results && !loading ? (
          /* Upload Form View */
          <div className="max-w-5xl mx-auto">
            <UploadForm onSubmit={handleSubmit} loading={loading} />
          </div>
        ) : (
          /* Results View / Loading View */
          <div className="space-y-6">
            {loading ? (
              <Card elevated className="max-w-4xl mx-auto border border-slate-200 bg-white text-slate-900 shadow-card">
                <CardBody className="py-16 text-center space-y-4">
                  <LoadingSpinner />
                  <p className="text-slate-800 text-xs sm:text-sm font-extrabold tracking-wide">
                    Extracting skills, evaluating experience relevance, and calculating ATS match ratio...
                  </p>
                </CardBody>
              </Card>
            ) : error ? (
              <Card elevated className="max-w-4xl mx-auto border border-rose-500/50 bg-slate-800">
                <CardBody>
                  <div className="p-6 bg-rose-950/40 border border-rose-700/60 text-rose-100 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="font-extrabold text-lg text-white mb-1">Analysis Exception Encountered</h3>
                        <p className="text-sm text-rose-200">{error}</p>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <ResultsPanel results={results} />
            )}
          </div>
        )}
      </main>

      {/* Executive Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 mt-12 text-slate-400">
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs sm:text-sm">
            <div className="mb-3 md:mb-0 flex items-center space-x-2">
              <span className="font-extrabold text-white tracking-tight">Free ATS Scorer</span>
              <span>•</span>
              <span className="text-slate-400">Enterprise AI Resume & Job Matching Intelligence</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>
                Developer:{' '}
                <a
                  href="https://www.linkedin.com/in/suraj-singh-093a6822a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 font-bold transition-colors underline underline-offset-2"
                >
                  Suraj Singh
                </a>
              </span>
              <span className="text-slate-700">|</span>
              <span>WCAG AA/AAA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
