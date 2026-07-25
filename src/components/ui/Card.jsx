import React from 'react';

export const Card = ({ children, className = '', elevated = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl ${
        elevated ? 'shadow-card border border-slate-200/80' : 'shadow-soft border border-slate-200/60'
      } overflow-hidden transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, variant = 'default', className = '', ...props }) => {
  const variantClasses = {
    default: 'bg-slate-50/80 border-b border-slate-200/80 text-slate-900',
    brand: 'bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white border-b border-slate-800',
    emerald: 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white border-b border-emerald-700',
    violet: 'bg-gradient-to-r from-violet-900 to-slate-900 text-white border-b border-violet-800',
    turquoise: 'bg-gradient-to-r from-slate-900 to-teal-900 text-white border-b border-teal-800',
  };

  const bgClass = variantClasses[variant] || variantClasses.default;

  return (
    <div
      className={`px-6 py-4.5 ${bgClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-5 text-slate-800 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 bg-slate-50/90 border-t border-slate-200/80 text-slate-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
