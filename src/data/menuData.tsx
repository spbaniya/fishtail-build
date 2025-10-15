import { MenuItemData } from "@/components/fishtail/MenuItem";

interface MenuCategory {
    title: string;
    subtitle: string;
    image: string;
    items: MenuItemData[];
}

// API endpoint for fetching menu data
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Image mapping for categories
const categoryImages: { [key: string]: string } = {
    "Appetizers - Non Veg": "/assets/indian_samosa_appeti_6d10c724.jpg",
    "Tandoori Festive": "/assets/indian_tandoori_chic_cd3959b8.jpg",
    "Biryani": "/assets/biryani_rice_indian__684c1c84.jpg",
    "From the Mt. Everest Base Camp": "/assets/nepalese_momos_dumpl_64e121a7.jpg",
    "Tandoori Naan (Bread)": "/assets/indian_naan_bread_ga_ecb9a097.jpg",
    "default": "/assets/indian_food_restaura_c34cc8a9.jpg"
};

// Cache for menu data
let menuDataCache: MenuCategory[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchMenuData(): Promise<MenuCategory[]> {
    // Check cache first
    if (menuDataCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
        return menuDataCache;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/get/menu.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch menu data: ${response.statusText}`);
        }
        const data = await response.json();

        // Handle both single category and array of categories
        let categories: any[] = [];
        if (Array.isArray(data)) {
            categories = data;
        } else if (data && typeof data === 'object') {
            // If it's a single category object, wrap it in an array
            categories = [data];
        }

        // Cache the data
        menuDataCache = categories;
        cacheTimestamp = Date.now();

        return categories;
    } catch (error) {
        console.error('Error fetching menu data:', error);
        // Return empty array as fallback
        return [];
    }
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
    const rawData = await fetchMenuData();

    // Transform the data to match the expected format
    return rawData.map((category: any) => ({
        title: category.title || '',
        subtitle: category.subtitle || '',
        image: categoryImages[category.title] || categoryImages.default,
        items: (category.items || []).map((item: any) => {
            // Handle dietaryInfo as either string or array
            let dietaryInfo: string[] = [];
            if (Array.isArray(item.dietaryInfo)) {
                dietaryInfo = item.dietaryInfo.filter((info: any) => info && info.trim() !== '');
            } else if (typeof item.dietaryInfo === 'string') {
                // Split string by common separators and filter empty values
                dietaryInfo = item.dietaryInfo
                    .split(/[,;]/)
                    .map((info: string) => info.trim())
                    .filter((info: string) => info !== '');
            }

            return {
                id: item.id || '',
                name: item.name || '',
                description: item.description || '',
                price: item.price || '',
                category: item.category || '',
                dietaryInfo: dietaryInfo
            };
        })
    }));
}

// Export a promise that resolves to the menu categories
export const menuCategories = getMenuCategories();

// Filter menu items based on dietary preferences
export function filterMenuItems(items: MenuItemData[], filter: string): MenuItemData[] {
    if (filter === 'all') return items;

    return items.filter(item => {
        const dietaryInfo = item.dietaryInfo || [];

        switch (filter) {
            case 'vegetarian':
                return dietaryInfo.some(info =>
                    info.toLowerCase().includes('vegetarian') ||
                    info.toLowerCase().includes('veg')
                );
            case 'vegan':
                return dietaryInfo.some(info =>
                    info.toLowerCase().includes('vegan')
                );
            case 'gluten-free':
                return dietaryInfo.some(info =>
                    info.toLowerCase().includes('gluten free') ||
                    info.toLowerCase().includes('gf')
                );
            case 'dairy-free':
                return dietaryInfo.some(info =>
                    info.toLowerCase().includes('dairy free') ||
                    info.toLowerCase().includes('df')
                );
            case 'veg':
                return dietaryInfo.some(info =>
                    info.toLowerCase().includes('vegetarian') ||
                    info.toLowerCase().includes('veg')
                );
            case 'non-veg':
                return !dietaryInfo.some(info =>
                    info.toLowerCase().includes('vegetarian') ||
                    info.toLowerCase().includes('veg')
                );
            default:
                return true;
        }
    });
}

// Filter menu categories by section
export function filterMenuCategories(categories: MenuCategory[], sectionFilter: string): MenuCategory[] {
    if (sectionFilter === 'all') return categories;

    // Map section filter values to actual category names from API
    const sectionMapping: { [key: string]: string[] } = {
        'appetizers-nonveg': ['appetizers - non veg'],
        'appetizers-veg': ['appetizers - vegetable'],
        'beverages': ['beverages'],
        'biryani': ['biryani'],
        'desserts': ['desserts'],
        'everest': ['from the mt. everest base camp', 'mt. everest'],
        'chicken': ['meat lovers - chicken'],
        'lamb': ['meat lovers - lamb and goat'],
        'seafood': ['seafood lovers'],
        'sides': ['side orders'],
        'soup': ['soup and salad'],
        'tandoori': ['tandoori festive'],
        'bread': ['tandoori naan (bread)'],
        'vegetarian': ['vegetarian lovers'],
        'whole-wheat': ['whole wheat breads']
    };

    const searchTerms = sectionMapping[sectionFilter.toLowerCase()] || [sectionFilter.toLowerCase()];

    return categories.filter(category =>
        searchTerms.some(term => category.title.toLowerCase().includes(term))
    );
}
