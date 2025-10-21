import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { supabase } from '../../lib/supabase';

const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // Check if user has valid recovery token
  useEffect(() => {
    const checkRecoveryToken = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Check if this is a recovery token (type=recovery in URL)
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        
        if (type === 'recovery' || session) {
          setHasValidToken(true);
        } else {
          toast.error('Invalid or expired recovery link');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        toast.error('Invalid recovery link');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkRecoveryToken();
  }, [navigate]);

  const validatePasswords = () => {
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('Password reset error:', error);
        toast.error('Failed to reset password');
        return;
      }

      toast.success('Password reset successfully!');
      setIsSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred while resetting your password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Verifying recovery link...</p>
        </div>
      </div>
    );
  }

  if (!hasValidToken) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">Invalid or expired recovery link</p>
          <p className="text-slate-400 text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto relative px-4 sm:px-0">
          <div className="pointer-events-none absolute -inset-2 sm:-inset-x-6 sm:-inset-x-10 -top-4 sm:-top-6 sm:-top-10 -bottom-4 sm:-bottom-6 sm:-bottom-10 opacity-40">
            <div className="absolute -top-2 sm:-top-4 sm:-top-6 -left-2 sm:-left-6 sm:-left-8 w-32 sm:w-48 sm:w-64 h-32 sm:h-48 sm:h-64 bg-vertex-blue-600/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 -right-2 sm:-right-6 sm:-right-10 w-36 sm:w-56 sm:w-72 h-36 sm:h-56 sm:h-72 bg-vertex-blue-700/20 blur-3xl rounded-full" />
          </div>

          <div className="relative bg-deep-black border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 sm:p-8 md:p-10">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
              </div>
              
              <h2 className="text-lg sm:text-xl sm:text-2xl font-semibold text-slate-200">Password Reset Successful!</h2>
              
              <p className="text-slate-400 text-sm sm:text-base">
                Your password has been updated. You can now log in with your new password.
              </p>

              <p className="text-xs text-slate-500 pt-2">
                Redirecting to login page...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto relative px-4 sm:px-0">
        {/* Abstract blue background accents */}
        <div className="pointer-events-none absolute -inset-2 sm:-inset-x-6 sm:-inset-x-10 -top-4 sm:-top-6 sm:-top-10 -bottom-4 sm:-bottom-6 sm:-bottom-10 opacity-40">
          <div className="absolute -top-2 sm:-top-4 sm:-top-6 -left-2 sm:-left-6 sm:-left-8 w-32 sm:w-48 sm:w-64 h-32 sm:h-48 sm:h-64 bg-vertex-blue-600/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 -right-2 sm:-right-6 sm:-right-10 w-36 sm:w-56 sm:w-72 h-36 sm:h-56 sm:h-72 bg-vertex-blue-700/20 blur-3xl rounded-full" />
        </div>

        <div className="relative bg-deep-black border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <img
                src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/405b6af4-fc2b-4340-a894-ac812f27e041-bull-svgrepo-com%20(1).png"
                alt="BullionFX Logo"
                className="h-12 w-12 sm:h-16 sm:w-16 object-contain drop-shadow-md mx-auto"
                style={{ background: 'transparent' }}
              />
            </div>
            <h2 className="text-lg sm:text-xl sm:text-2xl font-semibold text-slate-200">Create New Password</h2>
            <p className="text-slate-400 text-sm mt-2">Enter your new password below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">New Password</label>
              <div className="relative">
                <Input
                  icon={Lock}
                  placeholder="Enter new password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Minimum 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">Confirm Password</label>
              <div className="relative">
                <Input
                  icon={Lock}
                  placeholder="Confirm new password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 md:py-4 text-sm sm:text-base font-medium"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          {/* Back to Login */}
          <button
            onClick={() => navigate('/login')}
            className="mt-4 w-full text-center text-slate-400 hover:text-slate-300 text-sm transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
