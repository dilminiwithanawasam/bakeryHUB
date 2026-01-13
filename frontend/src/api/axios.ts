import axios from 'axios';

// 1. Create the Axios instance
const api = axios.create({
    // Ensure this matches your Backend Port (3000 based on your error log)
    baseURL: 'http://localhost:3000/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Add the Interceptor (The "Key" Attacher)
api.interceptors.request.use(
    (config) => {
        // Retrieve the token from Local Storage (saved during Login)
        const token = localStorage.getItem('token'); 
        
        if (token) {
            // Attach token to the Authorization header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;