import React, { useState, useEffect } from 'react';
import { TASTE_CATEGORIES, findCategoryForTaste } from '../constants/tasteCategories';
import {
    Container,
    Typography,
    Paper,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Chip,
    Button,
    Alert,
    Divider,
    ToggleButton,
    Slider,
    styled,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Grid,
    Pagination,
    Stack,
    FormControlLabel,
    Switch
} from '@mui/material';
import {
    FilterAlt as FilterIcon,
    Clear as ClearIcon,
    CheckCircle as CanMakeIcon,
    LocalFireDepartment as StrengthIcon,
    Whatshot as TasteIcon
} from '@mui/icons-material';
import { useDrinks } from '../contexts/DrinkContext';
import { useInventory } from '../contexts/InventoryContext';
import DrinkList from '../components/drinks/DrinkList';
import PageHeader from '../components/layout/PageHeader';
import drinksImage from '../media/drinks.jpg';


// Custom styled Slider for the strength gauge
const StrengthSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.primary.main,
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
        background: 'linear-gradient(to right, #4CAF50, #FFC107, #F44336)',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: theme.palette.primary.main,
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
    '& .MuiSlider-mark': {
        backgroundColor: '#bfbfbf',
        height: 8,
        width: 1,
        '&.MuiSlider-markActive': {
            opacity: 1,
            backgroundColor: 'currentColor',
        },
    },
}));

// MENU_ITEM_HEIGHT and ITEM_PADDING_TOP are used for the dropdown menu styling
const MENU_ITEM_HEIGHT = 48;
const MENU_ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: MENU_ITEM_HEIGHT * 4.5 + MENU_ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// Items per page for pagination
const ITEMS_PER_PAGE = 6;

const Drinks: React.FC = () => {
    const {
        drinks,
        possibleDrinks,
        isLoading,
        error,
        resetFilters,
        updatePossibleDrinks,
        toggleAllowSubstitutions, // Add this from context
        allowSubstitutions // Add this from context
    } = useDrinks();

    const { ingredients } = useInventory();

    // State for filters
    const [strengthValue, setStrengthValue] = useState<number | null>(null);
    const [canMakeOnly, setCanMakeOnly] = useState<boolean>(false);
    const [selectedTastes, setSelectedTastes] = useState<string[]>([]);

    // Add state for filtered drinks instead of using context's filteredDrinks
    const [filteredDrinks, setFilteredDrinks] = useState<any[]>([]);

    // Pagination state
    const [page, setPage] = useState(1);

    // Get unique taste tags across all drinks - using Array.from(new Set()) as requested
    const allTasteTags = React.useMemo(() => {
        // Use categories instead of individual tastes
        return TASTE_CATEGORIES.map(category => category.name);
    }, []);

    const isFirstRender = React.useRef(true);

    // Slider marks for the strength gauge
    const strengthMarks = [
        {
            value: 0,
            label: 'All',
        },
        {
            value: 1,
            label: 'Light',
        },
        {
            value: 2,
            label: 'Medium',
        },
        {
            value: 3,
            label: 'Strong',
        },
    ];

    // Convert slider value to strength string
    const getStrengthFromValue = (value: number | null): 'light' | 'medium' | 'strong' | null => {
        switch(value) {
            case 1: return 'light';
            case 2: return 'medium';
            case 3: return 'strong';
            default: return null;
        }
    };

    // Handle strength slider change
    const handleStrengthChange = (event: Event, newValue: number | number[]) => {
        const value = newValue as number;
        setStrengthValue(value === 0 ? null : value);
        // The useEffect will trigger applyAllFilters
    };

    // Handle the Can Make toggle
    const handleCanMakeToggle = () => {
        setCanMakeOnly(!canMakeOnly);
        // The useEffect will trigger applyAllFilters
    };

    // Updated to handle multiple taste selections
    const handleTasteChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[];
        setSelectedTastes(value);
        // The useEffect will trigger applyAllFilters
    };

    // Handle removing a taste chip
    const handleDeleteTaste = (tasteToDelete: string) => {
        const newTastes = selectedTastes.filter(taste => taste !== tasteToDelete);
        setSelectedTastes(newTastes);
        // The useEffect will trigger applyAllFilters
    };

    const handleResetFilters = () => {
        setStrengthValue(null);
        setCanMakeOnly(false);
        setSelectedTastes([]);
        // No need to call resetFilters() from context
        // as our applyAllFilters will handle this
    };

    // Handle pagination change
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        // Scroll to top when changing page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Determine if we have active filters
    const hasActiveFilters = strengthValue !== null || canMakeOnly || selectedTastes.length > 0;

    // Count of drinks that can be made with current inventory
    const canMakeCount = possibleDrinks.filter(d => d.tags.canMake).length;

    // Get the actually filtered drinks to display
    const displayDrinks = filteredDrinks;

    // Pagination logic
    const totalPages = Math.ceil(displayDrinks.length / ITEMS_PER_PAGE);
    const paginatedDrinks = displayDrinks.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const getFilterableTastes = (categories: string[]): string[] => {
        return categories.flatMap(categoryName => {
            const category = TASTE_CATEGORIES.find(c => c.name === categoryName);
            return category ? category.tastes : [];
        });
    };
    useEffect(() => {
        // Only run this once when ingredients are loaded
        if (ingredients.length > 0 && drinks.length > 0 && updatePossibleDrinks && isFirstRender.current) {
            isFirstRender.current = false;
            updatePossibleDrinks(ingredients);
        }
    }, [ingredients, drinks.length, updatePossibleDrinks]);

