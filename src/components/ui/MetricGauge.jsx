import React from 'react';

const MetricGauge = ({
  value = 0,
  size = 140,
  strokeWidth = 10,
  label = '',
  sublabel = '',
  color = 'auto',
  className = '',
  showPercent = true,
  animate = true,
  darkText = false,
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  const getColorClasses = (val) => {
    if (color === 'brand') return { stroke: '#818cf8', text: 'text-brand-300' };
    if (color === 'emerald' || (color === 'auto' && val >= 75)) {
      return { stroke: '#34d399', text: 'text-emerald-300' };
    }
    if (color === 'amber' || (color === 'auto' && val >= 50)) {
      return { stroke: '#fbbf24', text: 'text-amber-300' };
    }
    return { stroke: '#fb7185', text: 'text-rose-300' };
  };

  const theme = getColorClasses(normalizedValue);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-white/20"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkText ? 'text-slate-900' : 'text-white'}`}>
            {Math.round(normalizedValue)}
            {showPercent && <span className={`text-sm font-bold ${darkText ? 'text-slate-700' : 'text-slate-200'} ml-0.5`}>%</span>}
          </span>
          {sublabel && (
            <span className={`text-[10px] sm:text-xs font-extrabold ${darkText ? 'text-slate-700' : 'text-slate-200'} uppercase tracking-wider mt-0.5 max-w-[85px] truncate`}>
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {label && (
        <div className="mt-2 text-center">
          <span className={`text-xs sm:text-sm font-extrabold block ${darkText ? 'text-slate-800' : 'text-slate-200'}`}>{label}</span>
        </div>
      )}
    </div>
  );
};

export default MetricGauge;
