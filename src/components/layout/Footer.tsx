import React from 'react';
import { Box, Typography, Container, useTheme, useMediaQuery } from '@mui/material';

const Footer: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            component="footer"
            sx={{
                py: { xs: 2, sm: 3 },
                px: { xs: 1, sm: 2 },
                mt: 'auto',
                backgroundColor: theme.palette.mode === 'dark'
                    ? theme.palette.background.paper
                    : theme.palette.grey[200],
                borderTop: `1px solid ${
                    theme.palette.mode === 'dark'
                        ? theme.palette.divider
                        : theme.palette.grey[300]
                }`
            }}
        >
            <Container maxWidth="md" sx={{
                px: { xs: 2, sm: 3 }
            }}>
                <Typography
                    variant={isMobile ? "body2" : "body1"}
                    color="text.secondary"
                    align="center"
                >
                    {'CarGPTini - '}
                    {new Date().getFullYear()}
                    {' - Revolutionary Cocktail Management'}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{
                        mt: { xs: 0.5, sm: 1 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                >
                    {'Never drink and drive. Always bid responsibly.'}
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;