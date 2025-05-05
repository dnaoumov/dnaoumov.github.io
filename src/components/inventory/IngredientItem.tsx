import React, { useState } from 'react';
import {
    ListItem,
    ListItemText,
    Switch,
    IconButton,
    TextField,
    InputAdornment,
    Typography,
    Box,
    Tooltip
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { Ingredient } from '../../models/Ingredient';
import { useInventory } from '../../contexts/InventoryContext';

interface IngredientItemProps {
    ingredient: Ingredient;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient }) => {
    const { toggleIngredientStock, updateIngredientAmount } = useInventory();
    const [isEditing, setIsEditing] = useState(false);
    const [amount, setAmount] = useState(ingredient.amount?.toString() || '0');

    // Handle undefined or null values safely
    const displayAmount = ingredient.amount !== undefined && ingredient.amount !== null
        ? ingredient.amount
        : 0;
    const displayUnit = ingredient.unit || '';

    const handleToggle = () => {
        toggleIngredientStock(ingredient.id, !ingredient.inStock);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        // Reset amount to current ingredient amount when entering edit mode
        setAmount(displayAmount.toString());
    };

    const handleSaveClick = () => {
        const parsedAmount = parseInt(amount);
        // Ensure amount is a valid number
        if (!isNaN(parsedAmount) && parsedAmount >= 0) {
            updateIngredientAmount(ingredient.id, parsedAmount);
            setIsEditing(false);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        // Reset to original value on cancel
        setAmount(displayAmount.toString());
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow positive numbers
        if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
            setAmount(e.target.value);
        }
    };

    return (
        <ListItem
            sx={{
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
            }}
            secondaryAction={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={ingredient.inStock ? "Mark as out of stock" : "Mark as in stock"}>
                        <Switch
                            edge="end"
                            onChange={handleToggle}
                            checked={ingredient.inStock}
                            color="primary"
                        />
                    </Tooltip>
                </Box>
            }
        >
            <ListItemText
                primary={
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: ingredient.inStock ? 'normal' : 'light',
                            color: ingredient.inStock ? 'text.primary' : 'text.secondary'
                        }}
                    >
                        {ingredient.name}
                    </Typography>
                }

            />
        </ListItem>
    );
};

export default IngredientItem;