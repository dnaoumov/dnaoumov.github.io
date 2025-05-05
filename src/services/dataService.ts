import { Ingredient, Category } from '../models/Ingredient';
import { Drink } from '../models/Drink';

export const fetchIngredients = async (): Promise<Ingredient[]> => {
    try {
        const response = await fetch('/data/ingredients.json');
        if (!response.ok) {
            throw new Error('Failed to fetch ingredients');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        return [];
    }
};

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch('/data/categories.json');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

export const fetchDrinks = async (): Promise<Drink[]> => {
    try {
        const response = await fetch('/data/drinks.json');
        if (!response.ok) {
            throw new Error('Failed to fetch drinks');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching drinks:', error);
        return [];
    }
};

export const saveIngredients = (ingredients: Ingredient[]): void => {
    // In a full app, this would save to a server
    // For now, we'll save to localStorage for persistence
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
};

export const getLocalIngredients = (): Ingredient[] | null => {
    const stored = localStorage.getItem('ingredients');
    return stored ? JSON.parse(stored) : null;
};