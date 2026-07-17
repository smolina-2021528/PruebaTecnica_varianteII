import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const MovementForm = ({ products = [], onSubmit }) => {
  const [productId, setProductId] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productId) {
      setError('Seleccione un producto');
      return;
    }
    if (!type) {
      setError('Seleccione el tipo de movimiento');
      return;
    }
    const qty = Number(quantity);
    if (!quantity || isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      setError('La cantidad debe ser un número entero mayor que cero');
      return;
    }

    const selectedProduct = products.find((p) => p._id === productId);

    // Validación de stock para salidas
    if (type === 'OUTPUT' && selectedProduct && selectedProduct.stock < qty) {
      setError(`Stock insuficiente. Stock actual: ${selectedProduct.stock}`);
      return;
    }

    setError('');
    onSubmit({
      productId,
      productName: selectedProduct ? selectedProduct.name : 'Desconocido',
      type,
      quantity: qty,
    });

    // Limpiar formulario
    setProductId('');
    setType('');
    setQuantity('');
  };

  const productOptions = products.map((p) => ({
    value: p._id,
    label: `${p.name} (Stock: ${p.stock})`,
  }));

  const typeOptions = [
    { value: 'ENTRY', label: 'Entrada (+)' },
    { value: 'OUTPUT', label: 'Salida (-)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Seleccionar Producto"
        value={productId}
        onChange={(e) => {
          setProductId(e.target.value);
          setError('');
        }}
        options={productOptions}
        placeholder="Seleccione un producto..."
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Tipo de Movimiento"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setError('');
          }}
          options={typeOptions}
          placeholder="Seleccione tipo..."
          required
        />

        <Input
          label="Cantidad"
          type="number"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            setError('');
          }}
          placeholder="Cantidad entera..."
          required
        />
      </div>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      <Button type="submit" className="w-full">
        Registrar Movimiento
      </Button>
    </form>
  );
};

export default MovementForm;
