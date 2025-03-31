import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Paper,
  CircularProgress,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  maxWidth: 500,
  margin: '0 auto'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  fontWeight: 600
}));

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: ''
    });
    const [errors, setErrors] = useState({
        username: false,
        password: false,
        role: false
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const roles = [
        { value: 'EMPLOYEE', label: 'Employee' },
        { value: 'HR', label: 'HR Manager' },
        { value: 'RECRUITERS', label: 'Recruiter' },
        { value: 'FINANCE', label: 'Finance' }
    ];

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            username: false,
            password: false,
            role: false
        };

        if (formData.username.length < 4) {
            newErrors.username = true;
            valid = false;
        }

        if (formData.password.length < 6) {
            newErrors.password = true;
            valid = false;
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(formData.password)) {
            newErrors.password = true;
            valid = false;
        }

        if (!formData.role) {
            newErrors.role = true;
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setErrorMessage('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8081/api/auth/register', {
                username: formData.username,
                password: formData.password,
                role: formData.role
            });
            
            setSuccessMessage('Registration successful! Redirecting to login...');
            setErrorMessage('');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'Registration failed. Please try again.');
            } else {
                setErrorMessage('Registration failed. Please try again.');
            }
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ 
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            justifyContent: 'center',
            py: 4
        }}>
            <StyledPaper>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom 
                    align="center" 
                    sx={{ 
                        fontWeight: 700,
                        mb: 4,
                        color: 'primary.main'
                    }}
                >
                    Create Account
                </Typography>
                
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {successMessage}
                    </Alert>
                )}
                
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {errorMessage}
                    </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                        helperText={errors.username ? "Username must be at least 4 characters" : ""}
                        required
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        helperText={errors.password ? "Must be 6+ characters with uppercase, lowercase, and number" : ""}
                        required
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    
                    <FormControl fullWidth error={errors.role} size="small" sx={{ mb: 3 }}>
                        <InputLabel id="role-label">Role *</InputLabel>
                        <Select
                            labelId="role-label"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            label="Role *"
                            required
                        >
                            <MenuItem value=""><em>Select a role</em></MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role.value} value={role.value}>
                                    {role.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.role && (
                            <Typography variant="caption" color="error" sx={{ ml: 1.5 }}>
                                Please select a role
                            </Typography>
                        )}
                    </FormControl>
                    
                    <StyledButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </StyledButton>
                    
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Link 
                                component="button" 
                                variant="body2"
                                onClick={() => navigate('/login')}
                                sx={{ fontWeight: 600 }}
                            >
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </StyledPaper>
        </Container>
    );
};

export default Register;