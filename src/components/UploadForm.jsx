import { useState } from 'react';
import { Card, CardHeader, CardBody } from './ui/Card';
import Button from './ui/Button';
import Dropzone from './ui/Dropzone';
import SegmentedControl from './ui/SegmentedControl';

const SAMPLE_JDS = [
  {
    title: 'Senior Software Engineer',
    text: `We are looking for a Senior Software Engineer with 5+ years of experience building scalable web applications. Standard requirements include proficiency in React, Node.js, JavaScript, TypeScript, REST APIs, GraphQL, SQL/NoSQL databases, Docker, AWS cloud infrastructure, CI/CD pipelines, and microservices architecture. Strong problem-solving skills, automated unit testing, and agile team collaboration are highly required.`
  },
  {
    title: 'Product Manager',
    text: `Seeking a Product Manager to lead cross-functional product strategy and user growth. Requirements include roadmap development, Agile/Scrum, user research, data analytics, product analytics (Mixpanel/Amplitude), SQL, A/B testing, cross-functional stakeholder management, wireframing, feature prioritization, customer discovery, and product lifecycle management.`
  },
  {
    title: 'Data Analyst',
    text: `Looking for a Data Analyst proficient in SQL, Python, Tableau/PowerBI, ETL data pipelines, statistical analysis, Excel modeling, data visualization, business intelligence, metrics tracking, and presentation of quantitative insights to executive stakeholders.`
  }
];

function UploadForm({ onSubmit, loading }) {
  const [mode, setMode] = useState('job_match'); // 'job_match' | 'resume_only'
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

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const loadSampleJD = (sampleText) => {
    setJobDescription(sampleText);
    setCharCount(sampleText.length);
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'job_match' && !jobDescription.trim()) {
      setError('Please enter or paste a job description.');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please select or upload your resume file (PDF, DOCX, or TXT).');
      return;
    }

    onSubmit(jobDescription, selectedFiles, mode);
  };

  const isJobDescValid = jobDescription.trim().length >= 40;
  const isFileValid = selectedFiles.length > 0;
  const isSubmitDisabled = loading || !isFileValid || (mode === 'job_match' && !isJobDescValid);

  const modeOptions = [
    {
      id: 'job_match',
      label: '🎯 Target Job Match',
      badge: 'JD + Resume',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 'resume_only',
      label: '📄 Standalone ATS Audit',
      badge: 'Resume Only',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <Card elevated className="w-full shadow-card border border-slate-200 animate-slide-in">
      <CardHeader variant={mode === 'job_match' ? 'brand' : 'violet'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/15">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-white">
                {mode === 'job_match' ? 'Job Description & Resume Analysis' : 'Standalone Resume Audit'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {mode === 'job_match'
                  ? 'Compare your resume against a target job posting to uncover missing keywords & match percentage.'
                  : 'Evaluate resume formatting, active verb power, scannability, and structural impact without a job posting.'}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-6 p-6 sm:p-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Select Analysis Mode
          </label>
          <SegmentedControl
            options={modeOptions}
            value={mode}
            onChange={handleModeSwitch}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`grid grid-cols-1 ${mode === 'job_match' ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6 items-start`}>
            {mode === 'job_match' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="job_description" className="block text-sm font-bold text-slate-900">
                    Target Job Description <span className="text-rose-600">*</span>
                  </label>
                  <span className={`text-xs font-bold ${charCount < 40 ? 'text-slate-400' : 'text-emerald-700'}`}>
                    {charCount} chars
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="job_description"
                    className={`w-full px-4 py-3 text-sm font-medium text-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-150 resize-none shadow-xs ${
                      isJobDescValid
                        ? 'border-emerald-400 bg-emerald-50/20 focus:border-emerald-600 focus:ring-emerald-200'
                        : 'border-slate-300 bg-white focus:border-brand-500'
                    }`}
                    rows="8"
                    placeholder="Paste the full job description here (responsibilities, required skills, qualifications)..."
                    value={jobDescription}
                    onChange={handleTextareaChange}
                    disabled={loading}
                    style={{ minHeight: '220px', maxHeight: '420px' }}
                  />
                  {isJobDescValid && (
                    <div className="absolute top-3 right-3 p-1 bg-emerald-100 rounded-full">
                      <svg className="w-4 h-4 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-600 block mb-1.5">Load Sample Job Description:</span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_JDS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => loadSampleJD(sample.text)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 border border-slate-200 transition-colors"
                      >
                        + {sample.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Upload Resume File <span className="text-rose-600">*</span>
                </label>
                <Dropzone
                  accept=".pdf,.docx,.txt"
                  maxSize={5 * 1024 * 1024}
                  onDrop={handleFileDrop}
                  file={selectedFiles[0]}
                  onRemove={handleFileRemove}
                />
              </div>

              {mode === 'resume_only' ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-slate-800">
                  <div className="flex items-center space-x-2 text-violet-900 font-bold text-sm">
                    <svg className="w-5 h-5 text-violet-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Standalone Resume Audit Mode</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Evaluates resume format scannability, section header layout, quantitative metrics ratio, active verb strength, and brevity score without needing a job description.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-slate-800">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                    <svg className="w-5 h-5 text-brand-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Target Job Match Mode</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Compares your resume against the target role requirements to calculate exact skill overlap, hard skill gaps, soft skill alignment, and structural match.
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-950 font-semibold rounded-xl flex items-center shadow-xs">
              <svg className="w-5 h-5 mr-2.5 text-rose-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant={mode === 'resume_only' ? 'violet' : 'gradient'}
              size="lg"
              fullWidth
              loading={loading}
              loadingText={mode === 'resume_only' ? 'Auditing Resume Quality & Structure...' : 'Running Job Match Intelligence...'}
              disabled={isSubmitDisabled}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              {mode === 'resume_only' ? 'Audit Standalone Resume Quality' : 'Analyze Target Job Match'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default UploadForm;
