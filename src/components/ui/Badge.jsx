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
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-all duration-200';

  const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-300',
    primary: 'bg-primary-100 text-primary-700 border border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 border border-secondary-200',
    success: 'bg-success-100 text-success-700 border border-success-200',
    warning: 'bg-warning-100 text-warning-700 border border-warning-200',
    danger: 'bg-danger-100 text-danger-700 border border-danger-200',
    info: 'bg-info-100 text-info-700 border border-info-200',
    matched: 'bg-success-100 text-success-700 border border-success-300 shadow-sm',
    missing: 'bg-danger-100 text-danger-700 border border-danger-300 shadow-sm',
    high: 'bg-warning-100 text-warning-700 border border-warning-300 font-semibold',
    medium: 'bg-info-100 text-info-700 border border-info-300',
    low: 'bg-gray-100 text-gray-600 border border-gray-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      <span>{children}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1.5 hover:bg-black/10 rounded-full p-0.5 transition-colors focus:outline-none"
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
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
