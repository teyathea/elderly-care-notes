import { useState } from "react";
import axios from "axios";
export default function LoginForm({onLogin, setIsLogin, navigate}) {

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const API_LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
    
    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_LOGIN_URL}`, {
                email,
                password,
            });
            console.log('Login successfully:', response.data)
            const token = response.data.token || response.data.accessToken;
            const user = response.data.user;

            if (token && user) { //keeps you logged in after refresh
              localStorage.setItem('userToken', token);
              localStorage.setItem('userInfo', JSON.stringify(response.data.user)); // store user info too
              localStorage.setItem('user', JSON.stringify(user))
              onLogin();
              navigate('/home');
            }
        } catch (error) {
            console.error('Login error', error.response?.data || error.message)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        handleLogin()
    }

    return(
        <>
      
        <form onSubmit={handleSubmit} className='flex flex-col justify-center border-2 border-white rounded-xl p-8 w-150 h-110 bg-blue-800/80 backdrop-blur-md shadow-lg'>
            {/* <h2 className="text-xl font-bold mb-4 text-center text-white">Login Page</h2> */}
            {/* <h3 className="mb-4 text-white text-center">Elderly Care ❤️</h3> */}
            <div className="mb-4">
              <label className="block text-white mb-1" htmlFor="loginEmail">Email</label>
              <input
                type="email"
                id="loginEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email"
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
              />
            </div>
            <div className="mb-4 text-sm text-white text-center">
              Don't have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }} className="text-blue-200 hover:underline cursor-pointer">
                Signup
                </a>
            </div>
            <button 
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded cursor-pointer">
              LOGIN
            </button>
          </form>
        </>
    )
}