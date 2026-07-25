import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-bold tracking-tight rounded-full transition-all duration-150 shadow-xs';

  const variants = {
    default: 'bg-slate-100 text-slate-800 border border-slate-300/80',
    primary: 'bg-brand-50 text-brand-900 border border-brand-300 font-semibold',
    secondary: 'bg-teal-50 text-teal-900 border border-teal-300 font-semibold',
    success: 'bg-emerald-100 text-emerald-950 border border-emerald-300/80 font-bold',
    warning: 'bg-amber-100 text-amber-950 border border-amber-300/80 font-bold',
    danger: 'bg-rose-100 text-rose-950 border border-rose-300/80 font-bold',
    info: 'bg-sky-100 text-sky-950 border border-sky-300/80 font-semibold',
    matched: 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold',
    missing: 'bg-rose-100 text-rose-950 border border-rose-300 font-bold',
    high: 'bg-amber-100 text-amber-950 border border-amber-400 font-bold',
    medium: 'bg-slate-100 text-slate-800 border border-slate-300',
    low: 'bg-slate-50 text-slate-600 border border-slate-200',
    brand: 'bg-brand-600 text-white font-bold',
    violet: 'bg-violet-100 text-violet-950 border border-violet-300 font-bold',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs sm:text-sm',
    lg: 'px-4 py-1.5 text-sm sm:text-base',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-1.5 flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 hover:bg-slate-900/10 rounded-full p-0.5 transition-colors focus:outline-none"
          aria-label={`Remove ${children}`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
