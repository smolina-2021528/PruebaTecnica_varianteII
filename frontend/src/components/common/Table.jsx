import React from 'react';

const Table = ({ 
  headers = [], 
  data = [], 
  renderRow, 
  emptyMessage = 'No hay datos disponibles', 
  className = '' 
}) => {
  return (
    <div className={`overflow-x-auto border border-slate-100 dark:border-slate-700/60 rounded-xl bg-white dark:bg-slate-800 ${className}`}>
      <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700/60 text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-3.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-200">
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
