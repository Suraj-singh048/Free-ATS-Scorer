import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, gradient, className = '', ...props }) => {
  const gradientClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
    success: 'bg-gradient-to-r from-success-500 to-success-600',
    turquoise: 'bg-gradient-to-br from-primary-400 to-secondary-500',
  };

  const bgClass = gradient ? gradientClasses[gradient] : 'bg-gray-50 border-b border-gray-200';
  const textClass = gradient ? 'text-white' : 'text-gray-900';

  return (
    <div
      className={`px-6 py-4 ${bgClass} ${textClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
