// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import {
    lightTheme,
    darkTheme
} from '../theme/theme';

type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Get saved preference from localStorage, default to light
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true';
    });

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', String(newMode));
    };

    const theme = useMemo(
        () => createTheme(darkMode ? darkTheme : lightTheme),
        [darkMode]
    );

    useEffect(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            const primaryColor = darkMode
                ? ((darkTheme.palette as any)?.primary?.main ?? '#121212')
                : ((lightTheme.palette as any)?.primary?.main ?? '#0F2A52');

            metaThemeColor.setAttribute('content', primaryColor);
        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};