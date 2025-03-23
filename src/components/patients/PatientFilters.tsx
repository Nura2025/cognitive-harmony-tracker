
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { FilterX, Search, SlidersHorizontal } from 'lucide-react';

interface PatientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilters: Record<string, boolean>;
  onFilterChange: (key: string, value: boolean) => void;
  onResetFilters: () => void;
}

export const PatientFilters: React.FC<PatientFiltersProps> = ({
  searchTerm,
  onSearchChange,
  activeFilters,
  onFilterChange,
  onResetFilters
}) => {
  const adhdSubtypes = ['Inattentive', 'Hyperactive-Impulsive', 'Combined'];
  const ageRanges = ['6-8', '9-12', '13-17'];
  
  const hasActiveFilters = Object.values(activeFilters).some(value => value);
  
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background/80 border-muted h-10"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-10 gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="flex h-2 w-2 bg-primary rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>ADHD Subtypes</DropdownMenuLabel>
          {adhdSubtypes.map(subtype => (
            <DropdownMenuCheckboxItem
              key={subtype}
              checked={activeFilters[`subtype-${subtype}`] || false}
              onCheckedChange={(checked) => onFilterChange(`subtype-${subtype}`, !!checked)}
            >
              {subtype}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Age Range</DropdownMenuLabel>
          {ageRanges.map(range => (
            <DropdownMenuCheckboxItem
              key={range}
              checked={activeFilters[`age-${range}`] || false}
              onCheckedChange={(checked) => onFilterChange(`age-${range}`, !!checked)}
            >
              {range} years
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start font-normal"
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
            >
              <FilterX className="mr-2 h-4 w-4" />
              Reset filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
