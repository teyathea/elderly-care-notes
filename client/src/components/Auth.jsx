import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = ({ onLogin }) => {
    const navigate = useNavigate()

    const [isLogin, setIsLogin] = useState(true); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const [fullname, setFullname] = useState('')
    const [signupEmail, setSignupEmail] = useState('')
    const [signupPassword, setSignupPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('')

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/mainusers/login', {
                email,
                password,
            });
            console.log('Login successfully:', response.data)
            onLogin() // check if app was logged in.
            navigate('/home')
        } catch (error) {
            console.error('Login error', error.response?.data || error.message)
        }
    };

    const handleSignup = async () => {
        if (signupPassword !== confirmPassword) {
            alert("Password don't match!")
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/api/mainusers/register', {
                fullname,
                email: signupEmail,
                password: signupPassword,
                role,
            });
            console.log('Signup successful:', response.data);
            setIsLogin(true);
        } catch (error) {
            console.error('Signup error:', error.response?.data || error.message)
        }
    };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-blue-200 font-sans">
      <div className="flex justify-center items-center max-w-4xl w-full">
        {isLogin ? (
          // Login Form
          <div className="border-2 border-white rounded-xl p-8 w-150 h-110 bg-blue-800/80 backdrop-blur-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center text-white">Login Page</h2>
            <h3 className="mb-4 text-white text-center">Elderly Care ❤️</h3>
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
              <button
                className="text-blue-300 underline"
                onClick={() => setIsLogin(false)}
              >
                signup
              </button>
            </div>
            <button 
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded cursor-pointer">
              LOGIN
            </button>
          </div>
        ) : (
          // Signup Form
          <div className="border-2 border-white rounded-xl p-8 w-150 bg-blue-800/80 backdrop-blur-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center text-white">Signup Page</h2>
            <h3 className="mb-4 text-white text-center">Elderly Care ❤️</h3>
            <div className="mb-4">
              <label className="block text-white mb-1" htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full p-2 rounded bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Full Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-1" htmlFor="signupEmail">Email</label>
              <input
                type="email"
                id="signupEmail"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full p-2 rounded bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-1" htmlFor="signupPassword">Password</label>
              <input
                type="password"
                id="signupPassword"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full p-2 rounded bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-1" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 rounded bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Confirm Password"
              />
            </div>
            <div className='mb-4'>
                <label htmlFor="role" className='block text-white mb-1'>Role</label>
                <select 
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='w-full p-2 rounded bg-blue-600 text-white focus:ring-2 focus:ring-blue-400'
                >
                    <option value="">Select Role</option>
                    <option value="family">Family</option>
                    <option value="caregiver">Caregiver</option>
                </select>
            </div>
            <div className="mb-4 text-sm text-white text-center">
              Already have an account?{' '}
              <button
                className="text-blue-300 underline"
                onClick={() => setIsLogin(true)}
              >
                login
              </button>
            </div>
            <button 
            onClick={handleSignup}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
            >
              SIGNUP
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;
