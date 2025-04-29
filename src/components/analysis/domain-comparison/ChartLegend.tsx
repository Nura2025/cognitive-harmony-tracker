
import React from 'react';

interface ChartLegendProps {
  subtypeData?: boolean;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ subtypeData }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-primary mr-1.5" />
        <span className="text-xs">Patient's Raw Score</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-blue-400 mr-1.5" />
        <span className="text-xs">Normative Mean</span>
      </div>
      {subtypeData && (
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-400 mr-1.5" />
          <span className="text-xs">ADHD Subtype Average</span>
        </div>
      )}
    </div>
  );
};
