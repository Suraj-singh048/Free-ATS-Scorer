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
    <div className={`bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white shadow-glow-lg ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
        {/* Left Side - Main Score */}
        <div className="flex flex-col items-center md:items-start space-y-3 sm:space-y-4 w-full md:w-auto">
          <div className="text-center md:text-left w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">ATS Compatibility Score</h2>
            <p className="text-primary-100 text-xs sm:text-sm">
              Comprehensive resume analysis
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
            {/* Large Progress Ring */}
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 sm:p-4">
              <ProgressRing
                value={displayScore}
                size={120}
                strokeWidth={10}
                color="auto"
                animated={animate}
                className="filter drop-shadow-lg sm:hidden"
              />
              <ProgressRing
                value={displayScore}
                size={160}
                strokeWidth={12}
                color="auto"
                animated={animate}
                className="filter drop-shadow-lg hidden sm:block"
              />
            </div>

            {/* Score Label */}
            <div className="text-center sm:text-left w-full sm:w-auto">
              <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${scoreLabel.bg} ${scoreLabel.color} font-semibold text-sm sm:text-lg mb-2`}>
                {score >= 75 ? '✓' : score >= 40 ? '~' : '✗'} {scoreLabel.text}
              </div>
              <p className="text-primary-100 text-xs sm:text-sm max-w-xs mx-auto sm:mx-0">
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
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 min-w-[100px] sm:min-w-[120px]">
      <div className="text-2xl sm:text-3xl font-bold mb-1">{displayValue}%</div>
      <div className="text-primary-100 text-xs sm:text-sm font-medium truncate">{label}</div>
    </div>
  );
};

export default ScoreHero;
