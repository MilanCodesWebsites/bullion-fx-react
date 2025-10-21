import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import Button from '../UI/Button';
import Input from '../UI/Input';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message || 'Failed to send reset email');
      } else {
        setIsSubmitted(true);
        toast.success('Password reset email sent!');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-vertex-blue hover:text-vertex-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <div className="bg-deep-black border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img
              src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/405b6af4-fc2b-4340-a894-ac812f27e041-bull-svgrepo-com%20(1).png"
              alt="BullionFX Logo"
              className="h-12 w-12 sm:h-16 sm:w-16 object-contain drop-shadow-md"
              style={{ background: 'transparent' }}
            />
          </div>

          {!isSubmitted ? (
            <>
              {/* Content */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-slate-400">Enter your email address and we'll send you a link to reset your password.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                  <Input
                    icon={Mail}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-base font-medium"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Check Your Email</h2>
                <p className="text-slate-400">
                  We've sent a password reset link to <span className="font-semibold text-white">{email}</span>
                </p>
                <p className="text-sm text-slate-500">The link will expire in 24 hours.</p>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    className="text-vertex-blue hover:text-vertex-blue-600 transition-colors text-sm font-medium"
                  >
                    Try another email
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
