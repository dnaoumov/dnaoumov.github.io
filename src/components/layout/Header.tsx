import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    useMediaQuery,
    useTheme, ListItemButton, Tooltip
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    LocalBar as BarIcon,
    LocalDrink as DrinkIcon,
    ShoppingBasket as ShoppingIcon, Brightness7, Brightness4
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { darkMode, toggleDarkMode } = useCustomTheme();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    const navItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'My Bar', icon: <BarIcon />, path: '/my-bar' },
        { text: 'Drinks', icon: <DrinkIcon />, path: '/drinks' },
        { text: 'Shopping List', icon: <ShoppingIcon />, path: '/shopping-list' }
    ];

    // Check if a navigation item is active
    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') {
            return true;
        }
        return path !== '/' && location.pathname.startsWith(path);
    };

    const drawerList = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {navItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        component={RouterLink}
                        to={item.path}
                        sx={{
                            bgcolor: isActive(item.path) ? 'rgba(255, 112, 67, 0.1)' : 'transparent',
                            '&:hover': {
                                bgcolor: 'rgba(255, 112, 67, 0.05)',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: isActive(item.path) ? '#FF7043' : 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            sx={{ color: isActive(item.path) ? '#FF7043' : 'inherit' }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                {isMobile && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        color: '#FF7043',
                        fontWeight: 'bold',
                        textDecoration: 'none'
                    }}
                >
                    CarGPTini
                </Typography>

                {!isMobile && (
                    <Box>
                        {navItems.map((item) => (
                            <Button
                                key={item.text}
                                component={RouterLink}
                                to={item.path}
                                startIcon={item.icon}
                                sx={{
                                    ml: 1,
                                    color: isActive(item.path) ? '#FF7043' : 'white',
                                    '&:hover': {
                                        color: '#FF7043'
                                    }
                                }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                )}

                <Box sx={{ flexGrow: 1 }} />

                <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                    <IconButton onClick={toggleDarkMode} color="inherit">
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Tooltip>
            </Toolbar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerList}
            </Drawer>
        </AppBar>
    );
};

export default Header;