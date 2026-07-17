import React from 'react';
import Table from '../common/Table';

const MovementTable = ({ movements, loading }) => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Producto', 
      accessor: (row) => row.product?.name || row.productName || 'N/A' 
    },
    { 
      header: 'Tipo', 
      accessor: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          row.type === 'ENTRY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.type === 'ENTRY' ? 'ENTRADA' : 'SALIDA'}
        </span>
      ) 
    },
    { header: 'Cantidad', accessor: 'quantity' },
    { 
      header: 'Fecha', 
      accessor: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : 'N/A' 
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Movimientos</h3>
      <Table columns={columns} data={movements} loading={loading} emptyMessage="No hay movimientos registrados." />
    </div>
  );
};

export default MovementTable;