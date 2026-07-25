import React from 'react';
import MetricGauge from './ui/MetricGauge';
import Badge from './ui/Badge';
import useCountUp from '../hooks/useCountUp';

const StandaloneScoreHero = ({
  score = 0,
  categoryScores = {},
  tagline = "General ATS Resume Audit",
  animate = true,
  className = '',
}) => {
  const animatedScore = useCountUp(score, 1200, 0);
  const displayScore = animate ? Math.round(animatedScore) : score;

  const getScoreStatus = (s) => {
    if (s >= 85) return { text: 'Excellent ATS Health', variant: 'success', advice: 'Your resume meets top formatting, metric density, and ATS parser standards.' };
    if (s >= 70) return { text: 'Strong General Health', variant: 'primary', advice: 'Good foundation. Adding quantifiable achievement metrics will maximize impact.' };
    if (s >= 50) return { text: 'Optimization Required', variant: 'warning', advice: 'Formatting or metric weaknesses detected that may hinder automated parsing.' };
    return { text: 'Critical Structural Fixes', variant: 'danger', advice: 'Major structural and content overhauls needed for standard ATS parsing.' };
  };

  const status = getScoreStatus(score);

  return (
    <div className={`bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-card border border-violet-800/50 ${className}`}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side - Main Radial Gauge & Overview */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 w-full lg:w-auto">
          {/* Main Radial Gauge */}
          <div className="relative p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-glow-brand flex-shrink-0">
            <MetricGauge
              value={displayScore}
              size={150}
              strokeWidth={12}
              color="auto"
              showPercent={true}
              sublabel="RESUME HEALTH"
            />
          </div>

          {/* Title & Status */}
          <div className="text-center sm:text-left space-y-2.5 max-w-md">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-violet-300">
                Standalone Quality Audit
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">Resume Only</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
              ATS Resume Health Audit
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

        {/* Right Side - 4 Pillar Category Cards */}
        {categoryScores && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-violet-800/40 lg:pl-8">
            <PillarCard
              icon="⚡"
              label="Impact & Metrics"
              value={categoryScores.impact_quantification || 0}
              animate={animate}
            />
            <PillarCard
              icon="📑"
              label="ATS Formatting"
              value={categoryScores.formatting_structure || 0}
              animate={animate}
            />
            <PillarCard
              icon="✍️"
              label="Brevity & Style"
              value={categoryScores.brevity_style || 0}
              animate={animate}
            />
            <PillarCard
              icon="🎯"
              label="Skill Profile"
              value={categoryScores.skills_competencies || 0}
              animate={animate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component for pillar cards
const PillarCard = ({ icon, label, value, animate }) => {
  const animatedValue = useCountUp(value, 1000, 0);
  const displayVal = animate ? Math.round(animatedValue) : value;

  const getBarColor = (val) => {
    if (val >= 75) return 'bg-emerald-400';
    if (val >= 50) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-violet-800/40 rounded-xl p-3.5 flex flex-col justify-between min-w-[110px] text-center shadow-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-extrabold text-white">{displayVal}%</span>
      </div>
      <span className="text-[11px] font-bold text-slate-300 truncate uppercase tracking-wider mb-2">{label}</span>
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(value)}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
};

export default StandaloneScoreHero;
