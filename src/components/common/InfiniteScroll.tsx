// src/components/common/InfiniteScroll.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Grid,Box, CircularProgress } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

interface InfiniteScrollProps {
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
    itemsPerPage: number;
    loadMoreThreshold?: number;
    loading?: boolean;
    endMessage?: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
                                                           items,
                                                           renderItem,
                                                           itemsPerPage,
                                                           loadMoreThreshold = 200,
                                                           loading = false,
                                                           endMessage,
                                                       }) => {
    const [displayedItems, setDisplayedItems] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Load initial items
    useEffect(() => {
        const initialItems = items.slice(0, itemsPerPage);
        setDisplayedItems(initialItems);
        setHasMore(items.length > itemsPerPage);
    }, [items, itemsPerPage]);

    // Load more items when scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && isMobile) {
                    loadMoreItems();
                }
            },
            { threshold: 0.1, rootMargin: `0px 0px ${loadMoreThreshold}px 0px` }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [hasMore, loading, displayedItems, isMobile]);

    // Load more items function
    const loadMoreItems = () => {
        const nextPage = page + 1;
        const startIndex = (nextPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newItems = items.slice(startIndex, endIndex);

        setDisplayedItems(prev => [...prev, ...newItems]);
        setPage(nextPage);
        setHasMore(endIndex < items.length);
    };

    // If not mobile, display all items
    useEffect(() => {
        if (!isMobile) {
            setDisplayedItems(items);
            setHasMore(false);
        } else {
            // Reset to initial state when switching to mobile
            setPage(1);
            setDisplayedItems(items.slice(0, itemsPerPage));
            setHasMore(items.length > itemsPerPage);
        }
    }, [isMobile, items, itemsPerPage]);

    return (
        <>
            {displayedItems.map((item, index) => renderItem(item, index))}

            <Grid size={{xs:12}}>
                <Box
                    ref={loaderRef}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        p: 2,
                        visibility: (hasMore && isMobile) ? 'visible' : 'hidden'
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : null}
                </Box>
            </Grid>

            {!hasMore && isMobile && endMessage}
        </>
    );
};

export default InfiniteScroll;