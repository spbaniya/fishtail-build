import { Badge } from "@/shared/components/ui/badge";

export type DietaryFilter = 'all' | 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free';
export type SectionFilter = 'all' | 'appetizers-nonveg' | 'appetizers-veg' | 'beverages' | 'biryani' | 'desserts' | 'everest' | 'chicken' | 'lamb' | 'seafood' | 'sides' | 'soup' | 'tandoori' | 'bread' | 'vegetarian' | 'whole-wheat';

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
        { label: 'Appetizers - Non Veg', value: 'appetizers-nonveg' },
        { label: 'Appetizers - Vegetable', value: 'appetizers-veg' },
        { label: 'Beverages', value: 'beverages' },
        { label: 'Biryani', value: 'biryani' },
        { label: 'Desserts', value: 'desserts' },
        { label: 'From the Mt. Everest Base Camp', value: 'everest' },
        { label: 'Meat Lovers - Chicken', value: 'chicken' },
        { label: 'Meat Lovers - Lamb and Goat', value: 'lamb' },
        { label: 'Seafood Lovers', value: 'seafood' },
        { label: 'Side Orders', value: 'sides' },
        { label: 'Soup and Salad', value: 'soup' },
        { label: 'Tandoori Festive', value: 'tandoori' },
        { label: 'Tandoori Naan (Bread)', value: 'bread' },
        { label: 'Vegetarian Lovers', value: 'vegetarian' },
        { label: 'Whole Wheat Breads', value: 'whole-wheat' },
    ];

    const filters = mode === 'dietary' ? dietaryFilters : sectionFilters;

    return (
        <div className="sticky top-24 z-40 bg-background/95 backdrop-blur-md border-b border-border py-5">
            <div className="max-w-6xl mx-auto px-6">
                {mode === 'dietary' ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                            Filter by diet:
                        </span>
                        <div className="flex flex-wrap gap-3 items-center">
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
                ) : (
                    <div className="flex flex-col items-center gap-2 w-full">
                        <span className="text-sm font-semibold text-muted-foreground text-center">
                            Filter by section:
                        </span>
                        <div className="overflow-x-auto w-full">
                            <div className="flex gap-3 items-center flex-nowrap min-w-max py-2">
                                {filters.map((filter) => (
                                    <Badge
                                        key={filter.value}
                                        variant={activeFilter === filter.value ? "default" : "outline"}
                                        className={`cursor-pointer px-5 py-2 text-sm font-medium hover-elevate transition-all whitespace-nowrap ${activeFilter === filter.value ? 'bg-primary text-primary-foreground shadow-md' : 'hover:border-primary/50'
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
                )}
            </div>
        </div>
    );
}
