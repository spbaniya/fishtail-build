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
      <div className="mb-12">
        {image && (
          <div className="w-full h-56 md:h-72 mb-10 rounded-2xl overflow-hidden shadow-2xl relative group">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}
        <div className="relative">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-2 relative inline-block">
            {title}
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/70 to-transparent"></div>
          </h2>
        </div>
        {subtitle && (
          <p className="text-muted-foreground mt-6 text-lg md:text-xl leading-relaxed max-w-3xl">
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
