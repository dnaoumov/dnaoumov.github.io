// src/App.tsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import { ThemeProvider } from './contexts/ThemeContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { DrinkProvider } from './contexts/DrinkContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import MyBar from './pages/MyBar';
import Drinks from './pages/Drinks';
import ShoppingListPage from './pages/ShoppingList';

function App() {
    return (
        <ThemeProvider>
            <CssBaseline />
            <InventoryProvider>
                <DrinkProvider>
                    <Router>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100vh'
                        }}>
                            <Header />
                            <Box component="main" sx={{ flexGrow: 1 }}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/my-bar" element={<MyBar />} />
                                    <Route path="/drinks" element={<Drinks />} />
                                    <Route path="/shopping-list" element={<ShoppingListPage />} />
                                    <Route path="*" element={<Home />} />
                                </Routes>
                            </Box>
                            <Footer />
                        </Box>
                    </Router>
                </DrinkProvider>
            </InventoryProvider>
        </ThemeProvider>
    );
}

export default App;