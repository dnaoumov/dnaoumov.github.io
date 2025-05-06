// src/components/layout/PageHeader.tsx
import React from 'react';
import { Box, Paper, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    imageSrc: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, imageSrc }) => {
    return (
        <Paper
            sx={{
                position: 'relative',
                overflow: 'hidden',
                height: '180px',
                mb: 3,
                background: 'linear-gradient(45deg, #0F2A52 30%, #2D4773 90%)',
                display: 'flex',
                alignItems: 'center',
            }}
            elevation={2}
        >
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#FF7043', fontWeight: 'bold' }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="subtitle1" sx={{ color: 'white', maxWidth: '60%' }}>
                        {subtitle}
                    </Typography>
                )}
            </Container>

            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 0.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '50%',
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 1
                }}
            />
        </Paper>
    );
};

export default PageHeader;