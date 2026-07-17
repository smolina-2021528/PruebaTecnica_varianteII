import React from 'react';

const Card = ({ children, className = '', title, actions }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          {title && <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
