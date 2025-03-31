import { Box, Typography, Button, Paper, Container } from '@mui/material';

const CallToAction = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
      <Container maxWidth="xl">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            Ready to Transform Your HR Processes?
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Join thousands of businesses that trust our HR management solution.
          </Typography>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              href="/register"
            >
              Start Your Free Trial
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CallToAction;