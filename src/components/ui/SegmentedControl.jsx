import React from 'react';

const SegmentedControl = ({ options = [], value, onChange, className = '' }) => {
  return (
    <div className={`bg-slate-100/90 p-1.5 rounded-xl flex space-x-1.5 border border-slate-200 shadow-inner ${className}`}>
      {options.map((opt) => {
        const isActive = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex-1 py-2.5 px-3 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              isActive
                ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
            }`}
          >
            {opt.icon && <span className={isActive ? 'text-brand-600' : 'text-slate-500'}>{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.badge && (
              <span
                className={`hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-brand-100 text-brand-800' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
