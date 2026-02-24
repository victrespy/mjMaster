import React from 'react';
import MJStarIcon from './MJStarIcon';

const StarsDisplay = ({ value = 0, size = "w-4 h-4" }) => {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((i) => (
        <MJStarIcon 
          key={i} 
          className={`${size} ${i <= value ? 'text-primary' : 'text-gray-600' }`} 
        />
      ))}
    </div>
  );
};

export default StarsDisplay;
