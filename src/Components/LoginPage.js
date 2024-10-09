import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from './AuthService';
import { useNavigate } from 'react-router-dom';

const LoginPage = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 3; // Password must be at least 6 characters
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let isValid = true;

        // Clear previous errors
        setEmailError('');
        setPasswordError('');
        setError('');
        // Validate email
        if (!validateEmail(email)) {
            setEmailError('Invalid email format.');
            isValid = false;
        }
        // Validate password
        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 4 characters.');
            isValid = false;
        }
        if (!isValid) {
            return; // Stop the form submission if validation fails
        }
        try {
            //const response = await axios.post(`http://localhost:5107/api/Login?emailId=${email}&password=${password}`);
            const response = await axios.post(`http://172.17.31.61:5107/api/Login?emailId=${email}&password=${password}`);
            if (response.status === 200) {
                localStorage.setItem('oauth2', response.data.token);
                localStorage.setItem('userRole', response.data.role);

                // Now you can retrieve the role
                const userRole = response.data.role;
                console.log('User role:', userRole);

                navigate('/home');
            }
        } catch (err) {
            setError('Invalid Email or password.');
            console.error('Login error:', err);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    mb: 4,
                }}
            >
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="username"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={Boolean(emailError)}
                        helperText={emailError}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={Boolean(passwordError)}
                        helperText={passwordError}
                    />
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
