// src/components/drinks/DrinkListSkeleton.tsx
import React from 'react';
import { Grid, Skeleton, Card, CardContent } from '@mui/material';

const DrinkListSkeleton: React.FC = () => {
    // Generate an array of 6 placeholders
    const skeletons = Array(6).fill(null);

    return (
        <Grid container spacing={3}>
            {skeletons.map((_, index) => (
                <Grid size={{xs:12, sm:6, md:4}} key={index}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            {/* Title */}
                            <Skeleton variant="text" width="80%" height={28} />

                            {/* Tags */}
                            <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />

                            {/* Ingredients */}
                            <Skeleton variant="text" width="90%" height={16} sx={{ mt: 2 }} />
                            <Skeleton variant="text" width="85%" height={16} sx={{ mt: 0.5 }} />
                            <Skeleton variant="text" width="70%" height={16} sx={{ mt: 0.5 }} />

                            {/* Button */}
                            <Skeleton variant="rounded" width="100%" height={36} sx={{ mt: 2 }} />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default DrinkListSkeleton;