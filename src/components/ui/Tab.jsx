import React, { createContext, useContext, useState } from 'react';

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
      className={`flex space-x-1 border-b border-gray-200 mb-6 ${className}`}
      role="tablist"
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
        relative px-4 py-3 font-medium text-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-t-lg
        ${
          isActive
            ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      <span className="flex items-center space-x-2">
        {icon && <span className={isActive ? 'text-primary-600' : 'text-gray-500'}>{icon}</span>}
        <span>{children}</span>
        {badge && (
          <span
            className={`
            ml-2 px-2 py-0.5 text-xs rounded-full font-semibold
            ${
              isActive
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-200 text-gray-700'
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
      className={`animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
};

export default Tabs;
