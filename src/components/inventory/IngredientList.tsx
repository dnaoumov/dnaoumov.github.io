import React, { useState } from 'react';
import {
    List,
    ListSubheader,
    Paper,
    Divider,
    TextField,
    InputAdornment,
    Box,
    Typography
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Ingredient, Category } from '../../models/Ingredient';
import IngredientItem from './IngredientItem';

interface IngredientListProps {
    ingredients: Ingredient[];
    categories: Category[];
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, categories }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle case where categories might be empty
    if (!categories || categories.length === 0) {
        return (
            <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                <Typography variant="body1">No categories available.</Typography>
            </Paper>
        );
    }

    // Group ingredients by category - fix potential undefined errors
    const groupedIngredients = categories
        .filter(category => category && category.id) // Ensure category is valid
        .map(category => {
            return {
                category,
                ingredients: filteredIngredients.filter(
                    ingredient => ingredient && ingredient.category === category.id
                )
            };
        }).filter(group => group.ingredients.length > 0);

    return (
        <Paper sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ p: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                    size="small"
                />
            </Box>

            <Divider />

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {groupedIngredients.length > 0 ? (
                    groupedIngredients.map(group => (
                        <React.Fragment key={group.category.id}>
                            <ListSubheader sx={{ bgcolor: 'background.default' }}>
                                {group.category.name}
                            </ListSubheader>
                            {group.ingredients.map(ingredient => (
                                <IngredientItem
                                    key={ingredient.id}
                                    ingredient={ingredient}
                                />
                            ))}
                            <Divider component="li" />
                        </React.Fragment>
                    ))
                ) : (
                    <ListSubheader>
                        {searchTerm ? "No ingredients match your search" : "No ingredients available"}
                    </ListSubheader>
                )}
            </List>
        </Paper>
    );
};

export default IngredientList;