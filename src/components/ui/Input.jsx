import React from 'react';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  success,
  icon,
  rightIcon,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const stateStyles = error
    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200 bg-danger-50'
    : success
    ? 'border-success-300 focus:border-success-500 focus:ring-success-200 bg-success-50'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200 bg-white';

  const widthClass = fullWidth ? 'w-full' : '';
  const iconPadding = icon ? 'pl-10' : '';
  const rightIconPadding = rightIcon ? 'pr-10' : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{icon}</span>
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseStyles} ${stateStyles} ${widthClass} ${iconPadding} ${rightIconPadding} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={error ? 'text-danger-500' : success ? 'text-success-500' : 'text-gray-500'}>
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-danger-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {success && (
        <p className="mt-1.5 text-sm text-success-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </p>
      )}
    </div>
  );
};

export default Input;
