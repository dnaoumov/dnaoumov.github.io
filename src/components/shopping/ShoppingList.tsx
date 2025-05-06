import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
    Typography,
    Box,
    Button,
    Tooltip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Delete as DeleteIcon,
    CheckCircle as CheckIcon,
    ShoppingCart as ShoppingCartIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useInventory } from '../../contexts/InventoryContext';
import AddToShoppingListDialog from './AddToShoppingListDialog';

const ShoppingList: React.FC = () => {
    const {
        ingredients,
        shoppingList,
        removeFromShoppingList,
        markAsPurchased,
        addToShoppingList
    } = useInventory();

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Filter to get only ingredients that are in the shopping list
    const shoppingListItems = ingredients.filter(ingredient =>
        shoppingList.includes(ingredient.id)
    );

    // Filter to show all ingredients not in shopping list for the dialog
    const availableIngredients = ingredients.filter(ingredient =>
        !shoppingList.includes(ingredient.id)
    );

    const handleRemove = (id: string) => {
        removeFromShoppingList(id);
    };

    const handleMarkAsPurchased = (id: string) => {
        markAsPurchased(id);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleAddItems = (selectedIds: string[]) => {
        selectedIds.forEach(id => addToShoppingList(id));
    };

    if (shoppingListItems.length === 0) {
        return (
            <>
                <Paper elevation={2} sx={{
                    p: { xs: 2, sm: 3 },
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <ShoppingCartIcon sx={{
                        fontSize: { xs: 50, sm: 60 },
                        color: 'text.secondary',
                        opacity: 0.3,
                        mb: 2
                    }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Your shopping list is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add ingredients from My Bar to create your shopping list
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: { xs: '100%', sm: 'auto' } }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDialogOpen}
                            startIcon={<AddIcon />}
                            fullWidth={isMobile}
                            sx={{ px: { xs: 3, sm: 2 } }}
                        >
                            Add Item
                        </Button>
                    </Box>
                </Paper>

                <AddToShoppingListDialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    onAdd={handleAddItems}
                    availableIngredients={availableIngredients}
                />
            </>
        );
    }

    return (
        <>
            <Paper elevation={1}>
                <Box sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0,0,0,0.12)',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 }
                }}>
                    <Typography variant="h6" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        Shopping List
                    </Typography>
                    <Button
                        variant="contained"
                        size={isMobile ? "medium" : "small"}
                        startIcon={<AddIcon />}
                        onClick={handleDialogOpen}
                        fullWidth={isMobile}
                    >
                        Add Item
                    </Button>
                </Box>
                <List disablePadding>
                    {shoppingListItems.map((ingredient) => (
                        <ListItem
                            key={ingredient.id}
                            divider
                            sx={{ py: { xs: 1.5, sm: 1 } }} // Increased touch target height
                            secondaryAction={
                                <Box sx={{
                                    display: 'flex',
                                    '& .MuiIconButton-root': {
                                        p: { xs: 1.5, sm: 1 } // Larger touch targets for buttons
                                    }
                                }}>
                                    <Tooltip title="Mark as purchased">
                                        <IconButton
                                            edge="end"
                                            aria-label="mark purchased"
                                            onClick={() => handleMarkAsPurchased(ingredient.id)}
                                            color="success"
                                            sx={{ mr: 1 }}
                                        >
                                            <CheckIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove">
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleRemove(ingredient.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            }
                        >
                            <ListItemText
                                primary={ingredient.name}
                                sx={{ pr: { xs: 15, sm: 10 } }} // Ensure text doesn't overlap buttons
                            />
                        </ListItem>
                    ))}
                </List>

                <Box sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 }
                }}>
                    <Typography variant="body2" color="text.secondary">
                        {shoppingListItems.length} item{shoppingListItems.length !== 1 ? 's' : ''} in your shopping list
                    </Typography>

                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<CheckIcon />}
                        onClick={() => {
                            shoppingListItems.forEach(item => markAsPurchased(item.id));
                        }}
                        fullWidth={isMobile}
                        sx={{ py: { xs: 1, sm: 'auto' } }}
                    >
                        Mark all as purchased
                    </Button>
                </Box>
            </Paper>

            <AddToShoppingListDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                onAdd={handleAddItems}
                availableIngredients={availableIngredients}
            />
        </>
    );
};

export default ShoppingList;