// src/constants/tasteCategories.ts
export interface TasteCategory {
    name: string;
    tastes: string[];
    color?: string;
}

export const TASTE_CATEGORIES: TasteCategory[] = [
    {
        name: 'Sweet',
        tastes: ['Sweet', 'Fruity', 'Berry', 'Tropical', 'Caramel'],
        color: '#ff6b6b'
    },
    {
        name: 'Sour',
        tastes: ['Sour', 'Citrus', 'Lime', 'Lemon'],
        color: '#ffe66d'
    },
    {
        name: 'Bitter',
        tastes: ['Bitter', 'Coffee', 'Chocolate', 'Herbal'],
        color: '#88d8b0'
    },
    {
        name: 'Spicy',
        tastes: ['Spicy', 'Ginger', 'Cinnamon', 'Pepper'],
        color: '#ff8e5e'
    },
    {
        name: 'Refreshing',
        tastes: ['Refreshing', 'Mint', 'Cucumber', 'Light'],
        color: '#6abfff'
    }
];

// Helper function to find the category for a taste
export const findCategoryForTaste = (taste: string): TasteCategory | undefined => {
    return TASTE_CATEGORIES.find(category =>
        category.tastes.some(t => t.toLowerCase() === taste.toLowerCase())
    );
};