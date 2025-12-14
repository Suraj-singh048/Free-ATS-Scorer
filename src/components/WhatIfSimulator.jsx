import { useState, useMemo } from 'react';

function WhatIfSimulator({ result }) {
  const [addedSkills, setAddedSkills] = useState({
    technical_skills: [],
    soft_skills: [],
    tools_and_technologies: [],
    certifications: []
  });

  // Extract calculator data from result
  const calculator = result.what_if_calculator;
  const baseScore = result.ats_score;
  const missingSkills = result.skills_breakdown;

  // Calculate new score based on added skills
  const simulatedScore = useMemo(() => {
    if (!calculator || !calculator.impact_per_skill) {
      return baseScore;
    }

    let newScore = baseScore;

    // Apply formula from AI for each category
    Object.keys(addedSkills).forEach(category => {
      const count = addedSkills[category]?.length || 0;
      if (count > 0) {
        // Map category names to weight keys
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

    // Cap at 100
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

  // Category display names
  const categoryNames = {
    technical_skills: 'Technical Skills',
    soft_skills: 'Soft Skills',
    tools_and_technologies: 'Tools & Technologies',
    certifications: 'Certifications'
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">🔮</span> What-If Scenario Simulator
        </h3>
        {totalAddedSkills > 0 && (
          <button
            onClick={handleReset}
            className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 font-medium transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current ATS Score</p>
            <p className="text-3xl font-bold text-gray-800">{baseScore}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Simulated Score</p>
            <div className="flex items-baseline">
              <p className={`text-3xl font-bold ${scoreIncrease > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                {simulatedScore}%
              </p>
              {scoreIncrease > 0 && (
                <span className="text-sm ml-2 text-green-600 font-semibold">
                  (+{scoreIncrease.toFixed(2)}%)
                </span>
              )}
            </div>
          </div>
        </div>

        {totalAddedSkills > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">{totalAddedSkills}</span> skill{totalAddedSkills !== 1 ? 's' : ''} added to simulation
            </p>
          </div>
        )}
      </div>

      {/* Missing Skills Selection */}
      <div className="space-y-4">
        {Object.entries(missingSkills).map(([category, data]) => (
          data.missing && data.missing.length > 0 && (
            <div key={category} className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <span className="text-sm uppercase tracking-wide">{categoryNames[category]}</span>
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {data.missing.length} missing
                </span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.missing.map((skill, idx) => {
                  const isAdded = addedSkills[category]?.includes(skill);
                  return (
                    <button
                      key={idx}
                      onClick={() => isAdded
                        ? handleRemoveSkill(category, skill)
                        : handleAddSkill(category, skill)
                      }
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                        isAdded
                          ? 'bg-green-500 text-white shadow-md hover:bg-green-600'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {isAdded ? '✓ ' : '+ '}{skill}
                    </button>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-100 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 How it works:</span> Click on missing skills to add them to your resume simulation.
          The score updates instantly using AI-calculated impact weights - no server calls needed!
        </p>
      </div>

      {!calculator || !calculator.impact_per_skill && (
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ What-if calculator data not available from AI analysis.
          </p>
        </div>
      )}
    </div>
  );
}

export default WhatIfSimulator;
