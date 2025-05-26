import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import elderlyCareImage from '../img/Elderly Care.png';

const Auth = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex justify-center items-center h-screen w-screen font-sans">
      <div className="flex justify-center items-center max-w-2.5 w-full">
        <div className='flex flex-col items-center justify-center'>
          <img src={elderlyCareImage} alt="elderlycare" />
          {isLogin ? (
            <LoginForm 
              onLogin={(userData) => {
                // Store user data in localStorage
                localStorage.setItem('userToken', userData.token);
                localStorage.setItem('userInfo', JSON.stringify(userData.user));
                localStorage.setItem('userRole', userData.user.role); // Store the role separately
                onLogin();
                navigate('/home');
              }} 
              setIsLogin={setIsLogin} 
              navigate={navigate}
            />
          ) : (
            <SignUpForm setIsLogin={setIsLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
