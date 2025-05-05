import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.grey[200]
            }}
        >
            <Container maxWidth="md">
                <Typography variant="body2" color="text.secondary" align="center">
                    {'CarGPTini - '}
                    {new Date().getFullYear()}
                    {' - Revolutionary Cocktail Management'}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    {'Never drink and drive. Always bid responsibly.'}
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;