// src/components/drinks/DrinkList.tsx
import React, { useState } from 'react';
import { Grid, Dialog, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Drink } from '../../models/Drink';
import { Ingredient } from '../../models/Ingredient';
import DrinkCard from './DrinkCard';
import DrinkRecipe from './DrinkRecipe';
import DrinkListSkeleton from "./DrinkListSkeleton";

interface DrinkListProps {
    drinks: Drink[];
    ingredients: Ingredient[];
    isLoading: boolean;
}

const DrinkList: React.FC<DrinkListProps> = ({ drinks, ingredients, isLoading }) => {
    const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDrinkClick = (drink: Drink) => {
        setSelectedDrink(drink);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    if (isLoading) {
        return <DrinkListSkeleton/>;
    }

    if (drinks.length === 0) {
        return (
            <Grid container spacing={3}>
                <Grid size={{xs:12}}>
                    <p>No drinks found matching the current filters.</p>
                </Grid>
            </Grid>
        );
    }

    return (
        <>
            <Grid container spacing={3}>
                {drinks.map((drink) => (
                    <Grid size={{xs:12, sm:6, md:4}} key={drink.id}>
                        <DrinkCard
                            drink={drink}
                            ingredients={ingredients}
                            onClick={() => handleDrinkClick(drink)}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Dialog for showing the drink recipe */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                aria-labelledby="drink-recipe-dialog"
            >
                <DialogContent sx={{ p: 2, position: 'relative' }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            zIndex: 1
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {selectedDrink && (
                        <DrinkRecipe drink={selectedDrink} ingredients={ingredients} />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DrinkList;