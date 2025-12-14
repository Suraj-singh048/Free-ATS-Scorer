import { useState } from 'react';
import { Card, CardHeader, CardBody } from './ui/Card';
import Button from './ui/Button';
import Dropzone from './ui/Dropzone';

function UploadForm({ onSubmit, loading }) {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleTextareaChange = (e) => {
    const text = e.target.value;
    setJobDescription(text);
    setCharCount(text.length);
    if (error) setError('');
  };

  const handleFileDrop = (file) => {
    setSelectedFiles([file]);
    if (error) setError('');
  };

  const handleFileRemove = () => {
    setSelectedFiles([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please upload your resume');
      return;
    }

    onSubmit(jobDescription, selectedFiles);
  };

  const isJobDescValid = jobDescription.trim().length > 50;
  const isFileValid = selectedFiles.length > 0;

  return (
    <Card className="max-w-4xl mx-auto animate-slide-in">
      <CardHeader gradient="turquoise">
        <div className="flex items-center space-x-3">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div>
            <h2 className="text-xl font-bold">Analyze Your Resume</h2>
            <p className="text-sm text-primary-100">
              Get instant insights in seconds
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Description */}
          <div>
            <label htmlFor="job_description" className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description
            </label>
            <div className="relative">
              <textarea
                id="job_description"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 resize-none ${
                  isJobDescValid
                    ? 'border-success-300 focus:border-success-500 focus:ring-success-200 bg-success-50/30'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200 bg-white'
                }`}
                rows="8"
                placeholder="Paste the full job description here... (minimum 50 characters)"
                value={jobDescription}
                onChange={handleTextareaChange}
                disabled={loading}
                style={{ minHeight: '150px', maxHeight: '400px' }}
              />
              {isJobDescValid && (
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                Provide detailed requirements for better accuracy
              </p>
              <p className={`text-xs font-medium ${charCount < 50 ? 'text-gray-400' : 'text-success-600'}`}>
                {charCount} characters
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Resume Upload
            </label>
            <Dropzone
              accept=".pdf,.docx,.txt"
              maxSize={4 * 1024 * 1024}
              onDrop={handleFileDrop}
              file={selectedFiles[0]}
              onRemove={handleFileRemove}
            />
          </div>

          {/* Security Info Banner */}
          <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-primary-700">Secure & Private:</span> Files are processed securely and never stored.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            fullWidth
            loading={loading}
            loadingText="Analyzing Resume..."
            disabled={loading || !isJobDescValid || !isFileValid}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
            }
          >
            Analyze Resume
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

export default UploadForm;
