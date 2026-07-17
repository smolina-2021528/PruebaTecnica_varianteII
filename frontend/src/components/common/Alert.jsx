import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const Alert = ({ type = 'info', message, className = '' }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/40',
    danger: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/40',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40',
    info: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/40',
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-500" />,
    danger: <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />,
    info: <Info className="h-5 w-5 flex-shrink-0 text-indigo-500" />,
  };

  return (
    <div className={`flex gap-3 p-4 border rounded-xl items-start ${styles[type]} ${className}`}>
      {icons[type]}
      <span className="text-sm font-medium leading-5">{message}</span>
    </div>
  );
};

export default Alert;
