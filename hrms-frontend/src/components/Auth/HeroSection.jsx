import { Box, Typography, Button, Grid, Container } from '@mui/material';
import logo1 from "./image1.jpeg"
const HeroSection = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              component="h1"
              variant="h2"
              align="left"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Modern HR Management Solution
            </Typography>
            <Typography variant="h5" align="left" color="text.secondary" paragraph>
              Streamline your human resources processes with our powerful, intuitive platform.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                href="/register"
                sx={{ mr: 2 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="/login"
              >
                Login
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src={logo1}
              alt="HR Dashboard Preview"
              style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;