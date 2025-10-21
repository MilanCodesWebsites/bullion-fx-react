import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { supabase } from '../../lib/supabase';

const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required')
});

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Password reset error:', error);
        toast.error('Failed to send reset email');
      } else {
        toast.success('Password reset email sent! Check your inbox.');
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-lg mx-auto relative px-4 sm:px-0">
        {/* Abstract blue background accents */}
        <div className="pointer-events-none absolute -inset-2 sm:-inset-x-6 sm:-inset-x-10 -top-4 sm:-top-6 sm:-top-10 -bottom-4 sm:-bottom-6 sm:-bottom-10 opacity-40">
          <div className="absolute -top-2 sm:-top-4 sm:-top-6 -left-2 sm:-left-6 sm:-left-8 w-32 sm:w-48 sm:w-64 h-32 sm:h-48 sm:h-64 bg-vertex-blue-600/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 -right-2 sm:-right-6 sm:-right-10 w-36 sm:w-56 sm:w-72 h-36 sm:h-56 sm:h-72 bg-vertex-blue-700/20 blur-3xl rounded-full" />
        </div>

        <div className="relative bg-deep-black border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 sm:p-8 md:p-10">
          {/* Success Message */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-lg sm:text-xl sm:text-2xl font-semibold text-slate-200">Check your email</h2>
            
            <p className="text-slate-400 text-sm sm:text-base">
              We've sent a password reset link to your email address. Follow the link to create a new password.
            </p>

            <p className="text-xs text-slate-500 pt-2">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={onBackToLogin}
            className="mt-6 sm:mt-8 w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto relative px-4 sm:px-0">
      {/* Abstract blue background accents - mobile responsive */}
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
          <h2 className="text-lg sm:text-xl sm:text-2xl font-semibold text-slate-200">Reset Your Password</h2>
          <p className="text-slate-400 text-sm mt-2">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">Email Address</label>
            <Input
              icon={Mail}
              placeholder="Enter your email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        {/* Back Link */}
        <button
          onClick={onBackToLogin}
          className="mt-4 w-full text-center text-slate-400 hover:text-slate-300 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
