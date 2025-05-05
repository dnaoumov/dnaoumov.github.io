import React from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Tabs,
    Tab,
    CircularProgress,
    Alert
} from '@mui/material';
import { useInventory } from '../contexts/InventoryContext';
import IngredientList from '../components/inventory/IngredientList';

const MyBar: React.FC = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const { ingredients, categories, isLoading, error } = useInventory();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const inStockIngredients = ingredients.filter(ingredient => ingredient.inStock);
    const outOfStockIngredients = ingredients.filter(ingredient => !ingredient.inStock);

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">{error}</Alert>
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
                    My Bar
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    Manage your inventory of ingredients to see what drinks you can make
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
                    <Tab label="All Ingredients" />
                    <Tab label={`In Stock (${inStockIngredients.length})`} />
                    <Tab label={`Shopping List (${outOfStockIngredients.length})`} />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <IngredientList
                    ingredients={ingredients}
                    categories={categories}
                />
            )}

            {tabValue === 1 && (
                <IngredientList
                    ingredients={inStockIngredients}
                    categories={categories}
                />
            )}

            {tabValue === 2 && (
                <IngredientList
                    ingredients={outOfStockIngredients}
                    categories={categories}
                />
            )}
        </Container>
    );
};

export default MyBar;