import React, { useEffect, useState } from 'react';

const ProgressRing = ({
  value = 0,
  maxValue = 100,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showValue = true,
  label,
  animated = true,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);

  // Animate progress on mount
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setProgress(value), 100);
      return () => clearTimeout(timer);
    } else {
      setProgress(value);
    }
  }, [value, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / maxValue) * circumference;

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    danger: 'text-danger-500',
    info: 'text-info-500',
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-500';
    if (score >= 60) return 'text-warning-500';
    return 'text-danger-500';
  };

  const displayColor = color === 'auto' ? getScoreColor(value) : colorClasses[color] || colorClasses.primary;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${displayColor} transition-all duration-1000 ease-out`}
            style={{
              filter: progress >= 80 ? 'drop-shadow(0 0 8px currentColor)' : 'none',
            }}
          />
        </svg>

        {/* Center content */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${displayColor} animate-count-up`}>
              {Math.round(progress)}
            </span>
            {maxValue !== 100 && (
              <span className="text-sm text-gray-500 font-medium">/ {maxValue}</span>
            )}
          </div>
        )}
      </div>

      {label && (
        <span className="mt-3 text-sm font-medium text-gray-700 text-center">
          {label}
        </span>
      )}
    </div>
  );
};

export default ProgressRing;
