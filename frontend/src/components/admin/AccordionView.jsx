import React from 'react';

const ChevronDown = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUp = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const AccordionView = ({ headerContent, children, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-700 last:border-b-0">
      <div
        className="flex justify-between items-center p-4 cursor-pointer bg-card-bg hover:bg-gray-800 transition-colors"
        onClick={onToggle}
      >
        <div className="flex-1 font-medium text-white">
          {headerContent}
        </div>
        <div className="ml-4 text-primary">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4 bg-gray-900/50 text-gray-300 space-y-2 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionView;
