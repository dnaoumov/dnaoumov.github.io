import React from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions
} from '@mui/material';
import {
    LocalBar as BarIcon,
    LocalDrink as DrinkIcon,
    ShoppingBasket as ShoppingIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import MyBarImage from '../media/my_bar.jpg'
import DrinkImage from '../media/drinks.jpg'
import ShoppingListImage from '../media/shopping_list.jpg'

const Home: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    mb: 4,
                    background: 'linear-gradient(45deg, #0F2A52 30%, #2D4773 90%)',
                    color: 'white'
                }}
            >
                <Typography component="h1" variant="h3" gutterBottom sx={{ color: '#FF7043' }}>
                    Welcome to CarGPTini
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                    Track your ingredients, discover new cocktails, and never run dry at your next auction event.
                </Typography>
            </Paper>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{xs:12,md:4}}>
                    <Card sx={{ height: '100%' }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={MyBarImage}
                            alt="My Bar"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                My Bar
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage your ingredient inventory
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                startIcon={<BarIcon />}
                                component={RouterLink}
                                to="/my-bar"
                            >
                                Manage Inventory
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid size={{xs:12,md:4}}>
                    <Card sx={{ height: '100%' }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={DrinkImage}
                            alt="Available Drinks"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Available Drinks
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Discover drinks you can make with your inventory
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                startIcon={<DrinkIcon />}
                                component={RouterLink}
                                to="/drinks"
                            >
                                View Drinks
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid size={{xs:12,md:4}}>
                    <Card sx={{ height: '100%' }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={ShoppingListImage}
                            alt="Shopping List"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Shopping List
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Plan your next shopping trip to expand your bar
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                startIcon={<ShoppingIcon />}
                                component={RouterLink}
                                to="/shopping-list"
                            >
                                View Shopping List
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary" align="center">
                    "The perfect blend of mixology and automotive enthusiasm"
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;