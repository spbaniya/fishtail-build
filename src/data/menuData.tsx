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

        // Cache the data
        menuDataCache = data;
        cacheTimestamp = Date.now();

        return data;
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
        items: (category.items || []).map((item: any) => ({
            id: item.id || '',
            name: item.name || '',
            description: item.description || '',
            price: item.price || '',
            category: item.category || '',
            dietaryInfo: Array.isArray(item.dietaryInfo) ? item.dietaryInfo.filter((info: any) => info && info.trim() !== '') : []
        }))
    }));
}

// Export a promise that resolves to the menu categories
export const menuCategories = getMenuCategories();

// Filter menu items based on dietary preferences
export function filterMenuItems(items: MenuItemData[], filter: string): MenuItemData[] {
    if (filter === 'all') return items;

    return items.filter(item => {
        if (filter === 'veg') {
            return item.dietaryInfo.includes('Vegetarian');
        }
        if (filter === 'non-veg') {
            return !item.dietaryInfo.includes('Vegetarian');
        }
        if (filter === 'gluten-free') {
            return item.dietaryInfo.includes('Gluten Free');
        }
        return true;
    });
}
