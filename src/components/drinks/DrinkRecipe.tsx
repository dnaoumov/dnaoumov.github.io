// src/components/drinks/DrinkRecipe.tsx
import React from 'react';
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    Chip,
    Paper,
    Grid,
    Avatar,
    Tooltip
} from '@mui/material';
import { LocalBar, Warning, CheckCircle, Info } from '@mui/icons-material';
import { Drink } from '../../models/Drink';
import { Ingredient } from '../../models/Ingredient';
import { useInventory } from '../../contexts/InventoryContext';

interface DrinkRecipeProps {
    drink: Drink;
    ingredients?: Ingredient[];
}

const DrinkRecipe: React.FC<DrinkRecipeProps> = ({ drink, ingredients = [] }) => {
    const { ingredients: allIngredients } = useInventory();
    const ingredientsToUse = ingredients.length > 0 ? ingredients : allIngredients;

    // Create a map of ingredient IDs to their full details
    const ingredientMap = new Map(
        ingredientsToUse.map(ing => [ing.id, ing])
    );

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: drink.tags.canMake ? 'success.main' : 'grey.400',
                        mr: 2,
                        alignSelf: 'flex-start',
                        mt: 0.5
                    }}
                >
                    <LocalBar />
                </Avatar>

                <Box>
                    <Typography variant="h5" component="h2">
                        {drink.name}
                    </Typography>

                    {drink.carAuctionEasterEgg && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontStyle: 'italic',
                                mt: 0.5
                            }}
                        >
                            "{drink.carAuctionEasterEgg}"
                        </Typography>
                    )}
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
                {/* Left column: Ingredients */}
                <Grid size={{xs:12, md:6}}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Info sx={{ mr: 1, fontSize: 20 }} color="primary" />
                        Ingredients
                    </Typography>

                    <List dense>
                        {drink.ingredients.map((item) => {
                            const ingredient = ingredientMap.get(item.ingredientId);
                            const hasIngredient = ingredient?.inStock || false;
                            const hasSubstitute = item.substitutes?.some(
                                subId => ingredientsToUse.some(ing => ing.id === subId && ing.inStock)
                            );

                            return (
                                <ListItem
                                    key={item.ingredientId}
                                    sx={{
                                        py: 1,
                                        borderLeft: `3px solid ${hasIngredient ? 'success.main' : hasSubstitute ? 'warning.main' : 'error.light'}`,
                                        pl: 2,
                                        mb: 1,
                                        backgroundColor: hasIngredient ? 'rgba(76, 175, 80, 0.08)' :
                                            hasSubstitute ? 'rgba(255, 152, 0, 0.08)' :
                                                'rgba(244, 67, 54, 0.08)',
                                        borderRadius: 1
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1">
                                                    {item.amount} {item.unit} {ingredient?.name || 'Unknown Ingredient'}
                                                </Typography>
                                                {hasIngredient ? (
                                                    <Tooltip title="In stock">
                                                        <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
                                                    </Tooltip>
                                                ) : hasSubstitute ? (
                                                    <Tooltip title="Substitute available">
                                                        <Warning sx={{ color: 'warning.main', fontSize: 18 }} />
                                                    </Tooltip>
                                                ) : null}
                                            </Box>
                                        }
                                        secondary={
                                            !hasIngredient && item.substitutes && item.substitutes.length > 0 ? (
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Substitutes:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                        {item.substitutes.map(subId => {
                                                            const sub = ingredientMap.get(subId);
                                                            const isAvailable = sub?.inStock || false;
                                                            return (
                                                                <Chip
                                                                    key={subId}
                                                                    label={sub?.name || 'Unknown'}
                                                                    size="small"
                                                                    color={isAvailable ? "success" : "default"}
                                                                    variant={isAvailable ? "filled" : "outlined"}
                                                                />
                                                            );
                                                        })}
                                                    </Box>
                                                </Box>
                                            ) : null
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>

                {/* Right column: Instructions and additional info */}
                <Grid size={{xs:12, md:6}}>
                    <Typography variant="h6" gutterBottom>Instructions</Typography>
                    <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-line' }}>
                        {drink.instructions || "No instructions provided."}
                    </Typography>

                    {/* Drink characteristics */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>Characteristics</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {drink.tags.strength && (
                                <Chip
                                    label={`Strength: ${drink.tags.strength}`}
                                    size="small"
                                    color={
                                        drink.tags.strength === 'strong' ? 'error' :
                                            drink.tags.strength === 'medium' ? 'warning' : 'success'
                                    }
                                />
                            )}

                            {drink.tags.taste && drink.tags.taste.map(taste => (
                                <Chip
                                    key={taste}
                                    label={taste}
                                    size="small"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default DrinkRecipe;