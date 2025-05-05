// src/theme/theme.ts
import { ThemeOptions, Components, Theme } from '@mui/material/styles';

const baseComponents: Components<Omit<Theme, "components">> = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 600,
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                overflow: 'hidden',
            },
        },
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 4,
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            },
        },
    },
};

const baseTheme: ThemeOptions = {
    typography: {
        fontFamily: ['"Open Sans"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
        h1: { fontSize: '2.5rem', fontWeight: 600 },
        h2: { fontSize: '2rem', fontWeight: 600 },
        h3: { fontSize: '1.75rem', fontWeight: 600 },
        h4: { fontSize: '1.5rem', fontWeight: 600 },
        h5: { fontSize: '1.25rem', fontWeight: 600 },
        h6: { fontSize: '1rem', fontWeight: 600 },
        subtitle1: { fontSize: '1rem', fontWeight: 500 },
        subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    },
    components: baseComponents,
};

export const lightTheme: ThemeOptions = {
    ...baseTheme,
    palette: {
        mode: 'light',
        primary: {
            main: '#0F2A52',
            light: '#2D4773',
            dark: '#091935',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#FF7043',
            light: '#FFA270',
            dark: '#C63F17',
            contrastText: '#ffffff',
        },
        background: {
            default: '#F5F7FA',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#6B7280',
        },
    },
    components: {
        ...baseComponents,
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0F2A52',
                },
            },
        },
    },
};

export const darkTheme: ThemeOptions = {
    ...baseTheme,
    palette: {
        mode: 'dark',
        primary: {
            main: '#90CAF9',
            light: '#BBE4FF',
            dark: '#5C97C6',
            contrastText: '#000000',
        },
        secondary: {
            main: '#FF9E80',
            light: '#FFD0B0',
            dark: '#C96F53',
            contrastText: '#000000',
        },
        background: {
            default: '#121212',
            paper: '#1E1E1E',
        },
        text: {
            primary: '#ffffff',
            secondary: '#B0B0B0',
        },
    },
    components: {
        ...baseComponents,
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1E1E1E',
                },
            },
        },
    },
};