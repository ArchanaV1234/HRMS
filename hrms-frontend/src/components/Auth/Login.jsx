import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', {
                username,
                password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            // Store the user/employee id in localStorage
            localStorage.setItem('id', response.data.id);

            console.log(response);
            switch (response.data.role) {
                case 'ROLE_HR':
                    navigate('/hr-dashboard');
                    break;
                case 'ROLE_EMPLOYEE':
                    navigate('/employee-dashboard');
                    break;
                case 'ROLE_RECRUITERS':
                    navigate('/recruiter-dashboard');
                    break;
                case 'ROLE_FINANCE':
                    navigate('/finance-dashboard');
                    break;
                default:
                    navigate('/');
            }
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Box p={4} boxShadow={3} borderRadius={2} bgcolor="background.paper">
                <Typography variant="h4" gutterBottom>Login</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '1rem' }}
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
