import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = ({ onLogin }) => {
    const navigate = useNavigate()

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
