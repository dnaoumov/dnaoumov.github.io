export interface DrinkIngredient {
    ingredientId: string;
    amount: string;
    unit: string;
    category?: 'primary' | 'secondary'; // New property to distinguish ingredient types
    substitutes?: string[]; // New property to list possible substitutions
}

export interface DrinkTags {
    strength: 'light' | 'medium' | 'strong';
    taste: string[];
    canMake?: boolean;
}

export interface Drink {
    id: string;
    name: string;
    ingredients: DrinkIngredient[];
    instructions: string;
    image?: string;
    tags: DrinkTags;
    carAuctionEasterEgg?: string;
}