// 2. Keep the existing useMemo for filteredResults as it is
    const filteredResults = React.useMemo(() => {
        let result = [...possibleDrinks];

        // Filter logic stays the same
        if (strengthValue !== null) {
            const strengthString = getStrengthFromValue(strengthValue);
            if (strengthString) {
                result = result.filter(drink => drink.tags.strength === strengthString);
            }
        }

        if (selectedTastes.length > 0) {
            const filterTastes = getFilterableTastes(selectedTastes);
            result = result.filter(drink =>
                drink.tags.taste.some(taste =>
                    filterTastes.some(filterTaste =>
                        filterTaste.toLowerCase() === taste.toLowerCase()
                    )
                )
            );
        }

        if (canMakeOnly) {
            result = result.filter(drink => drink.tags.canMake);
        }

        return result;
    }, [selectedTastes, strengthValue, canMakeOnly, possibleDrinks]);

// 3. Then update your useEffect to avoid the infinite loop
    useEffect(() => {
        // Only update filtered drinks when filteredResults changes
        setFilteredDrinks(filteredResults);
        setPage(1);
    }, [filteredResults]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <PageHeader
                title="Drinks"
                subtitle="Discover and create delicious cocktails."
                imageSrc={drinksImage}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 2, mb: 3 }}>
                {/* Filters in one line */}
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{xs:12, md:3, lg:2}}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FilterIcon sx={{ mr: 1 }} color="primary" />
                            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                                Filters:
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Can Make Toggle Button */}
                    <Grid size={{xs:6, md:3, lg:2}}>
                        <ToggleButton
                            value="check"
                            selected={canMakeOnly}
                            onChange={handleCanMakeToggle}
                            color="primary"
                            fullWidth
                            size="small"
                            sx={{
                                height: '40px',
                                '&.Mui-selected': {
                                    backgroundColor: '#E5F6E8',
                                    color: '#388E3C',
                                    fontWeight: 'bold',
                                    borderColor: '#388E3C'
                                }
                            }}
                        >
                            <CanMakeIcon sx={{ mr: 1 }} />
                            Can Make ({canMakeCount})
                        </ToggleButton>
                    </Grid>
                    {/* Allow Substitutions Switch - Add this new component */}
                    <Grid size={{xs:6, md:3, lg:2}}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={allowSubstitutions}
                                    onChange={toggleAllowSubstitutions}
                                    color="success"
                                    size="small"
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    Allow Substitutions
                                </Typography>
                            }
                        />
                    </Grid>
                    {/* Strength Selection */}
                    <Grid size={{xs:6, md:3, lg:2}}>
                        <Box sx={{ px: 1 }}>
                            <Typography variant="caption" display="block" gutterBottom>
                                Strength: {strengthValue ? getStrengthFromValue(strengthValue) : 'Any'}
                            </Typography>
                            <StrengthSlider
                                size="small"
                                aria-label="Drink Strength"
                                defaultValue={0}
                                value={strengthValue === null ? 0 : strengthValue}
                                step={1}
                                min={0}
                                max={3}
                                marks
                                onChange={handleStrengthChange}
                            />
                        </Box>
                    </Grid>

                    {/* Taste Selection */}
                    <Grid size={{xs:9, md:2, lg:2}}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="taste-label">Taste Category</InputLabel>
                            <Select
                                labelId="taste-label"
                                multiple
                                value={selectedTastes}
                                onChange={handleTasteChange}
                                input={<OutlinedInput label="Taste Category" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {(selected as string[]).map((value) => {
                                            const category = TASTE_CATEGORIES.find(c => c.name === value);
                                            return (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size="small"
                                                    sx={{ bgcolor: category?.color, color: '#000' }}
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {allTasteTags.map((category) => {
                                    const categoryObj = TASTE_CATEGORIES.find(c => c.name === category);
                                    return (
                                        <MenuItem key={category} value={category} sx={{ bgcolor: 'transparent' }}>
                                            <Checkbox checked={selectedTastes.indexOf(category) > -1} />
                                            <ListItemText
                                                primary={category}
                                                secondary={categoryObj?.tastes.slice(0, 3).join(", ") + (categoryObj && categoryObj.tastes.length > 3 ? "..." : "")}
                                            />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Clear Filters Button */}
                    <Grid size={{xs:3, md:1, lg:2}} sx={{ textAlign: 'right' }}>
                        {hasActiveFilters && (
                            <Button
                                startIcon={<ClearIcon />}
                                onClick={handleResetFilters}
                                size="small"
                                color="secondary"
                            >
                                Clear
                            </Button>
                        )}
                    </Grid>
                </Grid>

                {/* Active taste filter chips */}
                {selectedTastes.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                        {selectedTastes.map(taste => (
                            <Chip
                                key={taste}
                                label={taste}
                                onDelete={() => handleDeleteTaste(taste)}
                                color="secondary"
                                variant="outlined"
                                size="small"
                            />
                        ))}
                    </Box>
                )}
            </Paper>

            {/* Results Count and Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                    Showing {paginatedDrinks.length} of {displayDrinks.length} drinks
                </Typography>

                {totalPages > 1 && (
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="medium"
                    />
                )}
            </Box>

            {/* Drink List */}
            <DrinkList
                drinks={paginatedDrinks}
                ingredients={ingredients}
                isLoading={isLoading}
            />


        </Container>
    );
};

export default Drinks;