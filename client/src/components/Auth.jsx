import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import elderlyCareImage from '../img/Elderly Care.png'

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); 
  
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-blue-200 font-sans">
      
      
      <div className="flex justify-center items-center max-w-2.5 w-full">
        <div className='flex flex-col items-center justify-center '> 
        <img src={elderlyCareImage} alt="elderlycare"  />
        {isLogin ? (
          <LoginForm onLogin={onLogin} setIsLogin={setIsLogin} navigate={navigate}/>
        ) : (
          <SignUpForm setIsLogin={setIsLogin}/>
        )}
      </div>
    </div>
  </div>
  );
}

export default Auth;
