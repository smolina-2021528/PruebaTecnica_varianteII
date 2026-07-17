import React from 'react';
import Table from '../common/Table';

const MovementTable = ({ movements = [] }) => {
  const headers = ['Producto', 'Tipo', 'Cantidad', 'Stock Anterior', 'Stock Nuevo', 'Fecha'];

  const renderRow = (mov, idx) => (
    <tr key={mov._id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{mov.productName}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          mov.type === 'ENTRY'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
        }`}>
          {mov.type === 'ENTRY' ? 'ENTRADA' : 'SALIDA'}
        </span>
      </td>
      <td className="px-6 py-4 font-semibold">{mov.quantity}</td>
      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{mov.previousStock}</td>
      <td className="px-6 py-4 font-semibold">{mov.newStock}</td>
      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
        {new Date(mov.createdAt).toLocaleString('es-ES')}
      </td>
    </tr>
  );

  return (
    <Table
      headers={headers}
      data={movements}
      renderRow={renderRow}
      emptyMessage="No se han registrado movimientos de inventario."
    />
  );
};

export default MovementTable;
