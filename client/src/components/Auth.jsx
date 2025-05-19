import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = ({ onLogin }) => {
  const navigate = useNavigate();

  // const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fullname, setFullname] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/mainusers/login', {
        email,
        password,
      });
      const token = response.data.token;
      console.log('Login successfully:', response.data);
      localStorage.setItem('userToken', token)
      console.log(JSON.parse(atob(token.split('.')[1])));
      onLogin();
      navigate('/home');
    } catch (error) {
      console.error('Login error', error.response?.data || error.message);
    }
  };

  const handleSignup = async () => {
    if (signupPassword !== confirmPassword) {
      alert("Password don't match!");
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
      console.error('Signup error:', error.response?.data || error.message);
    }
  };

    const [isLogin, setIsLogin] = useState(true); 
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-blue-200 font-sans">
      <div className="flex justify-center items-center max-w-4xl w-full">
        {isLogin ? (
          <LoginForm onLogin={onLogin} setIsLogin={setIsLogin} navigate={navigate}/>
        ) : (
          <SignUpForm setIsLogin={setIsLogin}/>
        )}
      </div>
    </div>
  );
}

export default Auth;
