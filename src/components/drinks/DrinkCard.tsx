// src/components/drinks/DrinkCard.tsx
import React from 'react';
import {
    Button,
    Card,
    CardContent,
    CardActionArea,
    Typography,
    Box,
    Chip,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon,LocalBar as DrinkIcon } from '@mui/icons-material';
import { Drink } from '../../models/Drink';
import { Ingredient } from '../../models/Ingredient';
import { findCategoryForTaste } from '../../constants/tasteCategories';

interface DrinkCardProps {
    drink: Drink;
    ingredients: Ingredient[];
    onClick: () => void;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink, ingredients,onClick }) => {
    // Get strength display data
    const getStrengthDisplay = (strength: string | undefined) => {
        switch(strength) {
            case 'light':
                return { text: 'Light', color: '#4CAF50' };
            case 'medium':
                return { text: 'Medium', color: '#FFC107' };
            case 'strong':
                return { text: 'Strong', color: '#F44336' };
            default:
                return { text: 'Unknown', color: '#9E9E9E' };
        }
    };

    const strengthData = getStrengthDisplay(drink.tags.strength);

    // Find ingredient name by ID
    const getIngredientNameById = (id: string): string => {
        const ingredient = ingredients.find(ing => ing.id === id);
        return ingredient ? ingredient.name : id;
    };
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Filter primary ingredients
    const primaryIngredients = drink.ingredients.filter(ing => ing.category === 'primary' || !ing.category);

    return (
        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible',display: 'flex', flexDirection: 'column' }}>
            {/* Can Make Indicator */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    backgroundColor: drink.tags.canMake ? '#4CAF50' : '#F44336',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'
                }}
            >
                {drink.tags.canMake ? <CheckIcon /> : <CloseIcon />}
            </Box>
            <CardActionArea onClick={onClick}>

                <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    {/* Title */}
                    <Typography variant="h6" component="h2" gutterBottom>
                        {drink.name}
                    </Typography>

                    {/* Strength indicator */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: strengthData.color,
                            fontWeight: 'bold',
                            mb: 1
                        }}
                    >
                        {strengthData.text}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    {/* Taste tags */}
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {drink.tags.taste && drink.tags.taste.map((taste) => {
                            const category = findCategoryForTaste(taste);
                            return (
                                <Chip
                                    key={taste}
                                    label={taste}
                                    size="small"
                                    sx={{
                                        bgcolor: category?.color || 'default',
                                        color: '#000',
                                        fontSize: '0.7rem',
                                        height: 24
                                    }}
                                />
                            );
                        })}
                    </Box>

                    {/* Primary Ingredients section */}
                    <Box margin={1}>
                        {primaryIngredients.map((ingredient, idx) => {
                            const ingredientName = getIngredientNameById(ingredient.ingredientId);
                            const hasIngredient = ingredients.some(inv => inv.id === ingredient.ingredientId && inv.inStock);

                            return (
                                <Typography
                                    key={idx}
                                    variant="body2"
                                    sx={{
                                        display: 'block',
                                        color: hasIngredient ? 'text.primary' : 'text.disabled'
                                    }}
                                >
                                    • {ingredientName}
                                    {ingredient.substitutes && ingredient.substitutes.length > 0 && (
                                        <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                                            (or {ingredient.substitutes.map(subId => getIngredientNameById(subId)).join(', ')})
                                        </Typography>
                                    )}
                                </Typography>
                            );
                        })}
                    </Box>
                </CardContent>
            </CardActionArea>
            {/* Recipe Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {drink.name}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {drink.carAuctionEasterEgg && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', mt: 1 }}>
                            {drink.carAuctionEasterEgg}
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent dividers>
                    {/* Strength and taste tags */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Strength:</Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: strengthData.color, fontWeight: 'bold', mb: 1 }}
                        >
                            {strengthData.text}
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom>Taste Profile:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {drink.tags.taste && drink.tags.taste.map((taste) => {
                                const category = findCategoryForTaste(taste);
                                return (
                                    <Chip
                                        key={taste}
                                        label={taste}
                                        size="small"
                                        sx={{
                                            bgcolor: category?.color || 'default',
                                            color: '#000'
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* All ingredients */}
                    <Typography variant="subtitle1" gutterBottom>Ingredients:</Typography>

                    {/* Primary ingredients */}
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Primary:</Typography>
                    {drink.ingredients
                        .filter(ing => ing.category === 'primary' || !ing.category)
                        .map((ingredient, idx) => {
                            const ingredientName = getIngredientNameById(ingredient.ingredientId);
                            const hasIngredient = ingredients.some(inv => inv.id === ingredient.ingredientId && inv.inStock);

                            return (
                                <Typography
                                    key={idx}
                                    variant="body2"
                                    sx={{
                                        display: 'block',
                                        color: hasIngredient ? 'text.primary' : 'text.disabled'
                                    }}
                                >
                                    • {ingredient.amount} {ingredient.unit} {ingredientName}
                                    {ingredient.substitutes && ingredient.substitutes.length > 0 && (
                                        <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                                            (or {ingredient.substitutes.map(subId => getIngredientNameById(subId)).join(', ')})
                                        </Typography>
                                    )}
                                </Typography>
                            );
                        })}

                    {/* Secondary ingredients */}
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>Secondary:</Typography>
                    {drink.ingredients
                        .filter(ing => ing.category === 'secondary')
                        .map((ingredient, idx) => {
                            const ingredientName = getIngredientNameById(ingredient.ingredientId);
                            const hasIngredient = ingredients.some(inv => inv.id === ingredient.ingredientId && inv.inStock);

                            return (
                                <Typography
                                    key={idx}
                                    variant="body2"
                                    sx={{
                                        display: 'block',
                                        color: hasIngredient ? 'text.primary' : 'text.disabled'
                                    }}
                                >
                                    • {ingredient.amount} {ingredient.unit} {ingredientName}
                                </Typography>
                            );
                        })}

                    <Divider sx={{ my: 2 }} />

                    {/* Instructions */}
                    <Typography variant="subtitle1" gutterBottom>Instructions:</Typography>
                    <Typography variant="body2" paragraph>
                        {drink.instructions}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default DrinkCard;