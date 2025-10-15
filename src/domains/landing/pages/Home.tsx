import { useState, useEffect } from "react";
import Navigation from "@/components/fishtail/Navigation";
import Hero from "@/components/fishtail/Hero";
import MenuFilters, { DietaryFilter, SectionFilter } from "@/components/fishtail/MenuFilters";
import MenuSection from "@/components/fishtail/MenuSection";
import About from "@/components/fishtail/About";
import Location from "@/components/fishtail/Location";
import Footer from "@/components/fishtail/Footer";
import { getMenuCategories, filterMenuItems, filterMenuCategories } from "@/data/menuData.tsx";
import { MenuItemData } from "@/components/fishtail/MenuItem";

interface MenuCategory {
    title: string;
    subtitle: string;
    image: string;
    items: MenuItemData[];
}

export default function Home() {
    const [activeFilter, setActiveFilter] = useState<DietaryFilter | SectionFilter>('all');
    const [filterMode, setFilterMode] = useState<'dietary' | 'section'>('section');
    const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const categories = await getMenuCategories();
                setMenuCategories(categories);
            } catch (err) {
                console.error('Failed to load menu:', err);
                setError('Failed to load menu data');
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading menu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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

                    <MenuFilters
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        mode={filterMode}
                    />

                    <div className="mt-12 space-y-16">
                        {(() => {
                            if (filterMode === 'section') {
                                // Filter categories by section
                                const filteredCategories = filterMenuCategories(menuCategories, activeFilter);
                                return filteredCategories.map((category, idx) => (
                                    <MenuSection
                                        key={idx}
                                        title={category.title}
                                        subtitle={category.subtitle}
                                        items={category.items}
                                        image={category.image}
                                    />
                                ));
                            } else {
                                // Filter items within categories by dietary preference
                                return menuCategories.map((category, idx) => {
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
                                });
                            }
                        })()}
                    </div>
                </div>
            </section>

            <About />
            <Location />
            <Footer />
        </div>
    );
}
