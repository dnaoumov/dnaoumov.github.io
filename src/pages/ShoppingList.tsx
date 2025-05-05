import React from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    CircularProgress,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import { useInventory } from '../contexts/InventoryContext';
import { useDrinks } from '../contexts/DrinkContext';
import ShoppingListComponent from '../components/shopping/ShoppingList';
import {Ingredient} from "../models/Ingredient";

const ShoppingList: React.FC = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const { ingredients, isLoading: inventoryLoading, error: inventoryError } = useInventory();
    const { possibleDrinks, isLoading: drinksLoading, error: drinksError } = useDrinks();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const missingIngredients = ingredients.filter(ingredient => !ingredient.inStock);

    // Get ingredients needed for "almost makeable" drinks (missing only 1-2 ingredients)
    const getAlmostMakeableDrinks = () => {
        const inStockIngredientIds = new Set(
            ingredients.filter(ing => ing.inStock).map(ing => ing.id)
        );

        return possibleDrinks
            .filter(drink => {
                // Count missing ingredients
                const missingCount = drink.ingredients.filter(
                    ingr => !inStockIngredientIds.has(ingr.ingredientId)
                ).length;

                // "Almost makeable" means missing only 1-2 ingredients
                return missingCount > 0 && missingCount <= 2;
            })
            .flatMap(drink => {
                // Get the missing ingredients for each drink
                return drink.ingredients
                    .filter(ingr => !inStockIngredientIds.has(ingr.ingredientId))
                    .map(ingr => {
                        const ingredient = ingredients.find(i => i.id === ingr.ingredientId);
                        return ingredient;
                    })
                    .filter(Boolean) as Ingredient[];
            })
            // Remove duplicates
            .filter((ingredient, index, self) =>
                index === self.findIndex(i => i.id === ingredient.id)
            );
    };

    const almostMakeableIngredients = getAlmostMakeableDrinks();

    if (inventoryLoading || drinksLoading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (inventoryError || drinksError) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">{inventoryError || drinksError}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    background: 'linear-gradient(45deg, #0F2A52 30%, #2D4773 90%)',
                    color: 'white'
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#FF7043' }}>
                    Shopping List
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    Plan your next shopping trip to expand your drink options
                </Typography>
            </Paper>

            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="All Missing Ingredients" />
                    <Tab label="Ingredients to Complete Drinks" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <ShoppingListComponent missingIngredients={missingIngredients} />
            )}

            {tabValue === 1 && (
                <ShoppingListComponent missingIngredients={almostMakeableIngredients} />
            )}
        </Container>
    );
};

export default ShoppingList;