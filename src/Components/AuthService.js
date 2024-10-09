// import axios from 'axios';
// import jwtDecode from 'jwt-decode';

// const API_URL = 'http://localhost:5107/api/Login';

// const login = async (username, password) => {
//     const response = await axios.post(`${API_URL}`, { username, password });
//     if (response.data.token) {
//         localStorage.setItem('user', JSON.stringify(response.data));
//     }
//     return response.data;
// };

// const logout = () => {
//     localStorage.removeItem('user');
// };

// const getCurrentUser = () => {
//     return JSON.parse(localStorage.getItem('user'));
// };

// const AuthService = {
//     login,
//     logout,
//     getCurrentUser,
// };

// export default AuthService;

// src/axiosConfig.js
import axios from 'axios';

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('oauth2');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axios;
