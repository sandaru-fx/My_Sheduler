import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
// No router needed

interface SignInProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onNavigateToSignUp: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Validation states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? null : 'Please enter a valid email address');
    return isValid;
  };

  // Validate password
  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6;
    setPasswordError(isValid ? null : 'Password must be at least 6 characters');
    return isValid;
  };

  // Check form validity when inputs change
  useEffect(() => {
    const isEmailValid = email.trim() !== '' && !emailError;
    const isPasswordValid = password.trim() !== '' && !passwordError;
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password, emailError, passwordError]);

  // Handle input changes with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.trim() !== '') {
      validateEmail(value);
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value.trim() !== '') {
      validatePassword(value);
    } else {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate all fields before submission
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return; // Stop form submission if validation fails
    }
    
    setIsLoading(true);
    
    try {
      await onSignIn(email, password);
      // Success is handled by the parent component
    } catch (err: any) {
      // Handle specific MongoDB/backend errors
      if (err.message.includes('Invalid email or password')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message.includes('User not found')) {
        setError('No account found with this email. Please sign up first.');
      } else {
        setError(err.message || 'Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 mb-4">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">WELCOME BACK</h1>
          <p className="text-gray-400 mt-2">Sign in to continue to TimeFlow</p>
        </div>

        {/* Form */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mb-6">
            <p className="text-indigo-400 text-sm">Demo credentials: <span className="font-mono">demo@example.com / password</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => email && validateEmail(email)}
                  className={`block w-full pl-10 pr-3 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 ${emailError ? 'border-red-500' : email && !emailError ? 'border-green-500' : 'border-white/10'}`}
                  placeholder="you@example.com"
                />
                {email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {emailError ? (
                      <AlertCircle size={18} className="text-red-500" />
                    ) : (
                      <CheckCircle size={18} className="text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {emailError && (
                <p className="text-red-400 text-xs mt-1">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => password && validatePassword(password)}
                  className={`block w-full pl-10 pr-10 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 ${passwordError ? 'border-red-500' : password && !passwordError ? 'border-green-500' : 'border-white/10'}`}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-400 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full py-3 text-white font-bold rounded-lg flex items-center justify-center ${isFormValid ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500' : 'bg-gray-700 cursor-not-allowed'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onNavigateToSignUp}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} TimeFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
