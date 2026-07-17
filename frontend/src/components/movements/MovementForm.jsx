import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const mockProducts = [
  { value: 'prod-1', label: 'Laptop Lenovo ThinkPad' },
  { value: 'prod-2', label: 'Mouse Inalámbrico Logitech' },
  { value: 'prod-3', label: 'Monitor Dell 27"' },
];

const movementTypes = [
  { value: 'IN', label: 'Entrada (Ingreso)' },
  { value: 'OUT', label: 'Salida (Egreso)' },
];

const MovementForm = ({ onSubmitMovement }) => {
  const [productId, setProductId] = useState('');
  const [type, setType] = useState('IN');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productId || !quantity || quantity <= 0) return;

    const selectedProduct = mockProducts.find((p) => p.value === productId);

    onSubmitMovement({
      id: Date.now().toString(),
      productName: selectedProduct ? selectedProduct.label : productId,
      type,
      quantity: Number(quantity),
      date: new Date().toISOString().split('T')[0],
    });

    // Resetear formulario
    setProductId('');
    setQuantity('');
  };

  return (
    <Card title="Registrar Movimiento de Inventario">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Producto"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          options={mockProducts}
          placeholder="Selecciona un producto"
          required
        />

        <Select
          label="Tipo de Movimiento"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={movementTypes}
          required
        />

        <Input
          label="Cantidad"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Ej. 10"
          required
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary">
            Registrar Movimiento
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MovementForm;