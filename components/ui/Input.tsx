import React, { ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  startIcon?: ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, startIcon, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between">
        {label && <label className={`text-xs font-semibold uppercase tracking-wider ${error ? 'text-red-400' : 'text-gray-400'}`}>{label}</label>}
      </div>
      <div className="relative">
        {startIcon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${error ? 'text-red-400' : 'text-gray-500'}`}>
            {startIcon}
          </div>
        )}
        <input
          className={`w-full bg-slate-800/50 border rounded-lg py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${startIcon ? 'pl-10 pr-4' : 'px-4'} ${className} 
          ${error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50 placeholder-red-300/30' 
            : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500'}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1 ml-1">{error}</p>}
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string, error?: string }> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className={`text-xs font-semibold uppercase tracking-wider ${error ? 'text-red-400' : 'text-gray-400'}`}>{label}</label>}
      <textarea
        className={`bg-slate-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all resize-none ${className}
        ${error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50 placeholder-red-300/30' 
            : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500'}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1 ml-1">{error}</p>}
    </div>
  );
};