import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Checkbox,
    IconButton,
    Paper,
    Typography,
    Button,
    Box,
    Divider
} from '@mui/material';
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Ingredient } from '../../models/Ingredient';
import { useInventory } from '../../contexts/InventoryContext';

interface ShoppingListProps {
    missingIngredients: Ingredient[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ missingIngredients }) => {
    const { toggleIngredientStock } = useInventory();
    const [checked, setChecked] = useState<string[]>([]);

    const handleToggle = (id: string) => () => {
        const currentIndex = checked.indexOf(id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const markAsPurchased = () => {
        checked.forEach(id => {
            toggleIngredientStock(id, true);
        });
        setChecked([]);
    };

    if (missingIngredients.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    You have all ingredients in stock!
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                    Shopping List ({missingIngredients.length} items)
                </Typography>

                {checked.length > 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={markAsPurchased}
                    >
                        Mark {checked.length} as Purchased
                    </Button>
                )}
            </Box>

            <Divider />

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {missingIngredients.map((ingredient) => {
                    const labelId = `checkbox-list-label-${ingredient.id}`;

                    return (
                        <ListItem
                            key={ingredient.id}
                            secondaryAction={
                                <IconButton edge="end" aria-label="comments">
                                    <DeleteIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItem dense>
                                <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(ingredient.id) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    onChange={handleToggle(ingredient.id)}
                                />
                                <ListItemText
                                    id={labelId}
                                    primary={ingredient.name}
                                />
                            </ListItem>
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
};

export default ShoppingList;