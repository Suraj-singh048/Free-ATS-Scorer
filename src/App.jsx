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

  const handleSubmit = async (jobDescription, files) => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const data = await analyzeResumes(jobDescription, files);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header onReset={results ? handleReset : null} />

      <main className="flex-grow container mx-auto px-4 py-8">
        {!results && !loading ? (
          /* Upload Form - Full Width When No Results */
          <div className="max-w-5xl mx-auto">
            <UploadForm onSubmit={handleSubmit} loading={loading} />
          </div>
        ) : (
          /* Results View - Stacked Layout */
          <div className="space-y-6">
            {loading ? (
              <Card className="max-w-4xl mx-auto">
                <CardBody className="py-12">
                  <LoadingSpinner />
                </CardBody>
              </Card>
            ) : error ? (
              <Card className="max-w-4xl mx-auto">
                <CardBody>
                  <div className="p-6 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-lg mb-1">Analysis Error</p>
                        <p>{error}</p>
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <div className="mb-2 md:mb-0">
              <span className="font-semibold text-gray-900">Free ATS Scorer</span>
              <span className="mx-2">•</span>
              <span>Resume Analysis & Optimization</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>
                Developer:{' '}
                <a
                  href="https://www.linkedin.com/in/suraj-singh-093a6822a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Suraj Singh
                </a>
              </span>
              <span className="text-gray-400">|</span>
              <span>© 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
