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
      
      <section id="menu" className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="w-20 h-1 bg-primary mb-4 mx-auto"></div>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 relative inline-block">
              Our Menu
              <div className="absolute -bottom-3 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mt-8">
              All dishes are made to your taste: <span className="font-bold text-primary">MILD, MEDIUM or HOT</span><br />
              <span className="text-base">(Extra Hot & Indian Hot are also available)</span>
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
