// FinanceDashboard.js
import React, { useEffect } from 'react';
import { Container, Typography, Box, AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FinanceDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ROLE_FINANCE') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Finance Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome Finance Team
        </Typography>
        <Box sx={{ p: 3, boxShadow: 1, borderRadius: 2 }}>
          <Typography>This is your dashboard where you can manage financial data.</Typography>
        </Box>
      </Container>
    </>
  );
};

export default FinanceDashboard;