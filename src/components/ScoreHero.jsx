import React from 'react';
import ProgressRing from './ui/ProgressRing';
import useCountUp from '../hooks/useCountUp';

const ScoreHero = ({
  score = 0,
  breakdown = {},
  animate = true,
  className = '',
}) => {
  const animatedScore = useCountUp(score, 1500, 0);
  const displayScore = animate ? Math.round(animatedScore) : score;

  const getScoreLabel = (score) => {
    if (score >= 90) return { text: 'Excellent Match!', color: 'text-success-600', bg: 'bg-success-50' };
    if (score >= 75) return { text: 'Great Match!', color: 'text-success-600', bg: 'bg-success-50' };
    if (score >= 60) return { text: 'Good Match', color: 'text-warning-600', bg: 'bg-warning-50' };
    if (score >= 40) return { text: 'Fair Match', color: 'text-warning-600', bg: 'bg-warning-50' };
    return { text: 'Needs Improvement', color: 'text-danger-600', bg: 'bg-danger-50' };
  };

  const scoreLabel = getScoreLabel(score);

  return (
    <div className={`bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl p-8 text-white shadow-glow-lg ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side - Main Score */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-1">ATS Compatibility Score</h2>
            <p className="text-primary-100 text-sm">
              Comprehensive resume analysis
            </p>
          </div>

          <div className="flex items-center space-x-6">
            {/* Large Progress Ring */}
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <ProgressRing
                value={displayScore}
                size={160}
                strokeWidth={12}
                color="auto"
                animated={animate}
                className="filter drop-shadow-lg"
              />
            </div>

            {/* Score Label */}
            <div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${scoreLabel.bg} ${scoreLabel.color} font-semibold text-lg mb-2`}>
                {score >= 75 ? '✓' : score >= 40 ? '~' : '✗'} {scoreLabel.text}
              </div>
              <p className="text-primary-100 text-sm max-w-xs">
                {score >= 75
                  ? 'Your resume is well-optimized for ATS systems'
                  : score >= 40
                  ? 'Consider adding recommended skills to improve your score'
                  : 'Significant improvements needed for better ATS compatibility'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Breakdown */}
        {breakdown && Object.keys(breakdown).length > 0 && (
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            {breakdown.experience_match !== undefined && (
              <MetricCard
                label="Experience"
                value={breakdown.experience_match}
                animate={animate}
              />
            )}
            {breakdown.skill_proficiency !== undefined && (
              <MetricCard
                label="Skills"
                value={breakdown.skill_proficiency}
                animate={animate}
              />
            )}
            {breakdown.keyword_density !== undefined && (
              <MetricCard
                label="Keywords"
                value={breakdown.keyword_density}
                animate={animate}
              />
            )}
            {breakdown.education_match !== undefined && (
              <MetricCard
                label="Education"
                value={breakdown.education_match}
                animate={animate}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Mini metric card for breakdown
const MetricCard = ({ label, value, animate }) => {
  const animatedValue = useCountUp(value, 1200, 0);
  const displayValue = animate ? Math.round(animatedValue) : value;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
      <div className="text-3xl font-bold mb-1">{displayValue}%</div>
      <div className="text-primary-100 text-sm font-medium">{label}</div>
    </div>
  );
};

export default ScoreHero;
