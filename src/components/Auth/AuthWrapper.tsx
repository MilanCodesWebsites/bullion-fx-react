import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { useAuth } from '../../contexts/AuthContext';

const AuthWrapper: React.FC = () => {
  const [authState, setAuthState] = useState<'login' | 'register' | 'forgot-password'>('login');
  const { login, register } = useAuth();

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center p-4">
      {authState === 'login' && (
        <LoginForm 
          onLogin={login}
          onSwitchToRegister={() => setAuthState('register')}
          onSwitchToForgotPassword={() => setAuthState('forgot-password')}
        />
      )}
      {authState === 'register' && (
        <RegisterForm 
          onRegister={register}
          onSwitchToLogin={() => setAuthState('login')}
        />
      )}
      {authState === 'forgot-password' && (
        <ForgotPasswordForm
          onBackToLogin={() => setAuthState('login')}
        />
      )}
    </div>
  );
};

export default AuthWrapper;