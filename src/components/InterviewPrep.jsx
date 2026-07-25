import { useState } from 'react';
import { Card, CardBody } from './ui/Card';

function InterviewPrep({ prepData }) {
  const [activeType, setActiveType] = useState('all'); // all, Technical, Behavioral, Skill Gap

  const questions = prepData?.length > 0
    ? prepData
    : [
        {
          question_type: 'Technical',
          target_skill_or_gap: 'System Architecture & Scaling',
          question: 'How do you approach scaling microservice architectures under high concurrent traffic loads?',
          interviewer_intent: 'Assesses candidate depth in distributed systems, load balancing, and database optimization.',
          suggested_star_answer: 'Situation: In my previous role, our system hit 50k requests/sec causing API latency spikes.\nAction: I implemented Redis caching and decoupled background workers using Kafka.\nResult: Reduced P99 latency by 65% and handled peak Black Friday sales seamlessly.'
        },
        {
          question_type: 'Behavioral',
          target_skill_or_gap: 'Cross-Functional Leadership',
          question: 'Describe a time when you had to align technical priorities with tight business deadlines.',
          interviewer_intent: 'Evaluates stakeholder management and prioritization under pressure.',
          suggested_star_answer: 'Situation: Product requested a major feature 2 weeks prior to launch.\nAction: I led a scope negotiation session, breaking down must-haves vs post-launch enhancements.\nResult: Delivered core MVP on schedule with zero critical bugs.'
        }
      ];

  const filteredQuestions = questions.filter(
    (q) => activeType === 'all' || q.question_type?.toLowerCase() === activeType.toLowerCase()
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </span>
            <h2 className="text-xl font-display font-extrabold text-white">
              AI Interview Questions & STAR Gap Prep
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Customized technical and behavioral interview questions generated specifically to address your resume gap areas and job description requirements.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          {['all', 'Technical', 'Behavioral'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                activeType === type ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow">
            <CardBody className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-brand-100 text-brand-800 font-extrabold text-xs rounded-lg">
                    {q.question_type}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Focus: <span className="text-slate-900">{q.target_skill_or_gap}</span>
                  </span>
                </div>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-2">"{q.question}"</h3>
              <p className="text-xs text-slate-500 italic mb-4">
                💡 <span className="font-semibold">Interviewer Intent:</span> {q.interviewer_intent}
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
                  <span className="mr-1.5">⭐</span> Suggested STAR Method Answer Framework
                </h4>
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {q.suggested_star_answer}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default InterviewPrep;
