import { AppBar, Toolbar, Typography, Button, Box, IconButton, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from "./image.png"
const Navbar = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src={logo} 
                alt="HR Management Logo" 
                style={{ height: '40px', marginRight: '10px' }} 
              />
              HR Management
            </Box>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            HR Management
          </Typography>

          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            <Button 
              color="inherit" 
              href="/login" 
              sx={{ mx: 1, fontWeight: 600 }}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              href="/register" 
              sx={{ mx: 1, fontWeight: 600 }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;