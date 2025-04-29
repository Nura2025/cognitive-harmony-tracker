
import React from 'react';

export const ProgressLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5" />
        <span className="text-xs">First Session</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-violet-500 mr-1.5" />
        <span className="text-xs">Latest Session</span>
      </div>
    </div>
  );
};
