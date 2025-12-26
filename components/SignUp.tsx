import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SignUpProps {
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onNavigateToSignIn: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onNavigateToSignIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Validation states
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isPasswordStrong = hasMinLength && hasUppercase && hasNumber && hasSpecialChar;
  const doPasswordsMatch = password === confirmPassword && confirmPassword !== '';

  // Validate name (2-50 characters)
  const validateName = (name: string): boolean => {
    const isValid = name.trim().length >= 2 && name.trim().length <= 50;
    setNameError(isValid ? null : 'Name must be between 2 and 50 characters');
    return isValid;
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? null : 'Please enter a valid email address');
    return isValid;
  };
  
  // Check form validity when inputs change
  useEffect(() => {
    const isNameValid = name.trim() !== '' && !nameError;
    const isEmailValid = email.trim() !== '' && !emailError;
    const isPasswordValid = isPasswordStrong;
    const isConfirmPasswordValid = doPasswordsMatch;
    
    setIsFormValid(
      isNameValid && 
      isEmailValid && 
      isPasswordValid && 
      isConfirmPasswordValid && 
      termsAccepted
    );
  }, [name, email, password, confirmPassword, nameError, emailError, isPasswordStrong, doPasswordsMatch, termsAccepted]);

  // Handle input changes with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.trim() !== '') {
      validateName(value);
    } else {
      setNameError(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.trim() !== '') {
      validateEmail(value);
    } else {
      setEmailError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate all fields before submission
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    
    if (!isNameValid || !isEmailValid || !isPasswordStrong || !doPasswordsMatch || !termsAccepted) {
      setError('Please fix all validation errors before submitting.');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      await onSignUp(name, email, password);
      // Success is handled by the parent component
    } catch (err: any) {
      // Handle specific MongoDB/backend errors
      if (err.message.includes('User already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.message.includes('validation failed')) {
        setError('Please check your information and try again.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
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
          <h1 className="text-3xl font-black tracking-tighter text-white">CREATE ACCOUNT</h1>
          <p className="text-gray-400 mt-2">Join TimeFlow and boost your productivity</p>
        </div>

        {/* Form */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() => name && validateName(name)}
                  className={`block w-full pl-10 pr-3 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 ${nameError ? 'border-red-500' : name && !nameError ? 'border-green-500' : 'border-white/10'}`}
                  placeholder="John Doe"
                />
                {name && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {nameError ? (
                      <AlertCircle size={18} className="text-red-500" />
                    ) : (
                      <CheckCircle size={18} className="text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {nameError && (
                <p className="text-red-400 text-xs mt-1">{nameError}</p>
              )}
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
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
              
              {/* Password strength meter */}
              <div className="mt-4 space-y-4">
                {/* Strength bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Password strength:</span>
                    <span className={`text-xs font-semibold ${password.length === 0 ? 'text-gray-500' : 
                      isPasswordStrong ? 'text-green-500' : 
                      (hasMinLength && (hasUppercase || hasNumber)) ? 'text-yellow-500' : 
                      password.length > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                      {password.length === 0 ? 'None' : 
                       isPasswordStrong ? 'Strong' : 
                       (hasMinLength && (hasUppercase || hasNumber)) ? 'Medium' : 
                       'Weak'}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${password.length === 0 ? 'w-0' : 
                        isPasswordStrong ? 'w-full bg-green-500' : 
                        (hasMinLength && hasUppercase && hasNumber) ? 'w-4/5 bg-green-500' : 
                        (hasMinLength && (hasUppercase || hasNumber)) ? 'w-3/5 bg-yellow-500' : 
                        (hasMinLength) ? 'w-2/5 bg-orange-500' : 
                        'w-1/5 bg-red-500'}`}
                    ></div>
                  </div>
                </div>
                
                {/* Requirements checklist */}
                <div className="space-y-2 bg-slate-800/30 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-400 mb-2">Password requirements:</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasMinLength ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-500'}`}>
                      {hasMinLength ? <CheckCircle size={12} /> : ''}
                    </div>
                    <span className={`text-xs ${hasMinLength ? 'text-green-500' : 'text-gray-500'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasUppercase ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-500'}`}>
                      {hasUppercase ? <CheckCircle size={12} /> : ''}
                    </div>
                    <span className={`text-xs ${hasUppercase ? 'text-green-500' : 'text-gray-500'}`}>
                      At least one uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasNumber ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-500'}`}>
                      {hasNumber ? <CheckCircle size={12} /> : ''}
                    </div>
                    <span className={`text-xs ${hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                      At least one number
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasSpecialChar ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-500'}`}>
                      {hasSpecialChar ? <CheckCircle size={12} /> : ''}
                    </div>
                    <span className={`text-xs ${hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                      At least one special character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 ${
                    confirmPassword && (doPasswordsMatch ? 'border-green-500/50' : 'border-red-500/50')
                  }`}
                  placeholder="••••••••"
                />
                {confirmPassword && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {doPasswordsMatch ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <div className="text-red-500">✕</div>
                    )}
                  </div>
                )}
              </div>
              {confirmPassword && !doPasswordsMatch && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="terms" className="text-xs text-gray-400">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-400 hover:text-indigo-300">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-400 hover:text-indigo-300">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !isPasswordStrong || !doPasswordsMatch}
              className={`w-full py-3 text-white font-bold rounded-lg flex items-center justify-center ${
                isPasswordStrong && doPasswordsMatch
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={onNavigateToSignIn}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Sign in
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

export default SignUp;
