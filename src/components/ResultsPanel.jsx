import { useState } from 'react';
import { Tabs, TabList, TabButton, TabPanel } from './ui/Tab';
import { Card, CardBody } from './ui/Card';
import Badge from './ui/Badge';
import ScoreHero from './ScoreHero';

function ResultsPanel({ results }) {

  if (!results || !results.top_resumes || results.top_resumes.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardBody className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg">
            No resume analysis yet. Upload a resume and provide the job description.
          </p>
        </CardBody>
      </Card>
    );
  }

  const resume = results.top_resumes[0];

  // Handle error case
  if (resume.error) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardBody>
          <div className="p-6 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg mb-1">Analysis Error</h3>
                <p>{resume.error}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  const atsScore = resume.detailed_scoring?.ats_score?.value || resume.ats_score || 0;
  const breakdown = {
    experience_match: resume.detailed_scoring?.experience_match?.value,
    skill_proficiency: resume.detailed_scoring?.skill_proficiency?.technical_proficiency
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Score Section */}
      <ScoreHero
        score={atsScore}
        breakdown={breakdown}
        animate={true}
      />

      {/* Main Tabbed Interface */}
      <Card>
        <CardBody className="p-0">
          <Tabs defaultTab="overview">
            <TabList className="px-6 pt-4">
              <TabButton
                id="overview"
                icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                }
              >
                Overview
              </TabButton>
              <TabButton
                id="skills"
                icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                }
                badge={resume.skills_breakdown ? Object.keys(resume.skills_breakdown).length : null}
              >
                Skills Analysis
              </TabButton>
              <TabButton
                id="insights"
                icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                  </svg>
                }
              >
                AI Insights
              </TabButton>
              <TabButton
                id="recommendations"
                icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                }
              >
                Recommendations
              </TabButton>
            </TabList>

            {/* Overview Tab */}
            <TabPanel id="overview">
              <div className="p-6 space-y-6">
                {/* Quick Stats with Detailed Explanations */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Experience Match */}
                  <DetailedMetricCard
                    icon={
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    }
                    label="Experience Match"
                    value={`${breakdown.experience_match || 0}%`}
                    color="success"
                    details={resume.detailed_scoring?.experience_match}
                  />

                  {/* Skill Proficiency */}
                  <DetailedMetricCard
                    icon={
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
                      </svg>
                    }
                    label="Skill Proficiency"
                    value={`${breakdown.skill_proficiency || 0}%`}
                    color="info"
                    details={resume.detailed_scoring?.skill_proficiency}
                  />
                </div>

                {/* Component Scores Breakdown */}
                {resume.detailed_scoring?.ats_score?.component_scores && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      ATS Score Components
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {Object.entries(resume.detailed_scoring.ats_score.component_scores).map(([key, value]) => {
                        const weight = resume.detailed_scoring.ats_score.weights[key.replace('_score', '')] || 0;
                        return (
                          <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-600 mb-1 capitalize">
                              {key.replace('_score', '').replace('_', ' ')}
                            </p>
                            <p className="text-2xl font-bold text-gray-800">{value}%</p>
                            <p className="text-xs text-gray-500 mt-1">Weight: {(weight * 100).toFixed(0)}%</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Skills Summary */}
                {resume.skills_breakdown && (
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Skills Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(resume.skills_breakdown).map(([category, skills]) => {
                        const total = skills.matched.length + skills.missing.length;
                        const matchPercent = total > 0 ? Math.round((skills.matched.length / total) * 100) : 0;
                        return (
                          <div key={category} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800 capitalize">
                                {category.replace('_', ' ')}
                              </h4>
                              <span className="text-xs font-semibold text-gray-600">
                                {skills.matched.length}/{total}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className={`h-2 rounded-full ${
                                  matchPercent >= 75 ? 'bg-success-500' :
                                  matchPercent >= 50 ? 'bg-warning-500' :
                                  'bg-danger-500'
                                }`}
                                style={{ width: `${matchPercent}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600">{matchPercent}% matched</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Job Description Reference */}
                <div className="grid grid-cols-1 gap-4">
                  {results.job_description && (
                    <CollapsibleTextCard
                      title="Job Description"
                      icon={
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                      }
                      text={results.job_description}
                      color="primary"
                    />
                  )}
                </div>
              </div>
            </TabPanel>

            {/* AI Insights Tab */}
            <TabPanel id="insights">
              <div className="p-6 space-y-6">
                {resume.ai_insights && (
                  <>
                    {/* Experience Gap Analysis */}
                    {resume.ai_insights.experience_gap_analysis && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-300 rounded-lg p-6">
                        <div className="flex items-start mb-4">
                          <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Experience Gap Analysis</h3>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="bg-white rounded-lg p-3 border border-purple-200">
                                <p className="text-xs text-gray-600 mb-1">Required</p>
                                <p className="text-2xl font-bold text-purple-700">
                                  {resume.ai_insights.experience_gap_analysis.required_years || 'N/A'}
                                  {resume.ai_insights.experience_gap_analysis.required_years && ' yrs'}
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-purple-200">
                                <p className="text-xs text-gray-600 mb-1">Your Experience</p>
                                <p className="text-2xl font-bold text-purple-700">
                                  {resume.ai_insights.experience_gap_analysis.candidate_years || 'N/A'}
                                  {resume.ai_insights.experience_gap_analysis.candidate_years && ' yrs'}
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-purple-200">
                                <p className="text-xs text-gray-600 mb-1">Gap</p>
                                <p className={`text-2xl font-bold ${
                                  (resume.ai_insights.experience_gap_analysis.gap || 0) <= 0 ? 'text-success-700' : 'text-danger-700'
                                }`}>
                                  {resume.ai_insights.experience_gap_analysis.gap > 0 ? '-' : '+'}
                                  {Math.abs(resume.ai_insights.experience_gap_analysis.gap || 0)} yrs
                                </p>
                              </div>
                            </div>
                            <div className="bg-white/70 rounded-lg p-4 mb-3">
                              <p className="text-gray-800 leading-relaxed">
                                {resume.ai_insights.experience_gap_analysis.insight}
                              </p>
                            </div>
                            {resume.ai_insights.experience_gap_analysis.suggestions &&
                             resume.ai_insights.experience_gap_analysis.suggestions.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-purple-800 mb-2">Actionable Suggestions:</p>
                                <ul className="space-y-2">
                                  {resume.ai_insights.experience_gap_analysis.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start bg-white/70 rounded-lg p-3">
                                      <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="text-gray-700">{suggestion}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Critical Missing Skills with Deep Analysis */}
                    {resume.ai_insights.critical_missing_skills &&
                     resume.ai_insights.critical_missing_skills.length > 0 && (
                      <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-300 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <svg className="w-6 h-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Critical Missing Skills - Deep Analysis
                        </h3>
                        <div className="space-y-4">
                          {resume.ai_insights.critical_missing_skills.map((skillAnalysis, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-5 border-2 border-red-200 shadow-sm">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-xl font-bold text-red-700">{skillAnalysis.skill}</h4>
                                <Badge variant="danger" size="sm">Critical</Badge>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-semibold text-gray-700 mb-1">Why This Matters:</p>
                                  <p className="text-gray-600 bg-red-50/50 rounded p-3">{skillAnalysis.importance}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-700 mb-1">How to Demonstrate:</p>
                                  <p className="text-gray-600 bg-green-50/50 rounded p-3">{skillAnalysis.how_to_demonstrate}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!resume.ai_insights && (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p>AI insights not available for this analysis</p>
                  </div>
                )}
              </div>
            </TabPanel>

            {/* Skills Analysis Tab */}
            <TabPanel id="skills">
              <div className="p-6 space-y-6">
                {resume.skills_breakdown && Object.entries(resume.skills_breakdown).map(([category, skills]) => (
                  (skills.matched.length > 0 || skills.missing.length > 0) && (
                    <div key={category} className="border border-gray-200 rounded-lg p-5 bg-white">
                      <h3 className="font-semibold text-gray-800 mb-4 capitalize text-lg flex items-center">
                        {getCategoryIcon(category)}
                        <span className="ml-2">{category.replace('_', ' ')}</span>
                        <Badge variant="default" size="sm" className="ml-3">
                          {skills.matched.length + skills.missing.length} total
                        </Badge>
                      </h3>

                      {skills.matched.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-success-700 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Matched Skills ({skills.matched.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {skills.matched.map((skill, idx) => (
                              <Badge key={idx} variant="matched" size="md">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {skills.missing.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-danger-700 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Missing Skills ({skills.missing.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {skills.missing.map((skill, idx) => (
                              <Badge key={idx} variant="missing" size="md">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            </TabPanel>

            {/* Recommendations Tab */}
            <TabPanel id="recommendations">
              <div className="p-6 space-y-6">
                {resume.recommendations && (
                  <>
                    {/* Priority Skills */}
                    {resume.recommendations.skills_to_add?.length > 0 && (
                      <div className="bg-gradient-to-br from-warning-50 to-warning-100/50 border border-warning-200 rounded-lg p-5">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                          <svg className="w-5 h-5 mr-2 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Priority Skills to Add
                        </h3>
                        <div className="space-y-3">
                          {resume.recommendations.skills_to_add.slice(0, 8).map((rec, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-warning-200/50 hover:border-primary-300 transition-colors">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-semibold text-gray-900">{rec.skill}</span>
                                    <Badge
                                      variant={
                                        rec.priority === 'critical' ? 'danger' :
                                        rec.priority === 'high' ? 'warning' :
                                        rec.priority === 'medium' ? 'info' : 'default'
                                      }
                                      size="sm"
                                    >
                                      {rec.priority}
                                    </Badge>
                                    <span className="text-xs text-gray-500 capitalize">• {rec.category}</span>
                                  </div>
                                  {rec.reason && (
                                    <p className="text-sm text-gray-600">{rec.reason}</p>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <span className="text-lg font-bold text-success-600">+{rec.impact}</span>
                                </div>
                              </div>

                              {/* NEW: Suggested Experience Bullets */}
                              {rec.suggested_experience_bullets && rec.suggested_experience_bullets.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs font-semibold text-indigo-700 mb-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Suggested Resume Bullets:
                                  </p>
                                  <ul className="space-y-2">
                                    {rec.suggested_experience_bullets.map((bullet, bidx) => (
                                      <li key={bidx} className="text-sm bg-indigo-50 border border-indigo-200 rounded p-3 flex items-start">
                                        <span className="text-indigo-600 mr-2 flex-shrink-0">•</span>
                                        <span className="text-gray-700 italic">{bullet}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NEW: Experience Section Improvements */}
                    {resume.recommendations.experience_section_improvements?.length > 0 && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-300 rounded-lg p-5">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                          <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                          Experience Section - Suggested Improvements
                        </h3>
                        <div className="space-y-4">
                          {resume.recommendations.experience_section_improvements.map((imp, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 border border-blue-200">
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-red-700 mb-2 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                  Current Weakness:
                                </p>
                                <p className="text-gray-700 bg-red-50 rounded p-2 text-sm">{imp.current_weakness}</p>
                              </div>
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Suggested Bullet Point:
                                </p>
                                <p className="text-gray-800 bg-green-50 rounded p-2 text-sm font-medium italic">{imp.suggested_bullet}</p>
                              </div>
                              {imp.skills_addressed && imp.skills_addressed.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-2 border-t border-blue-100">
                                  <span className="text-xs text-gray-600 mr-2">Addresses:</span>
                                  {imp.skills_addressed.map((skill, sidx) => (
                                    <Badge key={sidx} variant="info" size="sm">{skill}</Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NEW: Project Section Improvements */}
                    {resume.recommendations.project_section_improvements?.length > 0 && (
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-300 rounded-lg p-5">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                          <svg className="w-5 h-5 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                          Project Section - Suggested Additions
                        </h3>
                        <div className="space-y-4">
                          {resume.recommendations.project_section_improvements.map((proj, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 border border-teal-200">
                              <div className="flex items-center mb-3">
                                <Badge variant="warning" size="sm" className="mr-2">Missing Skill</Badge>
                                <span className="font-semibold text-gray-900">{proj.missing_skill}</span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-teal-700 mb-2 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  Suggested Project Description:
                                </p>
                                <p className="text-gray-800 bg-teal-50 rounded p-3 text-sm italic leading-relaxed">
                                  {proj.suggested_project_description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* General Improvements */}
                    {resume.recommendations.resume_improvements?.length > 0 && (
                      <div className="bg-info-50 border border-info-200 rounded-lg p-5">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                          <svg className="w-5 h-5 mr-2 text-info-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          General Improvements
                        </h3>
                        <ul className="space-y-2">
                          {resume.recommendations.resume_improvements.map((imp, idx) => (
                            <li key={idx} className="flex items-start text-gray-700">
                              <svg className="w-5 h-5 mr-2 text-info-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Potential Score */}
                    {resume.recommendations.estimated_score_with_improvements && (
                      <div className="bg-success-50 border border-success-200 rounded-lg p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Potential ATS Score</h3>
                            <p className="text-sm text-gray-600">With all recommended improvements</p>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-success-600">
                              {resume.recommendations.estimated_score_with_improvements}%
                            </div>
                            <div className="text-sm text-success-700 font-medium">
                              +{resume.recommendations.estimated_score_with_improvements - atsScore}% improvement
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabPanel>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

// Helper component for detailed metric cards with explanations
const DetailedMetricCard = ({ icon, label, value, color, details }) => {
  const colors = {
    success: 'border-success-500 bg-success-50',
    warning: 'border-warning-500 bg-warning-50',
    danger: 'border-danger-500 bg-danger-50',
    info: 'border-info-500 bg-info-50',
    primary: 'border-primary-500 bg-primary-50',
  };

  const textColors = {
    success: 'text-success-700',
    warning: 'text-warning-700',
    danger: 'text-danger-700',
    info: 'text-info-700',
    primary: 'text-primary-700',
  };

  // Generate human-readable explanation based on metric type
  const getExplanation = () => {
    if (!details) return null;

    // Experience Match explanation
    if (label === 'Experience Match' && details.details) {
      const { level_match, years_match_percentage } = details.details;
      let explanation = '';

      if (level_match === 'below') {
        explanation = 'Your experience level is below the job requirements. ';
      } else if (level_match === 'above') {
        explanation = 'Your experience level exceeds the job requirements. ';
      } else if (level_match === 'close') {
        explanation = 'Your experience level is close to the job requirements. ';
      } else if (level_match === 'exact') {
        explanation = 'Your experience level matches the job requirements perfectly. ';
      }

      if (years_match_percentage === 0) {
        explanation += 'You have significantly less experience than required.';
      } else if (years_match_percentage < 50) {
        explanation += 'You have less experience than the role typically requires.';
      } else if (years_match_percentage < 80) {
        explanation += 'Your years of experience are somewhat aligned with the requirements.';
      } else {
        explanation += 'Your years of experience align well with the requirements.';
      }

      return explanation;
    }

    // Skill Proficiency explanation
    if (label === 'Skill Proficiency' && details.technical_proficiency !== undefined) {
      const techScore = details.technical_proficiency;
      const softScore = details.soft_skills_proficiency;

      let explanation = '';

      if (techScore >= 70) {
        explanation = 'Strong technical skills demonstrated in your resume. ';
      } else if (techScore >= 50) {
        explanation = 'Good technical foundation, but could highlight more technical depth. ';
      } else {
        explanation = 'Limited technical skill evidence in your resume. ';
      }

      if (softScore >= 70) {
        explanation += 'Excellent soft skills presentation.';
      } else if (softScore >= 50) {
        explanation += 'Adequate soft skills, consider adding specific examples.';
      } else {
        explanation += 'Soft skills need more prominence in your resume.';
      }

      return explanation;
    }

    return null;
  };

  const explanation = getExplanation();

  return (
    <div className={`p-5 rounded-lg border-l-4 ${colors[color]} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className={textColors[color]}>{icon}</div>
            <p className="text-sm text-gray-600 font-semibold ml-3">{label}</p>
          </div>
          <p className={`text-3xl font-bold ${textColors[color]} mb-3`}>{value}</p>

          {/* Human-readable Explanation */}
          {explanation && (
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for collapsible text display
const CollapsibleTextCard = ({ title, icon, text, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colors = {
    primary: 'border-primary-200 bg-primary-50',
    success: 'border-success-200 bg-success-50',
    info: 'border-info-200 bg-info-50',
  };

  const iconColors = {
    primary: 'text-primary-600',
    success: 'text-success-600',
    info: 'text-info-600',
  };

  return (
    <div className={`rounded-lg border ${colors[color]} overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/40 transition-colors"
      >
        <div className="flex items-center">
          <div className={iconColors[color]}>{icon}</div>
          <h3 className="font-semibold text-gray-800 ml-2">{title}</h3>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 pt-0">
          <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {text}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for category icons
const getCategoryIcon = (category) => {
  const icons = {
    technical_skills: (
      <svg className="w-5 h-5 text-info-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
    soft_skills: (
      <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    ),
    tools_and_technologies: (
      <svg className="w-5 h-5 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
    certifications: (
      <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  };

  return icons[category] || icons.technical_skills;
};

export default ResultsPanel;
