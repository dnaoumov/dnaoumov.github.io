import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Drink } from '../models/Drink';
import { Ingredient } from '../models/Ingredient';
import { fetchDrinks } from '../services/dataService';
import { calculatePossibleDrinks, getMissingIngredients } from '../services/drinkService';

interface DrinkContextType {
    drinks: Drink[];
    isLoading: boolean;
    error: string | null;
    filteredDrinks: Drink[];
    possibleDrinks: Drink[];
    getMissingIngredientsForDrink: (drinkId: string, ingredients: Ingredient[]) => Ingredient[];
    filterDrinksByCanMake: (canMake: boolean) => void;
    filterDrinksByStrength: (strength: 'light' | 'medium' | 'strong' | null) => void;
    filterDrinksByTaste: (taste: string | null) => void;
    resetFilters: () => void;
    updatePossibleDrinks: (ingredients: Ingredient[]) => void;
    toggleAllowSubstitutions: () => void;
    allowSubstitutions: boolean;
}

interface Filters {
    canMake: boolean | null;
    strength: 'light' | 'medium' | 'strong' | null;
    taste: string | null;
    allowSubstitutions: boolean;
}

const DrinkContext = createContext<DrinkContextType | undefined>(undefined);

interface DrinkProviderProps {
    children: ReactNode;
    initialIngredients?: Ingredient[];
}

export const DrinkProvider: React.FC<DrinkProviderProps> = ({ children, initialIngredients = [] }) => {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [filteredDrinks, setFilteredDrinks] = useState<Drink[]>([]);
    const [possibleDrinks, setPossibleDrinks] = useState<Drink[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
    const [filters, setFilters] = useState<Filters>({
        canMake: null,
        strength: null,
        taste: null,
        allowSubstitutions: true
    });

    // Fetch drinks on component mount
    useEffect(() => {
        const loadDrinks = async () => {
            try {
                setIsLoading(true);
                const fetchedDrinks = await fetchDrinks();
                setDrinks(fetchedDrinks);
                setFilteredDrinks(fetchedDrinks);
                setError(null);
            } catch (err) {
                setError('Failed to load drinks data');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDrinks();
    }, []);

    const toggleAllowSubstitutions = () => {
        const newFilters = { ...filters, allowSubstitutions: !filters.allowSubstitutions };
        setFilters(newFilters);

        // Recalculate which drinks can be made with the new setting
        if (drinks.length > 0 && ingredients.length > 0) {
            // Pass the updated allowSubstitutions value
            const updatedDrinks = calculatePossibleDrinks(drinks, ingredients, newFilters.allowSubstitutions);
            setPossibleDrinks(updatedDrinks);
            applyFilters(updatedDrinks);
        }
    };

    // Apply filters when they change
    const applyFilters = (drinksToFilter: Drink[]) => {
        let result = [...drinksToFilter];

        if (filters.canMake !== null) {
            result = result.filter(drink => drink.tags.canMake === filters.canMake);
        }

        if (filters.strength !== null) {
            result = result.filter(drink => drink.tags.strength === filters.strength);
        }

        if (filters.taste !== null) {
            result = result.filter(drink => drink.tags.taste && filters.taste && drink.tags.taste.includes(filters.taste));
        }

        setFilteredDrinks(result);
    };

    const updatePossibleDrinks = (newIngredients: Ingredient[]) => {
        // Store the updated ingredients
        setIngredients(newIngredients);

        if (drinks.length > 0 && newIngredients.length > 0) {
            // Pass the allowSubstitutions flag from filters
            const updatedDrinks = calculatePossibleDrinks(drinks, newIngredients, filters.allowSubstitutions);
            setPossibleDrinks(updatedDrinks);
            applyFilters(updatedDrinks);
        }
    };

    const filterDrinksByCanMake = (canMake: boolean) => {
        const newFilters = { ...filters, canMake };
        setFilters(newFilters);
        applyFilters(possibleDrinks);
    };

    const filterDrinksByStrength = (strength: 'light' | 'medium' | 'strong' | null) => {
        const newFilters = { ...filters, strength };
        setFilters(newFilters);
        applyFilters(possibleDrinks);
    };

    const filterDrinksByTaste = (taste: string | null) => {
        const newFilters = { ...filters, taste };
        setFilters(newFilters);
        applyFilters(possibleDrinks);
    };

    const resetFilters = () => {
        setFilters({
            canMake: null,
            strength: null,
            taste: null,
            allowSubstitutions: true
        });
        setFilteredDrinks(possibleDrinks);
    };

    const getMissingIngredientsForDrink = (drinkId: string, ingredientList: Ingredient[]): Ingredient[] => {
        const drink = drinks.find(d => d.id === drinkId);
        if (!drink) return [];
        return getMissingIngredients(drink, ingredientList);
    };

    return (
        <DrinkContext.Provider
            value={{
                drinks,
                isLoading,
                error,
                filteredDrinks,
                possibleDrinks,
                getMissingIngredientsForDrink,
                filterDrinksByCanMake,
                filterDrinksByStrength,
                filterDrinksByTaste,
                resetFilters,
                updatePossibleDrinks,
                toggleAllowSubstitutions,
                allowSubstitutions: filters.allowSubstitutions
            }}
        >
            {children}
        </DrinkContext.Provider>
    );
};

export const useDrinks = (): DrinkContextType => {
    const context = useContext(DrinkContext);
    if (context === undefined) {
        throw new Error('useDrinks must be used within a DrinkProvider');
    }
    return context;
};