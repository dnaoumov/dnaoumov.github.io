// src/components/inventory/IngredientList.tsx
import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Switch,
    Paper,
    Box,
    Typography,
    IconButton,
    Tooltip,
    Button
} from '@mui/material';
import {
    AddShoppingCart as AddToCartIcon,
    RemoveShoppingCart as RemoveFromCartIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { Ingredient, Category } from '../../models/Ingredient';
import { useInventory } from '../../contexts/InventoryContext';

interface IngredientListProps {
    ingredients: Ingredient[];
    categories: Category[];
    showAddToShoppingListButton?: boolean;
    showAddAllToShoppingList?: boolean;
}

const IngredientList: React.FC<IngredientListProps> = ({
                                                           ingredients,
                                                           categories,
                                                           showAddToShoppingListButton = false,
                                                           showAddAllToShoppingList = false
                                                       }) => {
    const {
        toggleIngredientStock,
        addToShoppingList,
        addMultipleToShoppingList,
        removeFromShoppingList,
        isInShoppingList
    } = useInventory();

    // Group ingredients by category
    const groupedIngredients = ingredients.reduce((acc, ingredient) => {
        const category = ingredient.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(ingredient);
        return acc;
    }, {} as Record<string, Ingredient[]>);

    const handleShoppingListAction = (ingredientId: string) => {
        if (isInShoppingList(ingredientId)) {
            removeFromShoppingList(ingredientId);
        } else {
            addToShoppingList(ingredientId);
        }
    };

    const handleAddAllToShoppingList = (categoryIngredients: Ingredient[]) => {
        // Get all ingredient IDs that aren't already in the shopping list
        const idsToAdd = categoryIngredients
            .filter(ingredient => !isInShoppingList(ingredient.id))
            .map(ingredient => ingredient.id);

        // Use the bulk add function instead of individual adds
        addMultipleToShoppingList(idsToAdd);
    };

    const handleAddAllOutOfStockToShoppingList = () => {
        // Get all out-of-stock ingredient IDs that aren't already in the shopping list
        const idsToAdd = ingredients
            .filter(ingredient => !isInShoppingList(ingredient.id))
            .map(ingredient => ingredient.id);

        // Use the bulk add function
        addMultipleToShoppingList(idsToAdd);
    };

    // Function to capitalize first letter of a string
    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <>
            {Object.entries(groupedIngredients).map(([category, categoryIngredients]) => (
                <Paper key={category} sx={{ mb: 3, overflow: 'hidden' }}>
                    <Box sx={{
                        bgcolor: 'primary.main',
                        py: 1,
                        px: 2,
                        color: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                    }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {capitalize(category)}
                        </Typography>
                    </Box>
                    <List dense>
                        {categoryIngredients.map((ingredient) => (
                            <ListItem key={ingredient.id} divider>
                                <ListItemText primary={ingredient.name} />
                                <ListItemSecondaryAction>
                                    {showAddToShoppingListButton && (
                                        <Tooltip title={isInShoppingList(ingredient.id)
                                            ? "Remove from shopping list"
                                            : "Add to shopping list"}>
                                            <IconButton
                                                edge="end"
                                                aria-label="shopping list action"
                                                onClick={() => handleShoppingListAction(ingredient.id)}
                                                sx={{ mr: 1 }}
                                            >
                                                {isInShoppingList(ingredient.id) ?
                                                    <RemoveFromCartIcon color="info" /> :
                                                    <AddToCartIcon />}
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Switch
                                        edge="end"
                                        onChange={() => toggleIngredientStock(ingredient.id, !ingredient.inStock)}
                                        checked={ingredient.inStock}
                                        color="primary"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>

                    {showAddAllToShoppingList && categoryIngredients.length > 0 && (
                        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={<ShoppingCartIcon />}
                                onClick={() => handleAddAllToShoppingList(categoryIngredients)}
                            >
                                Add all to shopping list
                            </Button>
                        </Box>
                    )}
                </Paper>
            ))}

            {showAddAllToShoppingList && ingredients.length > 0 && (
                <Box sx={{ mt: 2, mb: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddAllOutOfStockToShoppingList}
                    >
                        Add all out-of-stock items to shopping list
                    </Button>
                </Box>
            )}

            {Object.keys(groupedIngredients).length === 0 && (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="textSecondary">
                        No ingredients found
                    </Typography>
                </Paper>
            )}
        </>
    );
};

export default IngredientList;