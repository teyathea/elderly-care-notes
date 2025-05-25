import { useState } from "react";
import axios from "axios";

export default function LoginForm({onLogin, setIsLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // First try admin login
            try {
                const adminResponse = await axios.post('http://localhost:8000/api/mainusers/login', {
                    email,
                    password,
                });
                
                if (adminResponse.data) {
                    // Store user data in localStorage
                    localStorage.setItem('userToken', adminResponse.data.token);
                    localStorage.setItem('userInfo', JSON.stringify(adminResponse.data.user));
                    localStorage.setItem('userRole', adminResponse.data.user.role);
                    
                    // For admin users, set contributor and view-only flags
                    if (adminResponse.data.user.role === 'admin') {
                        localStorage.setItem('isContributor', 'true');
                        localStorage.setItem('isViewOnly', 'false');
                    }
                    
                    onLogin(adminResponse.data);
                    return;
                }
            } catch (adminError) {
                // If admin login fails, try family/caregiver login
                if (adminError.response?.status === 400) {
                    const contactResponse = await axios.post('http://localhost:8000/api/contactusers/login', {
                        email,
                        password,
                    });

                    if (contactResponse.data) {
                        // Store user data in localStorage
                        localStorage.setItem('userToken', contactResponse.data.token);
                        localStorage.setItem('userInfo', JSON.stringify(contactResponse.data.user));
                        localStorage.setItem('userRole', contactResponse.data.user.role);
                        
                        // Set appropriate permissions for family/caregiver
                        if (contactResponse.data.user.role === 'family' || contactResponse.data.user.role === 'caregiver') {
                            localStorage.setItem('isContributor', contactResponse.data.user.isContributor || 'false');
                            localStorage.setItem('isViewOnly', contactResponse.data.user.isViewOnly || 'true');
                        }
                        
                        onLogin(contactResponse.data);
                        return;
                    }
                }
                throw adminError;
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <form onSubmit={handleLogin} className='flex flex-col justify-center border-2 border-white rounded-xl p-8 w-150 h-110 bg-blue-800/80 backdrop-blur-md shadow-lg'>
            <h2 className="text-xl font-bold mb-4 text-center text-white">Login</h2>
            <h3 className="mb-4 text-white text-center">Welcome to Elderly Care ❤️</h3>
            {error && (
                <div className="mb-4 text-red-400 text-center">
                    {error}
                </div>
            )}
            <div className="mb-4">
                <label className="block text-white mb-1" htmlFor="loginEmail">Email</label>
                <input
                    type="email"
                    id="loginEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Email"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-white mb-1" htmlFor="loginPassword">Password</label>
                <input
                    type="password"
                    id="loginPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Password"
                    required
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                Login
            </button>
            <div className="mt-4 text-sm text-white text-center">
                Don't have an account?{' '}
                <span
                    className="text-blue-300 underline cursor-pointer"
                    onClick={() => setIsLogin(false)}
                >
                    Sign Up
                </span>
            </div>
        </form>
    );
}