import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            if (res.data.success) {
                localStorage.setItem('isAdmin', 'true');
                navigate('/admin');
            }
        } catch (err) {
            if (err.response) {
                // The server responded with an error (e.g. 401 Invalid Credentials)
                setError(err.response.data.message || 'Invalid credentials. Try again.');
            } else {
                // The server is unreachable or offline
                setError('Cannot connect to the wellness server. Please ensure the backend is running on port 5000.');
            }
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[#fdfaf5]">
            <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#1b4332] mb-2 tracking-tighter">Admin Access</h2>
                    <p className="text-gray-400 text-sm italic">Enter your credentials to manage appointments.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-[#d4af37] block mb-2">Username</label>
                        <input 
                            type="text" 
                            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-[#d4af37] transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-[#d4af37] block mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-[#d4af37] transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
                    
                    <button type="submit" className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#d4af37] transition-all">
                        Login
                    </button>
                </form>
                
                <p className="text-center mt-8 text-xs text-gray-400">
                    Secure Dashboard &copy; 2026 Aura Wellness
                </p>
            </div>
        </div>
    );
};

export default Login;
