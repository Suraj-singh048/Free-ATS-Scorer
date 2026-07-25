import { createContext, useContext, useState } from 'react';

// Tab Context
const TabContext = createContext();

// Main Tabs Container
export const Tabs = ({ children, defaultTab, onChange, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onChange) onChange(tabId);
  };

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={`tabs-container ${className}`}>{children}</div>
    </TabContext.Provider>
  );
};

// Tab List (Navigation)
export const TabList = ({ children, className = '' }) => {
  return (
    <div
      className={`flex overflow-x-auto space-x-1.5 border-b border-slate-200 bg-slate-50/90 px-3 pt-3 rounded-t-2xl scrollbar-hide ${className}`}
      role="tablist"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {children}
    </div>
  );
};

// Individual Tab Button
export const TabButton = ({ id, children, icon, badge, className = '' }) => {
  const { activeTab, setActiveTab } = useContext(TabContext);
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      id={`tab-${id}`}
      onClick={() => setActiveTab(id)}
      className={`
        relative px-3.5 sm:px-5 py-3 font-bold text-xs sm:text-sm transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-t-xl
        flex-shrink-0 whitespace-nowrap cursor-pointer
        ${
          isActive
            ? 'text-brand-700 bg-white border-t-2 border-x border-slate-200/90 border-t-brand-600 shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }
        ${className}
      `}
    >
      <span className="flex items-center space-x-1.5 sm:space-x-2">
        {icon && <span className={isActive ? 'text-brand-600' : 'text-slate-500'}>{icon}</span>}
        <span>{children}</span>
        {badge !== undefined && badge !== null && (
          <span
            className={`
              ml-1.5 px-2 py-0.5 text-[11px] rounded-full font-extrabold tracking-tight
              ${
                isActive
                  ? 'bg-brand-100 text-brand-900'
                  : 'bg-slate-200 text-slate-800'
              }
            `}
          >
            {badge}
          </span>
        )}
      </span>
    </button>
  );
};

// Tab Panel (Content)
export const TabPanel = ({ id, children, className = '' }) => {
  const { activeTab } = useContext(TabContext);
  const isActive = activeTab === id;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={`animate-fade-in p-4 sm:p-6 bg-white rounded-b-2xl ${className}`}
    >
      {children}
    </div>
  );
};

export default Tabs;
