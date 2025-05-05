import { Drink } from '../models/Drink';
import { Ingredient } from '../models/Ingredient';

export const calculatePossibleDrinks = (
    drinks: Drink[],
    ingredients: Ingredient[],
    allowSubstitutions: boolean = true
): Drink[] => {
    return drinks.map(drink => {
        const canMake = checkIfCanMake(drink, ingredients, allowSubstitutions);
        return {
            ...drink,
            tags: {
                ...drink.tags,
                canMake
            }
        };
    });
};

// Helper function to check if a drink can be made
const checkIfCanMake = (
    drink: Drink,
    ingredients: Ingredient[],
    allowSubstitutions: boolean
): boolean => {
    const inStockIngredients = ingredients.filter(ing => ing.inStock);

    for (const drinkIng of drink.ingredients) {
        // Check if the primary ingredient is in stock
        const hasMainIngredient = inStockIngredients.some(ing => ing.id === drinkIng.ingredientId);

        if (!hasMainIngredient) {
            // If main ingredient is missing, check substitutes if allowed
            if (allowSubstitutions && drinkIng.substitutes && drinkIng.substitutes.length > 0) {
                // Check if any substitute is in stock
                const hasSubstitute = drinkIng.substitutes.some(subId =>
                    inStockIngredients.some(ing => ing.id === subId)
                );

                if (!hasSubstitute) {
                    return false; // No substitute available
                }
                // If we have a substitute, continue checking other ingredients
            } else {
                // No substitutions allowed or no substitutes defined
                return false;
            }
        }
    }

    return true; // All ingredients (or substitutes) are available
};

export const getMissingIngredients = (
    drink: Drink,
    ingredients: Ingredient[]
): Ingredient[] => {
    const inStockIngredientIds = new Set<string>(
        ingredients.filter(ing => ing.inStock).map(ing => ing.id)
    );

    const missingIngredientIds = drink.ingredients
        .filter(ingredient => !inStockIngredientIds.has(ingredient.ingredientId))
        .map(ingredient => ingredient.ingredientId);

    return ingredients.filter(ingredient => missingIngredientIds.includes(ingredient.id));
};

export const filterDrinks = (
    drinks: Drink[],
    filters: {
        canMake?: boolean;
        strength?: 'light' | 'medium' | 'strong';
        taste?: string;
    }
): Drink[] => {
    return drinks.filter(drink => {
        if (filters.canMake !== undefined && drink.tags.canMake !== filters.canMake) {
            return false;
        }

        if (filters.strength && drink.tags.strength !== filters.strength) {
            return false;
        }

        if (filters.taste && !drink.tags.taste.includes(filters.taste)) {
            return false;
        }

        return true;
    });
};