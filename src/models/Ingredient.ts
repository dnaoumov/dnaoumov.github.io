export interface Ingredient {
    id: string;
    name: string;
    category: string;
    inStock: boolean;
    amount?: number;
    unit?: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
}