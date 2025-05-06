// src/components/drinks/DrinkCard.tsx
import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardActionArea,
    CardMedia,
    Typography,
    Box,
    Chip,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    useTheme,
    useMediaQuery,
    Skeleton
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon, LocalBar as DrinkIcon } from '@mui/icons-material';
import { Drink } from '../../models/Drink';
import { Ingredient } from '../../models/Ingredient';
import { findCategoryForTaste } from '../../constants/tasteCategories';
import placeholderImage from '../../media/drink-placeholder.jpg';

interface DrinkCardProps {
    drink: Drink;
    ingredients: Ingredient[];
    onClick: () => void;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink, ingredients, onClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [imageLoaded, setImageLoaded] = useState(false);

    // Get the image URL with proper path
    const getImageUrl = (imageName: string | undefined) => {
        if (!imageName) return placeholderImage;
        try {
            // Try to import the image dynamically
            return require(`../../media/drinks/${imageName}`);
        } catch (e) {
            // Fallback to placeholder if image can't be found
            return placeholderImage;
        }
    };

    const drinkImage = getImageUrl(drink.image);

    // Preload image
    useEffect(() => {
        const img = new Image();
        img.src = drinkImage;
        img.onload = () => setImageLoaded(true);
        img.onerror = () => {
            console.error(`Failed to load image: ${drinkImage}`);
            setImageLoaded(true); // Show placeholder on error
        };

        // Set a timeout in case image doesn't load
        const timer = setTimeout(() => {
            if (!imageLoaded) setImageLoaded(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, [drinkImage]);

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

    const imageHeight = isMobile ? 140 : 160;

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

    // Limit ingredients shown on the card for mobile
    const displayIngredients = isMobile && primaryIngredients.length > 3
        ? primaryIngredients.slice(0, 3)
        : primaryIngredients;

    return (
        <Card sx={{
            height: '100%',
            position: 'relative',
            overflow: 'hidden', // Changed from 'visible' to 'hidden'
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2, // Rounded corners
            boxShadow: 2 // Subtle shadow
        }}>
            {/* Can Make Indicator */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 8, // Moved inside the card
                    right: 8,
                    backgroundColor: drink.tags.canMake ? '#4CAF50' : '#F44336',
                    borderRadius: '50%',
                    width: isMobile ? 28 : 32,
                    height: isMobile ? 28 : 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
                    zIndex: 2
                }}
            >
                {drink.tags.canMake ? <CheckIcon fontSize={isMobile ? "small" : "medium"} /> : <CloseIcon fontSize={isMobile ? "small" : "medium"} />}
            </Box>
            <CardActionArea onClick={handleClickOpen} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {!imageLoaded ? (
                    <Skeleton
                        variant="rectangular"
                        height={imageHeight}
                        width="100%"
                        animation="wave"
                        sx={{ bgcolor: 'grey.200' }}
                    />
                ) : (
                    <CardMedia
                        component="img"
                        height={imageHeight}
                        image={drinkImage}
                        alt={drink.name}
                        sx={{
                            objectFit: "cover",
                            width: "100%"
                        }}
                    />
                )}
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    p: isMobile ? 1.5 : 2,
                    pt: isMobile ? 1 : 1.5, // Less padding at top
                    pb: isMobile ? 1 : 1.5, // Less padding at bottom
                    '&:last-child': { pb: isMobile ? 1 : 1.5 }
                }}>
                    {/* Title */}
                    <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        component="h2"
                        gutterBottom
                        sx={{
                            mb: 0.5,
                            fontWeight: 'medium',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.2
                        }}
                    >
                        {drink.name}
                    </Typography>

                    {/* Strength indicator */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: strengthData.color,
                            fontWeight: 'bold',
                            mb: 0.5,
                            fontSize: isMobile ? '0.75rem' : '0.875rem'
                        }}
                    >
                        {strengthData.text}
                    </Typography>

                    <Divider sx={{ my: isMobile ? 0.5 : 1 }} />

                    {/* Taste tags */}
                    <Box sx={{
                        mt: isMobile ? 0.5 : 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        mb: isMobile ? 0.5 : 1
                    }}>
                        {drink.tags.taste && drink.tags.taste.slice(0, isMobile ? 2 : undefined).map((taste) => {
                            const category = findCategoryForTaste(taste);
                            return (
                                <Chip
                                    key={taste}
                                    label={taste}
                                    size="small"
                                    sx={{
                                        bgcolor: category?.color || 'default',
                                        color: '#000',
                                        fontSize: isMobile ? '0.65rem' : '0.7rem',
                                        height: isMobile ? 20 : 24,
                                        '& .MuiChip-label': {
                                            px: isMobile ? 0.75 : 1
                                        }
                                    }}
                                />
                            );
                        })}
                        {isMobile && drink.tags.taste && drink.tags.taste.length > 2 && (
                            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                +{drink.tags.taste.length - 2} more
                            </Typography>
                        )}
                    </Box>

                    {/* Primary Ingredients section */}
                    <Box margin={isMobile ? 0.5 : 1}>
                        {displayIngredients.map((ingredient, idx) => {
                            const ingredientName = getIngredientNameById(ingredient.ingredientId);
                            const hasIngredient = ingredients.some(inv => inv.id === ingredient.ingredientId && inv.inStock);

                            return (
                                <Typography
                                    key={idx}
                                    variant={isMobile ? "caption" : "body2"}
                                    sx={{
                                        display: 'block',
                                        color: hasIngredient ? 'text.primary' : 'text.disabled',
                                        lineHeight: isMobile ? 1.3 : 1.5,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    • {ingredientName}
                                    {!isMobile && ingredient.substitutes && ingredient.substitutes.length > 0 && (
                                        <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                                            (or {ingredient.substitutes.map(subId => getIngredientNameById(subId)).join(', ')})
                                        </Typography>
                                    )}
                                </Typography>
                            );
                        })}
                        {isMobile && primaryIngredients.length > 3 && (
                            <Typography variant="caption" color="text.secondary">
                                +{primaryIngredients.length - 3} more ingredients
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>

            {/* Recipe Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
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
                </DialogTitle>
                {/* Dialog Image */}
                <CardMedia
                    component="img"
                    image={drinkImage}
                    alt={drink.name}
                    sx={{
                        height: isMobile ? 180 : 240,
                        objectFit: 'cover'
                    }}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = placeholderImage;
                    }}
                />
                <DialogContent dividers>
                    {drink.carAuctionEasterEgg && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', mt: 1, mb: 2 }}>
                            "{drink.carAuctionEasterEgg}"
                        </Typography>
                    )}
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
                    <Button onClick={handleClose} color="primary" fullWidth={isMobile}>Close</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default DrinkCard;