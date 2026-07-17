import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required, 
  error, 
  className = '', 
  leftIcon,
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 border rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-slate-800 dark:text-slate-100 ${
            leftIcon ? 'pl-9' : ''
          } ${
            error
              ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
              : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-100 focus:border-indigo-500 dark:focus:ring-indigo-900/30'
          }`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};

export default Input;
