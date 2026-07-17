import React from 'react';
import Table from '../common/Table';
import Loader from '../common/Loader';

const getMovementId = (movement) => movement._id || movement.id;

const getMovementTypeLabel = (type) => {
  return type === 'ENTRY' ? 'ENTRADA' : 'SALIDA';
};

const getMovementTypeClasses = (type) => {
  return type === 'ENTRY'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300';
};

const formatDate = (date) => {
  if (!date) {
    return 'N/A';
  }

  return new Date(date).toLocaleString('es-GT', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

const MovementTable = ({ movements = [], loading }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Historial de movimientos
        </h3>

        <Loader />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Historial de movimientos
      </h3>

      <Table
        headers={[
          'Producto',
          'Tipo',
          'Cantidad',
          'Stock anterior',
          'Stock nuevo',
          'Fecha',
        ]}
        data={movements}
        emptyMessage="No hay movimientos registrados."
        renderRow={(movement) => (
          <tr key={getMovementId(movement)}>
            <td className="px-6 py-4 font-medium">
              {movement.productName || movement.product?.name || 'N/A'}
            </td>

            <td className="px-6 py-4">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getMovementTypeClasses(
                  movement.type,
                )}`}
              >
                {getMovementTypeLabel(movement.type)}
              </span>
            </td>

            <td className="px-6 py-4">{movement.quantity}</td>

            <td className="px-6 py-4">{movement.previousStock}</td>

            <td className="px-6 py-4">{movement.newStock}</td>

            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
              {formatDate(movement.createdAt)}
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default MovementTable;