import { useState, useMemo } from 'react';

function WhatIfSimulator({ result }) {
  const [addedSkills, setAddedSkills] = useState({
    technical_skills: [],
    soft_skills: [],
    tools_and_technologies: [],
    certifications: []
  });

  const calculator = result.what_if_calculator;
  const baseScore = result.ats_score;
  const missingSkills = result.skills_breakdown;

  const simulatedScore = useMemo(() => {
    if (!calculator || !calculator.impact_per_skill) {
      return baseScore;
    }

    let newScore = baseScore;

    Object.keys(addedSkills).forEach(category => {
      const count = addedSkills[category]?.length || 0;
      if (count > 0) {
        const weightKeyMap = {
          technical_skills: 'technical_skill_weight',
          soft_skills: 'soft_skill_weight',
          tools_and_technologies: 'tool_weight',
          certifications: 'certification_weight'
        };
        const weightKey = weightKeyMap[category];
        const impactPerSkill = calculator.impact_per_skill[weightKey] || 0;
        const categoryImpact = count * impactPerSkill;
        newScore += categoryImpact;
      }
    });

    return Math.min(100, Math.round(newScore * 100) / 100);
  }, [addedSkills, baseScore, calculator]);

  const handleAddSkill = (category, skill) => {
    if (!addedSkills[category].includes(skill)) {
      setAddedSkills(prev => ({
        ...prev,
        [category]: [...prev[category], skill]
      }));
    }
  };

  const handleRemoveSkill = (category, skill) => {
    setAddedSkills(prev => ({
      ...prev,
      [category]: prev[category].filter(s => s !== skill)
    }));
  };

  const handleReset = () => {
    setAddedSkills({
      technical_skills: [],
      soft_skills: [],
      tools_and_technologies: [],
      certifications: []
    });
  };

  const scoreIncrease = simulatedScore - baseScore;
  const totalAddedSkills = Object.values(addedSkills).reduce((sum, arr) => sum + arr.length, 0);

  const categoryNames = {
    technical_skills: 'Technical Skills',
    soft_skills: 'Soft Skills',
    tools_and_technologies: 'Tools & Technologies',
    certifications: 'Certifications'
  };

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 mt-6 shadow-soft">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-100 rounded-xl text-brand-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900">
              Interactive What-If Score Simulator
            </h3>
            <p className="text-xs font-semibold text-slate-600">
              Toggle missing skills below to project instant score increases in real time.
            </p>
          </div>
        </div>

        {totalAddedSkills > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-800 font-extrabold transition-colors shadow-xs"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl p-5 mb-6 border border-slate-200/90 shadow-xs">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-wider text-slate-500 mb-1">Current Score</p>
            <p className="text-3xl font-extrabold text-slate-900">{baseScore}%</p>
          </div>
          <div>
            <p className="text-xs uppercase font-extrabold tracking-wider text-slate-500 mb-1">Simulated Score</p>
            <div className="flex items-baseline space-x-2">
              <p className={`text-3xl font-extrabold ${scoreIncrease > 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                {simulatedScore}%
              </p>
              {scoreIncrease > 0 && (
                <span className="text-sm font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                  +{scoreIncrease.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {totalAddedSkills > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-700">
              <span className="text-brand-700 font-extrabold">{totalAddedSkills}</span> skill{totalAddedSkills !== 1 ? 's' : ''} added to active simulation
            </p>
          </div>
        )}
      </div>

      {/* Missing Skills Selection */}
      <div className="space-y-4">
        {Object.entries(missingSkills).map(([category, data]) => (
          data.missing && data.missing.length > 0 && (
            <div key={category} className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
              <h4 className="font-extrabold text-slate-900 mb-3 flex items-center justify-between">
                <span className="text-xs sm:text-sm uppercase tracking-wide text-slate-800">{categoryNames[category]}</span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold border border-slate-200">
                  {data.missing.length} missing
                </span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.missing.map((skill, idx) => {
                  const isAdded = addedSkills[category]?.includes(skill);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => isAdded
                        ? handleRemoveSkill(category, skill)
                        : handleAddSkill(category, skill)
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all transform active:scale-95 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 border border-emerald-700'
                          : 'bg-rose-50 text-rose-950 hover:bg-rose-100 border border-rose-300'
                      }`}
                    >
                      {isAdded ? '✓ Added: ' : '+ Add: '}{skill}
                    </button>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>

      <div className="mt-6 p-4 bg-brand-50 rounded-xl border border-brand-200 text-slate-800 flex items-start space-x-3">
        <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-xs sm:text-sm leading-relaxed">
          <span className="font-extrabold text-brand-900">How it works:</span> Click on missing skills to simulate including them in your resume. Scores adjust dynamically based on AI weight coefficients.
        </p>
      </div>
    </div>
  );
}

export default WhatIfSimulator;
