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
    shoppingList: string[];
    addToShoppingList: (ingredientId: string) => void;
    removeFromShoppingList: (ingredientId: string) => void;
    markInStock: (ingredientId: string, inStock: boolean) => void;
    isInShoppingList: (ingredientId: string) => boolean;
    addMultipleToShoppingList: (ingredientIds: string[]) => void;
    markAsPurchased: (ingredientId: string) => void;
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
    const [shoppingList, setShoppingList] = useState<string[]>([]);

    // Load shopping list from localStorage on init
    useEffect(() => {
        const savedList = localStorage.getItem('shoppingList');
        if (savedList) {
            try {
                setShoppingList(JSON.parse(savedList));
            } catch (e) {
                console.error('Failed to parse shopping list:', e);
            }
        }
    }, []);

    // Save shopping list to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    }, [shoppingList]);

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

    const addToShoppingList = (ingredientId: string) => {
        if (!shoppingList.includes(ingredientId)) {
            setShoppingList(prev => [...prev, ingredientId]);
        }
    };

    const removeFromShoppingList = (ingredientId: string) => {
        setShoppingList(prev => prev.filter(id => id !== ingredientId));
    };

    const markInStock = (ingredientId: string, inStock: boolean) => {
        const newIngredients = ingredients.map(ingredient =>
            ingredient.id === ingredientId ? { ...ingredient, inStock } : ingredient
        );
        setIngredients(newIngredients);
        saveIngredients(newIngredients);

        // Optionally remove from shopping list when marked in stock
        if (inStock) {
            removeFromShoppingList(ingredientId);
        }
    };

    const isInShoppingList = (ingredientId: string) => {
        return shoppingList.includes(ingredientId);
    };

    const addMultipleToShoppingList = (ingredientIds: string[]) => {
        if (!ingredientIds.length) return;

        // Use the functional update pattern to ensure we're working with the latest state
        setShoppingList(currentList => {
            const newList = [...currentList];

            // Add only ids that aren't already in the list
            ingredientIds.forEach(id => {
                if (!newList.includes(id)) {
                    newList.push(id);
                }
            });

            return newList;
        });
    };
    const markAsPurchased = (ingredientId: string) => {
        // 1. Remove from shopping list
        setShoppingList(prev => prev.filter(id => id !== ingredientId));

        // 2. Mark as in stock in inventory
        const newIngredients = ingredients.map(ingredient =>
            ingredient.id === ingredientId ? { ...ingredient, inStock: true } : ingredient
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
                updateIngredientAmount,
                shoppingList,
                addToShoppingList,
                removeFromShoppingList,
                markInStock,
                isInShoppingList,
                addMultipleToShoppingList,
                markAsPurchased
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