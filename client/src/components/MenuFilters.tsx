import { Badge } from "@/components/ui/badge";

export type DietaryFilter = 'all' | 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free';

interface MenuFiltersProps {
  activeFilter: DietaryFilter;
  onFilterChange: (filter: DietaryFilter) => void;
}

export default function MenuFilters({ activeFilter, onFilterChange }: MenuFiltersProps) {
  const filters: { label: string; value: DietaryFilter; color?: string }[] = [
    { label: 'All', value: 'all' },
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten-Free', value: 'gluten-free' },
    { label: 'Dairy-Free', value: 'dairy-free' },
  ];

  return (
    <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border py-5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-semibold text-muted-foreground mr-2">Filter by:</span>
          {filters.map((filter) => (
            <Badge
              key={filter.value}
              variant={activeFilter === filter.value ? "default" : "outline"}
              className={`cursor-pointer px-5 py-2 text-sm font-medium hover-elevate transition-all ${
                activeFilter === filter.value ? 'bg-primary text-primary-foreground shadow-md' : 'hover:border-primary/50'
              }`}
              onClick={() => onFilterChange(filter.value)}
              data-testid={`filter-${filter.value}`}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
