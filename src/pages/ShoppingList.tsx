// src/pages/ShoppingList.tsx
import React from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowBack, ShoppingCart } from '@mui/icons-material';
import { useInventory } from '../contexts/InventoryContext';
import ShoppingListComponent from '../components/shopping/ShoppingList';
import PageHeader from '../components/layout/PageHeader';
import shoppingImage from '../media/shopping_list.jpg';

const ShoppingListPage: React.FC = () => {
    const { isLoading, error } = useInventory();

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
            <PageHeader
                title="Shopping List"
                subtitle="Keep track of ingredients you need to buy."
                imageSrc={shoppingImage}
            />

            <ShoppingListComponent />
        </Container>
    );
};

export default ShoppingListPage;