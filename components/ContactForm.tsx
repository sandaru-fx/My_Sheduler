import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Mail, User, MessageSquare, Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface ContactFormProps {
  onSubmitSuccess?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmitSuccess }) => {
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Validation states
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  // Validate message (10-1000 characters)
  const validateMessage = (message: string): boolean => {
    if (message.trim().length < 10) {
      setMessageError('Message must be at least 10 characters');
      return false;
    } else if (message.trim().length > 1000) {
      setMessageError('Message cannot exceed 1000 characters');
      return false;
    } else {
      setMessageError(null);
      return true;
    }
  };

  // Check form validity when inputs change
  useEffect(() => {
    const isNameValid = name.trim() !== '' && !nameError;
    const isEmailValid = email.trim() !== '' && !emailError;
    const isMessageValid = message.trim() !== '' && !messageError;
    
    setIsFormValid(isNameValid && isEmailValid && isMessageValid);
  }, [name, email, message, nameError, emailError, messageError]);

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

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    if (value.trim() !== '') {
      validateMessage(value);
    } else {
      setMessageError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Validate all fields before submission
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isMessageValid = validateMessage(message);
    
    if (!isNameValid || !isEmailValid || !isMessageValid) {
      setSubmitError('Please fix all validation errors before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
      
      {submitSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            <p className="text-green-400 text-sm">Message sent successfully! We'll get back to you soon.</p>
          </div>
        </div>
      )}
      
      {submitError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" />
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-500" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              onBlur={() => name && validateName(name)}
              className={`block w-full pl-10 pr-3 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 ${
                nameError ? 'border-red-500' : name && !nameError ? 'border-green-500' : 'border-white/10'
              }`}
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
              required
              value={email}
              onChange={handleEmailChange}
              onBlur={() => email && validateEmail(email)}
              className={`block w-full pl-10 pr-3 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 ${
                emailError ? 'border-red-500' : email && !emailError ? 'border-green-500' : 'border-white/10'
              }`}
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

        {/* Message Field */}
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-300">
            Message
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MessageSquare size={18} className="text-gray-500" />
            </div>
            <textarea
              id="message"
              name="message"
              required
              value={message}
              onChange={handleMessageChange}
              onBlur={() => message && validateMessage(message)}
              rows={5}
              className={`block w-full pl-10 pr-3 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none ${
                messageError ? 'border-red-500' : message && !messageError ? 'border-green-500' : 'border-white/10'
              }`}
              placeholder="How can we help you?"
            />
          </div>
          {messageError && (
            <p className="text-red-400 text-xs mt-1">{messageError}</p>
          )}
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">{message.length}/1000 characters</p>
            {message.length > 0 && (
              <p className={`text-xs ${message.length < 10 ? 'text-red-400' : 'text-green-400'}`}>
                {message.length < 10 ? `${10 - message.length} more characters needed` : 'Minimum length met'}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className={`w-full py-3 text-white font-bold rounded-lg flex items-center justify-center ${
            isFormValid
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
              : 'bg-gray-700 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send size={18} className="ml-2" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
