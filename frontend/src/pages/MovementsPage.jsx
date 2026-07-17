import React, { useState } from 'react';
import Card from '../components/common/Card';
import MovementForm from '../components/movements/MovementForm';
import MovementTable from '../components/movements/MovementTable';

const initialProducts = [
  { _id: '1', name: 'Laptop Pro 15"', stock: 15 },
  { _id: '2', name: 'Mouse Inalámbrico', stock: 3 },
  { _id: '3', name: 'Teclado Mecánico RGB', stock: 2 },
  { _id: '4', name: 'Monitor LED 24"', stock: 0 },
  { _id: '5', name: 'Memoria USB 64GB', stock: 4 },
];

const initialMovements = [
  { _id: '1', productId: '1', productName: 'Laptop Pro 15"', type: 'ENTRY', quantity: 15, previousStock: 0, newStock: 15, createdAt: '2026-07-16T18:00:00Z' },
  { _id: '2', productId: '2', productName: 'Mouse Inalámbrico', type: 'ENTRY', quantity: 5, previousStock: 0, newStock: 5, createdAt: '2026-07-16T18:05:00Z' },
  { _id: '3', productId: '2', productName: 'Mouse Inalámbrico', type: 'OUTPUT', quantity: 2, previousStock: 5, newStock: 3, createdAt: '2026-07-16T18:10:00Z' },
];

const MovementsPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);

  const handleRegisterMovement = (movementData) => {
    const selectedProd = products.find((p) => p._id === movementData.productId);
    if (!selectedProd) return;

    const previousStock = selectedProd.stock;
    const isEntry = movementData.type === 'ENTRY';
    const qty = movementData.quantity;
    const newStock = isEntry ? previousStock + qty : previousStock - qty;

    // Actualizar stock local del producto
    setProducts(products.map((p) => 
      p._id === selectedProd._id 
        ? { ...p, stock: newStock } 
        : p
    ));

    // Agregar movimiento al historial
    const newMovement = {
      _id: String(Date.now()),
      productId: selectedProd._id,
      productName: selectedProd.name,
      type: movementData.type,
      quantity: qty,
      previousStock,
      newStock,
      createdAt: new Date().toISOString(),
    };

    setMovements([newMovement, ...movements]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Transacciones de Inventario</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Registra entradas y salidas de stock para actualizar los niveles de almacenamiento en tiempo real.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulario de Registro */}
        <div className="lg:col-span-1">
          <Card title="Registrar Transacción">
            <MovementForm products={products} onSubmit={handleRegisterMovement} />
          </Card>
        </div>

        {/* Tabla de Historial */}
        <div className="lg:col-span-2">
          <Card title="Historial de Movimientos">
            <MovementTable movements={movements} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MovementsPage;
