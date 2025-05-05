import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Ingredient, Category } from '../models/Ingredient';
import { fetchIngredients, fetchCategories, saveIngredients, getLocalIngredients } from '../services/dataService';

interface InventoryContextType {
    ingredients: Ingredient[];
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    updateIngredient: (updatedIngredient: Ingredient) => void;
    toggleIngredientStock: (id: string, inStock: boolean) => void;
    updateIngredientAmount: (id: string, amount: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

interface InventoryProviderProps {
    children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                // Try to get saved ingredients from localStorage first
                const localIngredients = getLocalIngredients();

                if (localIngredients) {
                    setIngredients(localIngredients);
                } else {
                    const fetchedIngredients = await fetchIngredients();
                    setIngredients(fetchedIngredients);
                }

                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);

                setError(null);
            } catch (err) {
                setError('Failed to load inventory data');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const updateIngredient = (updatedIngredient: Ingredient) => {
        const newIngredients = ingredients.map(ingredient =>
            ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient
        );
        setIngredients(newIngredients);
        saveIngredients(newIngredients);
    };

    const toggleIngredientStock = (id: string, inStock: boolean) => {
        const newIngredients = ingredients.map(ingredient =>
            ingredient.id === id ? { ...ingredient, inStock } : ingredient
        );
        setIngredients(newIngredients);
        saveIngredients(newIngredients);
    };

    const updateIngredientAmount = (id: string, amount: number) => {
        const newIngredients = ingredients.map(ingredient =>
            ingredient.id === id ? { ...ingredient, amount } : ingredient
        );
        setIngredients(newIngredients);
        saveIngredients(newIngredients);
    };

    return (
        <InventoryContext.Provider
            value={{
                ingredients,
                categories,
                isLoading,
                error,
                updateIngredient,
                toggleIngredientStock,
                updateIngredientAmount
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = (): InventoryContextType => {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};