
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface VisualizationSelectorProps {
  value: 'percentile' | 'zscore';
  onChange: (value: 'percentile' | 'zscore') => void;
}

export const VisualizationSelector: React.FC<VisualizationSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <Select 
      value={value} 
      onValueChange={(value) => onChange(value as 'percentile' | 'zscore')}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Visualization Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="percentile">Percentile Gauges</SelectItem>
        <SelectItem value="zscore">Z-Score Bars</SelectItem>
      </SelectContent>
    </Select>
  );
};
