import { useState } from 'react';
import { Tabs, TabList, TabButton, TabPanel } from './ui/Tab';
import { Card, CardBody } from './ui/Card';
import Badge from './ui/Badge';
import StandaloneScoreHero from './StandaloneScoreHero';

function StandaloneResultsPanel({ results }) {
  if (!results || !results.top_resumes || results.top_resumes.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardBody className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg">No standalone audit results found. Please upload a resume.</p>
        </CardBody>
      </Card>
    );
  }

  const resume = results.top_resumes[0];

  if (resume.error) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardBody>
          <div className="p-6 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg flex items-start">
            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-lg mb-1">Analysis Error</h3>
              <p>{resume.error}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  const audit = resume.standalone_analysis || {};
  const {
    overall_health_score = 70,
    summary_tagline = "General ATS Resume Audit",
    category_scores = {},
    impact_analysis = {},
    structure_analysis = {},
    brevity_analysis = {},
    skills_profile = {},
    bullet_optimizations = [],
    strengths = [],
    critical_fixes = []
  } = audit;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Score Section */}
      <StandaloneScoreHero
        score={overall_health_score}
        categoryScores={category_scores}
        tagline={summary_tagline}
        animate={true}
      />

      {/* Main Tabbed Interface */}
      <Card>
        <CardBody className="p-0">
          <Tabs defaultTab="overview">
            <TabList className="px-2 sm:px-6 pt-4">
              <TabButton
                id="overview"
                icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                }
              >
                Audit Overview
              </TabButton>

              <TabButton
                id="impact"
                icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.57l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.57l7-10a1 1 0 011.12-.384z" clipRule="evenodd" />
                  </svg>
                }
                badge={bullet_optimizations?.length || null}
              >
                Impact & Bullets
              </TabButton>

              <TabButton
                id="structure"
                icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                }
              >
                ATS Structure
              </TabButton>

              <TabButton
                id="brevity"
                icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                }
              >
                Brevity & Style
              </TabButton>

              <TabButton
                id="skills"
                icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
                  </svg>
                }
              >
                Skill Audit
              </TabButton>
            </TabList>

            {/* TAB 1: OVERVIEW */}
            <TabPanel id="overview">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Executive Summary Banner */}
                <div className="bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-200 rounded-xl p-4 sm:p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center">
                    <span className="mr-2">🔍</span> Executive Resume Audit Summary
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {summary_tagline}
                  </p>
                </div>

                {/* Top Strengths */}
                {strengths && strengths.length > 0 && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 sm:p-5">
                    <h3 className="font-bold text-emerald-900 text-base mb-3 flex items-center">
                      <svg className="w-5 h-5 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Resume Strengths
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {strengths.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-emerald-800 bg-white/80 rounded-lg p-2.5 border border-emerald-100">
                          <span className="text-emerald-500 mr-2 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Critical Fixes Roadmap */}
                {critical_fixes && critical_fixes.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-900 text-base flex items-center">
                      <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Prioritized Action Items for Resume Improvement
                    </h3>
                    <div className="space-y-3">
                      {critical_fixes.map((fix, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                            fix.priority === 'High'
                              ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                              : fix.priority === 'Medium'
                              ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                              : 'bg-blue-50/60 border-blue-200 text-blue-900'
                          }`}
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                fix.priority === 'High' ? 'bg-rose-200 text-rose-800' :
                                fix.priority === 'Medium' ? 'bg-amber-200 text-amber-800' :
                                'bg-blue-200 text-blue-800'
                              }`}>
                                {fix.priority} Priority
                              </span>
                              <span className="font-semibold text-sm">{fix.issue}</span>
                            </div>
                            <p className="text-xs sm:text-sm opacity-90 pl-1">{fix.recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabPanel>

            {/* TAB 2: IMPACT & BULLETS */}
            <TabPanel id="impact">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Quantifiable Metrics Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-brand-700">Quantified Bullets</span>
                    <div className="my-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {impact_analysis.quantified_bullets_percentage || 0}%
                      </span>
                      <span className="text-xs font-bold text-slate-700 ml-2">with metrics</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${impact_analysis.quantified_bullets_percentage || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 p-5 rounded-xl border border-emerald-200 shadow-xs flex flex-col justify-between">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800">Action Verb Strength</span>
                    <div className="my-2">
                      <span className="text-2xl font-extrabold text-emerald-950">
                        {impact_analysis.action_verb_rating || "Moderate"}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      {impact_analysis.strong_action_verbs?.length || 0} strong verbs detected
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-700">Bullets Analyzed</span>
                    <div className="my-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {impact_analysis.bullets_with_metrics_count || 0} / {impact_analysis.total_bullets_analyzed || 0}
                      </span>
                      <span className="text-xs font-bold text-slate-700 ml-2">bullets measured</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700">Aim for at least 60% quantified bullets</p>
                  </div>
                </div>

                {/* Strong Verbs Tag Cloud */}
                {impact_analysis.strong_action_verbs && impact_analysis.strong_action_verbs.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Strong Action Verbs Found in Resume</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {impact_analysis.strong_action_verbs.map((verb, idx) => (
                        <span key={idx} className="bg-emerald-100 text-emerald-950 font-bold text-xs px-3 py-1 rounded-lg border border-emerald-300">
                          ⚡ {verb}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Bullet Point Optimizer */}
                {bullet_optimizations && bullet_optimizations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center">
                      <span className="mr-2">✨</span> AI Bullet Point Optimizer & Enhancements
                    </h3>

                    <div className="space-y-4">
                      {bullet_optimizations.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold px-2.5 py-0.5 bg-brand-100 text-brand-900 rounded-full">
                              {item.category || "Impact Improvement"}
                            </span>
                            <span className="text-xs font-bold text-slate-700">Issue: {item.reason}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {/* Original */}
                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                              <p className="text-xs font-extrabold text-rose-800 mb-1">❌ Original Bullet:</p>
                              <p className="text-xs sm:text-sm font-semibold text-slate-900">{item.original_bullet}</p>
                            </div>

                            {/* Improved */}
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                              <p className="text-xs font-extrabold text-emerald-800 mb-1">✅ AI Optimized Bullet:</p>
                              <p className="text-xs sm:text-sm font-extrabold text-slate-900">{item.improved_bullet}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabPanel>

            {/* TAB 3: STRUCTURE & FORMATTING */}
            <TabPanel id="structure">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Contact Details Checklist */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center">
                    <span className="mr-2">📇</span> Essential Contact Information Checklist
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <ContactCheckItem label="Email Address" present={structure_analysis.contact_info?.email_present} />
                    <ContactCheckItem label="Phone Number" present={structure_analysis.contact_info?.phone_present} />
                    <ContactCheckItem label="LinkedIn Profile" present={structure_analysis.contact_info?.linkedin_present} />
                    <ContactCheckItem label="City / Location" present={structure_analysis.contact_info?.location_present} />
                    <ContactCheckItem label="Portfolio / GitHub" present={structure_analysis.contact_info?.portfolio_github_present} />
                  </div>
                </div>

                {/* Section Headings Audit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
                    <h4 className="font-extrabold text-emerald-950 text-sm flex items-center">
                      <span className="mr-2">✅</span> Standard Sections Detected
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {structure_analysis.sections_found?.map((sec, idx) => (
                        <span key={idx} className="bg-white text-emerald-950 border border-emerald-300 font-bold text-xs px-3 py-1 rounded-lg">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-3">
                    <h4 className="font-extrabold text-rose-950 text-sm flex items-center">
                      <span className="mr-2">⚠️</span> Missing / Non-Standard Sections
                    </h4>
                    {structure_analysis.missing_sections?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {structure_analysis.missing_sections.map((sec, idx) => (
                          <span key={idx} className="bg-white text-rose-950 border border-rose-300 font-bold text-xs px-3 py-1 rounded-lg">
                            {sec}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-800 font-extrabold">All essential standard sections detected!</p>
                    )}
                  </div>
                </div>

                {/* Parseability Notes */}
                {structure_analysis.parseability_notes && structure_analysis.parseability_notes.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">ATS Parseability & Format Notes</h4>
                    <ul className="space-y-1.5">
                      {structure_analysis.parseability_notes.map((note, idx) => (
                        <li key={idx} className="text-xs font-semibold text-slate-900 flex items-start">
                          <span className="text-brand-600 mr-2 font-bold">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabPanel>

            {/* TAB 4: BREVITY & STYLE */}
            <TabPanel id="brevity">
              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
                    <p className="text-xs font-bold text-slate-700 mb-1">Total Word Count</p>
                    <p className="text-3xl font-extrabold text-slate-900">{brevity_analysis.total_word_count || 0}</p>
                    <span className={`inline-block text-xs font-extrabold px-2.5 py-0.5 rounded mt-2 ${
                      brevity_analysis.word_count_status === 'Optimal' ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'
                    }`}>
                      {brevity_analysis.word_count_status || "Optimal"}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
                    <p className="text-xs font-bold text-slate-700 mb-1">Est. Page Length</p>
                    <p className="text-3xl font-extrabold text-slate-900">{brevity_analysis.estimated_page_count || 1} pg</p>
                    <span className="inline-block text-xs font-bold text-slate-700 mt-2">Target: 1-2 pages</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
                    <p className="text-xs font-bold text-slate-700 mb-1">Passive Voice Count</p>
                    <p className="text-3xl font-extrabold text-rose-700">{brevity_analysis.passive_voice_count || 0}</p>
                    <span className="inline-block text-xs font-bold text-slate-700 mt-2">Instances flagged</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
                    <p className="text-xs font-bold text-slate-700 mb-1">Readability Rating</p>
                    <p className="text-2xl font-extrabold text-brand-700 mt-1">{brevity_analysis.readability_level || "Professional"}</p>
                    <span className="inline-block text-xs font-bold text-slate-700 mt-2">Target: Clear & Concise</span>
                  </div>
                </div>

                {/* Buzzwords & Clichés Card */}
                {brevity_analysis.buzzwords_cliches && brevity_analysis.buzzwords_cliches.length > 0 && (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-3">
                    <h4 className="font-extrabold text-amber-950 text-sm flex items-center">
                      <span className="mr-2">⚠️</span> Overused Buzzwords & Clichés Detected
                    </h4>
                    <p className="text-xs font-bold text-slate-800">
                      Replace generic filler buzzwords with specific technical skills or quantifiable achievements:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {brevity_analysis.buzzwords_cliches.map((word, idx) => (
                        <span key={idx} className="bg-amber-200 text-amber-950 font-extrabold text-xs px-2.5 py-1 rounded-md border border-amber-300">
                          🚫 "{word}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabPanel>

            {/* TAB 5: SKILLS PROFILE */}
            <TabPanel id="skills">
              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Technical Skills */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center">
                      <span className="mr-2">💻</span> Technical Skills Detected ({skills_profile.technical_skills?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skills_profile.technical_skills?.map((skill, idx) => (
                        <span key={idx} className="bg-brand-50 text-brand-900 font-bold text-xs px-2.5 py-1 rounded-md border border-brand-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center">
                      <span className="mr-2">🤝</span> Soft & Leadership Skills ({skills_profile.soft_skills?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skills_profile.soft_skills?.map((skill, idx) => (
                        <span key={idx} className="bg-violet-50 text-violet-950 font-bold text-xs px-2.5 py-1 rounded-md border border-violet-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools & Frameworks */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center">
                      <span className="mr-2">🛠️</span> Tools & Frameworks ({skills_profile.tools_and_frameworks?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skills_profile.tools_and_frameworks?.map((tool, idx) => (
                        <span key={idx} className="bg-teal-50 text-teal-950 font-bold text-xs px-2.5 py-1 rounded-md border border-teal-200">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center">
                      <span className="mr-2">📜</span> Certifications ({skills_profile.certifications?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skills_profile.certifications?.length > 0 ? (
                        skills_profile.certifications.map((cert, idx) => (
                          <span key={idx} className="bg-emerald-50 text-emerald-950 font-bold text-xs px-2.5 py-1 rounded-md border border-emerald-200">
                            {cert}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 font-semibold">No formal certifications detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

// Sub-component for Contact Information Checklist items
const ContactCheckItem = ({ label, present }) => (
  <div className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1 shadow-xs ${
    present ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
  }`}>
    <span className="text-lg">{present ? '✅' : '❌'}</span>
    <span className="text-xs font-extrabold">{label}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider">{present ? 'Found' : 'Missing'}</span>
  </div>
);

export default StandaloneResultsPanel;
