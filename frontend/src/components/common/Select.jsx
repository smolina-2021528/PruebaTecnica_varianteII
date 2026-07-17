import React from 'react';

const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  placeholder, 
  required, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-slate-800 dark:text-slate-100 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-100 focus:border-indigo-500 dark:focus:ring-indigo-900/30'
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};

export default Select;
