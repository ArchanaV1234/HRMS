import { Box, Typography, Grid, Link, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: 6, boxShadow: 3, mt: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3} textAlign="center">
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
              HR Management Pro
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The complete solution for modern human resources management.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} textAlign="center">
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Product
            </Typography>
            {['Features', 'Pricing', 'API'].map((item) => (
              <Link href="#" color="inherit" display="block" key={item} sx={{ mb: 0.5 }}>
                {item}
              </Link>
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={3} textAlign="center">
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Company
            </Typography>
            {['About', 'Blog', 'Careers'].map((item) => (
              <Link href="#" color="inherit" display="block" key={item} sx={{ mb: 0.5 }}>
                {item}
              </Link>
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={3} textAlign="center">
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Legal
            </Typography>
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <Link href="#" color="inherit" display="block" key={item} sx={{ mb: 0.5 }}>
                {item}
              </Link>
            ))}
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid #e0e0e0', mt: 4, pt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} HR Management Pro. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
