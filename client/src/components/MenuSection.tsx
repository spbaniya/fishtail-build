import { MenuItemData } from "./MenuItem";
import MenuItem from "./MenuItem";

interface MenuSectionProps {
  title: string;
  subtitle?: string;
  items: MenuItemData[];
  image?: string;
}

export default function MenuSection({ title, subtitle, items, image }: MenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-16" data-testid={`menu-section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="mb-8">
        {image && (
          <div className="w-full h-48 md:h-64 mb-6 rounded-lg overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground border-b-4 border-gold inline-block pb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground mt-3 text-base md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
