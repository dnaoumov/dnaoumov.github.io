// src/pages/MyBar.tsx
import React, { useState } from 'react';
import { Container, Box, Tabs, Tab, Alert } from '@mui/material';
import IngredientList from '../components/inventory/IngredientList';
import { useInventory } from '../contexts/InventoryContext';
import PageHeader from '../components/layout/PageHeader';
import barImage from '../media/my_bar.jpg';

const MyBar: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const { ingredients, categories, isLoading, error } = useInventory();

    const inStockIngredients = ingredients.filter(i => i.inStock);
    const outOfStockIngredients = ingredients.filter(i => !i.inStock);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <div>Loading...</div>
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
        <>
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <PageHeader
                    title="My Bar"
                    subtitle="Manage your inventory and keep track of what you have on hand."
                    imageSrc={barImage}
                />
            </Container>

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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
                        <Tab label={`Out of Stock (${outOfStockIngredients.length})`} />
                    </Tabs>
                </Box>

                {tabValue === 0 && (
                    <IngredientList
                        ingredients={ingredients}
                        categories={categories}
                        showAddToShoppingListButton={true}
                    />
                )}

                {tabValue === 1 && (
                    <IngredientList
                        ingredients={inStockIngredients}
                        categories={categories}
                        showAddToShoppingListButton={true}
                    />
                )}

                {tabValue === 2 && (
                    <IngredientList
                        ingredients={outOfStockIngredients}
                        categories={categories}
                        showAddToShoppingListButton={true}
                        showAddAllToShoppingList={true}
                    />
                )}
            </Container>
        </>
    );
};

export default MyBar;