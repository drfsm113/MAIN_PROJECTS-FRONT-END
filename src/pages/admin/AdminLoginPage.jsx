// AdminLoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Replace with actual authentication logic
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('authToken', 'your-token'); // Example token
            navigate('/admin/dashboard'); // Redirect to admin dashboard
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <form onSubmit={handleLogin}>
                <label className="block mb-2">
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </label>
                <label className="block mb-4">
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </label>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLoginPage;
