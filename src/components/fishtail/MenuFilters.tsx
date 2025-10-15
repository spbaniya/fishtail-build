import { Badge } from "@/shared/components/ui/badge";

export type DietaryFilter = 'all' | 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free';
export type SectionFilter = 'all' | 'appetizers' | 'tandoori' | 'biryani' | 'everest' | 'bread';

export type FilterMode = 'dietary' | 'section';

interface MenuFiltersProps {
    activeFilter: DietaryFilter | SectionFilter;
    onFilterChange: (filter: DietaryFilter | SectionFilter) => void;
    mode?: FilterMode;
}

export default function MenuFilters({ activeFilter, onFilterChange, mode = 'dietary' }: MenuFiltersProps) {
    const dietaryFilters: { label: string; value: DietaryFilter; color?: string }[] = [
        { label: 'All', value: 'all' },
        { label: 'Vegetarian', value: 'vegetarian' },
        { label: 'Vegan', value: 'vegan' },
        { label: 'Gluten-Free', value: 'gluten-free' },
        { label: 'Dairy-Free', value: 'dairy-free' },
    ];

    const sectionFilters: { label: string; value: SectionFilter; color?: string }[] = [
        { label: 'All', value: 'all' },
        { label: 'Appetizers', value: 'appetizers' },
        { label: 'Tandoori & Grill', value: 'tandoori' },
        { label: 'Biryani & Rice', value: 'biryani' },
        { label: 'Nepalese Specials', value: 'everest' },
        { label: 'Bread & Naan', value: 'bread' },
    ];

    const filters = mode === 'dietary' ? dietaryFilters : sectionFilters;

    return (
        <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border py-5">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-wrap gap-3 items-center">
                    <span className="text-sm font-semibold text-muted-foreground mr-2">
                        Filter by {mode === 'dietary' ? 'diet:' : 'section:'}
                    </span>
                    {filters.map((filter) => (
                        <Badge
                            key={filter.value}
                            variant={activeFilter === filter.value ? "default" : "outline"}
                            className={`cursor-pointer px-5 py-2 text-sm font-medium hover-elevate transition-all ${activeFilter === filter.value ? 'bg-primary text-primary-foreground shadow-md' : 'hover:border-primary/50'
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
