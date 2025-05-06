import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
    TextField,
    Box,
    Typography,
    Divider,
    InputAdornment,
    useTheme,
    useMediaQuery,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Ingredient } from '../../models/Ingredient';

interface AddToShoppingListDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (selectedIds: string[]) => void;
    availableIngredients: Ingredient[];
}

const AddToShoppingListDialog: React.FC<AddToShoppingListDialogProps> = ({
                                                                             open,
                                                                             onClose,
                                                                             onAdd,
                                                                             availableIngredients
                                                                         }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selected, setSelected] = useState<string[]>([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Filter ingredients based on search query
    const filteredIngredients = availableIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleSelect = (id: string) => {
        setSelected(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(itemId => itemId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selected.length === filteredIngredients.length) {
            // If all are selected, deselect all
            setSelected([]);
        } else {
            // Otherwise select all filtered ingredients
            setSelected(filteredIngredients.map(ingredient => ingredient.id));
        }
    };

    const handleAdd = () => {
        onAdd(selected);
        setSelected([]);
        setSearchQuery('');
        onClose();
    };

    const handleClose = () => {
        setSelected([]);
        setSearchQuery('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    width: { sm: '500px', md: '600px' },
                    maxWidth: '100%',
                    maxHeight: isMobile ? '100%' : '90vh'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pr: 1
            }}>
                Add to Shopping List
                {isMobile && (
                    <IconButton edge="end" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Search ingredients"
                        type="search"
                        fullWidth
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {filteredIngredients.length > 0 ? (
                        <>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 2,
                                mb: 1,
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 1, sm: 0 }
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    {filteredIngredients.length} ingredient{filteredIngredients.length !== 1 ? 's' : ''} found
                                </Typography>
                                <Button
                                    size="small"
                                    onClick={handleSelectAll}
                                >
                                    {selected.length === filteredIngredients.length ? 'Deselect All' : 'Select All'}
                                </Button>
                            </Box>

                            <Divider />

                            <List sx={{
                                flexGrow: 1,
                                overflow: 'auto',
                                maxHeight: isMobile ? 'calc(100vh - 280px)' : '400px'
                            }}>
                                {filteredIngredients.map((ingredient) => (
                                    <ListItem
                                        key={ingredient.id}
                                        dense
                                        onClick={() => handleToggleSelect(ingredient.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            py: { xs: 1.5, sm: 0.5 } // Larger touch target on mobile
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={selected.includes(ingredient.id)}
                                                tabIndex={-1}
                                                disableRipple
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                        fontSize: { xs: 24, sm: 20 }
                                                    }
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={ingredient.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: { xs: '30vh', sm: '200px' }
                        }}>
                            <Typography variant="body1" color="text.secondary">
                                No ingredients found
                            </Typography>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                p: { xs: 2, sm: 1.5 },
                alignItems: 'stretch'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 }
                }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, sm: 0 } }}>
                        {selected.length} selected
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        width: { xs: '100%', sm: 'auto' },
                        flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                        <Button
                            onClick={handleClose}
                            fullWidth={isMobile}
                            variant={isMobile ? "outlined" : "text"}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAdd}
                            color="primary"
                            variant="contained"
                            disabled={selected.length === 0}
                            fullWidth={isMobile}
                            sx={{ mt: { xs: 1, sm: 0 } }}
                        >
                            Add to Shopping List
                        </Button>
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default AddToShoppingListDialog;