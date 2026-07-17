import React, { useState } from 'react';
import MovementForm from '../components/movements/MovementForm';
import MovementTable from '../components/movements/MovementTable';

const initialMovements = [
  { id: '1', productName: 'Laptop Lenovo ThinkPad', type: 'IN', quantity: 15, date: '2026-03-20' },
  { id: '2', productName: 'Mouse Inalámbrico Logitech', type: 'OUT', quantity: 3, date: '2026-03-21' },
];

const MovementsPage = () => {
  const [movements, setMovements] = useState(initialMovements);

  const handleAddMovement = (newMovement) => {
    setMovements([newMovement, ...movements]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestión de Movimientos</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MovementForm onSubmitMovement={handleAddMovement} />
        </div>
        <div className="lg:col-span-2">
          <MovementTable movements={movements} />
        </div>
      </div>
    </div>
  );
};

export default MovementsPage;