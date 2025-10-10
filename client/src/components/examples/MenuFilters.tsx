import { useState } from 'react';
import MenuFilters, { DietaryFilter } from '../MenuFilters';

export default function MenuFiltersExample() {
  const [activeFilter, setActiveFilter] = useState<DietaryFilter>('all');

  return (
    <MenuFilters 
      activeFilter={activeFilter} 
      onFilterChange={setActiveFilter} 
    />
  );
}
