import React from 'react';
import MetricGauge from './ui/MetricGauge';
import Badge from './ui/Badge';
import useCountUp from '../hooks/useCountUp';

const ScoreHero = ({
  score = 0,
  breakdown = {},
  animate = true,
  className = '',
}) => {
  const animatedScore = useCountUp(score, 1200, 0);
  const displayScore = animate ? Math.round(animatedScore) : score;

  const getScoreStatus = (val) => {
    if (val >= 85) return { text: 'Interview-Ready Match', variant: 'success', advice: 'Exceptional alignment with target role requirements & ATS filters.' };
    if (val >= 70) return { text: 'Good Candidate Match', variant: 'primary', advice: 'Strong foundation; adding key missing hard skills will boost recruiter rank.' };
    if (val >= 50) return { text: 'Partial Role Match', variant: 'warning', advice: 'Requires targeted keyword additions and section metric enhancements.' };
    return { text: 'Optimization Needed', variant: 'danger', advice: 'Significant skill & formatting gaps detected against target position.' };
  };

  const status = getScoreStatus(score);

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-card border border-slate-700/80 ${className}`}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side - Main Radial Gauge & Overview */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 w-full lg:w-auto">
          {/* Main Radial Score Gauge */}
          <div className="relative p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-glow-brand flex-shrink-0">
            <MetricGauge
              value={displayScore}
              size={150}
              strokeWidth={12}
              color="auto"
              showPercent={true}
              sublabel="ATS MATCH"
            />
          </div>

          {/* Title & Status Summary */}
          <div className="text-center sm:text-left space-y-2.5 max-w-md">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-brand-300">
                Match Intelligence
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">Job Match Mode</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
              {score >= 75 ? 'Strong Resume Match' : score >= 50 ? 'Moderate Match' : 'Optimization Required'}
            </h2>

            <div>
              <Badge variant={status.variant} size="lg" className="shadow-md">
                {status.text}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              {status.advice}
            </p>
          </div>
        </div>

        {/* Right Side - Sub-metric Gauges Grid */}
        {breakdown && Object.keys(breakdown).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-700/60 lg:pl-8">
            {breakdown.skill_proficiency !== undefined && (
              <MiniGaugeCard label="Skill Match" value={breakdown.skill_proficiency} animate={animate} />
            )}
            {breakdown.experience_match !== undefined && (
              <MiniGaugeCard label="Experience" value={breakdown.experience_match} animate={animate} />
            )}
            {breakdown.keyword_density !== undefined && (
              <MiniGaugeCard label="Keywords" value={breakdown.keyword_density} animate={animate} />
            )}
            {breakdown.education_match !== undefined && (
              <MiniGaugeCard label="Education" value={breakdown.education_match} animate={animate} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-metric Gauge Card
const MiniGaugeCard = ({ label, value, animate }) => {
  const animatedValue = useCountUp(value, 1000, 0);
  const displayVal = animate ? Math.round(animatedValue) : value;

  const getBarColor = (val) => {
    if (val >= 75) return 'bg-emerald-400 text-emerald-300';
    if (val >= 50) return 'bg-amber-400 text-amber-300';
    return 'bg-rose-400 text-rose-300';
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between min-w-[110px] text-center shadow-xs">
      <span className="text-xs font-bold text-slate-300 truncate uppercase tracking-wider mb-1">{label}</span>
      <div className="text-2xl font-extrabold text-white tracking-tight mb-2">
        {displayVal}<span className="text-xs text-slate-400">%</span>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(value).split(' ')[0]}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
};

export default ScoreHero;
