import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MenuFilters, { DietaryFilter } from "@/components/MenuFilters";
import MenuSection from "@/components/MenuSection";
import About from "@/components/About";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import { menuCategories, filterMenuItems } from "@/data/menuData";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<DietaryFilter>('all');

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      <section id="menu" className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Our Menu
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              All dishes are made to your taste: MILD, MEDIUM or HOT<br />
              (Extra Hot & Indian Hot are also available)
            </p>
          </div>
          
          <MenuFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          
          <div className="mt-12 space-y-16">
            {menuCategories.map((category, idx) => {
              const filteredItems = filterMenuItems(category.items, activeFilter);
              return (
                <MenuSection
                  key={idx}
                  title={category.title}
                  subtitle={category.subtitle}
                  items={filteredItems}
                  image={category.image}
                />
              );
            })}
          </div>
        </div>
      </section>

      <About />
      <Location />
      <Footer />
    </div>
  );
}
