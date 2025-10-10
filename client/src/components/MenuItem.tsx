import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  dietaryInfo: string[];
}

interface MenuItemProps {
  item: MenuItemData;
}

export default function MenuItem({ item }: MenuItemProps) {
  const getDietaryBadgeColor = (info: string): string => {
    const lower = info.toLowerCase();
    if (lower.includes('vegan')) return 'bg-sage text-white';
    if (lower.includes('gf') || lower.includes('gluten')) return 'bg-amber text-white';
    if (lower.includes('dairy')) return 'bg-softblue text-white';
    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <Card className="hover-elevate transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl border-l-4 border-l-primary/20 hover:border-l-primary group overflow-hidden" data-testid={`menu-item-${item.id}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl font-serif leading-tight font-bold group-hover:text-primary transition-colors">
            {item.name}
          </CardTitle>
          <span className="font-sans text-xl md:text-2xl font-bold text-primary whitespace-nowrap bg-primary/10 px-3 py-1 rounded-lg" data-testid={`price-${item.id}`}>
            {item.price}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        <CardDescription className="text-base md:text-lg leading-relaxed text-muted-foreground">
          {item.description}
        </CardDescription>
        {item.dietaryInfo.length > 0 && (
          <div className="flex flex-wrap gap-2" data-testid={`dietary-info-${item.id}`}>
            {item.dietaryInfo.map((info, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className={`text-xs px-3 py-1.5 font-semibold shadow-sm ${getDietaryBadgeColor(info)}`}
              >
                {info}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
