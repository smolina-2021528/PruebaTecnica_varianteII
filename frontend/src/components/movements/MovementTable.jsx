import React from 'react';
import Card from '../common/Card';
import Table from '../common/Table';

const MovementTable = ({ movements = [] }) => {
  const columns = [
    { header: 'Fecha', accessor: 'date' },
    { header: 'Producto', accessor: 'productName' },
    {
      header: 'Tipo',
      accessor: 'type',
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.type === 'IN'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.type === 'IN' ? 'Entrada' : 'Salida'}
        </span>
      ),
    },
    { header: 'Cantidad', accessor: 'quantity' },
  ];

  return (
    <Card title="Historial de Movimientos">
      <Table columns={columns} data={movements} emptyMessage="No hay movimientos registrados." />
    </Card>
  );
};

export default MovementTable;