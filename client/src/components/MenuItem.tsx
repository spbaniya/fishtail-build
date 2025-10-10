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
    <Card className="hover-elevate transition-transform hover:-translate-y-1" data-testid={`menu-item-${item.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg md:text-xl font-serif leading-tight">
            {item.name}
          </CardTitle>
          <span className="font-mono text-lg md:text-xl font-medium text-primary whitespace-nowrap" data-testid={`price-${item.id}`}>
            {item.price}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="text-sm md:text-base leading-relaxed">
          {item.description}
        </CardDescription>
        {item.dietaryInfo.length > 0 && (
          <div className="flex flex-wrap gap-2" data-testid={`dietary-info-${item.id}`}>
            {item.dietaryInfo.map((info, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className={`text-xs px-2 py-1 ${getDietaryBadgeColor(info)}`}
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
