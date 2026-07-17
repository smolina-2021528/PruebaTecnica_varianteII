import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';

const MovementForm = ({ products, onSubmit, loading }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [type, setType] = useState('ENTRY');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  // Buscar el producto seleccionado para conocer su stock actual
  const selectedProduct = products.find(p => String(p.id) === String(selectedProductId));

  useEffect(() => {
    setError('');
  }, [selectedProductId, type, quantity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedProductId) {
      setError('Por favor, selecciona un producto.');
      return;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('La cantidad debe ser un número entero mayor a cero.');
      return;
    }

    // Validación estricta para Salida
    if (type === 'OUTLET' || type === 'EXIT') {
      const currentStock = selectedProduct ? selectedProduct.stock : 0;
      if (qty > currentStock) {
        setError(`Stock insuficiente. El stock actual es de ${currentStock} unidades.`);
        return;
      }
    }

    onSubmit({
      productId: selectedProductId,
      type,
      quantity: qty
    }, () => {
      // Callback para limpiar formulario únicamente si el backend respondió con éxito
      setQuantity('');
    });
  };

  const productOptions = products.map(p => ({
    value: p.id,
    label: `${p.name} (Stock: ${p.stock})`
  }));

  const typeOptions = [
    { value: 'ENTRY', label: 'Entrada' },
    { value: 'OUTLET', label: 'Salida' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">Registrar Movimiento de Inventario</h3>
      
      {error && <Alert type="error" message={error} />}

      <Select
        label="Producto"
        options={productOptions}
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
        placeholder="-- Selecciona un producto --"
        required
      />

      {selectedProduct && (
        <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
          <strong>Stock Actual:</strong> {selectedProduct.stock} unidades
        </div>
      )}

      <Select
        label="Tipo de Movimiento"
        options={typeOptions}
        value={type}
        onChange={(e) => setType(e.target.value)}
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

      <Button type="submit" variant="primary" loading={loading} className="w-full">
        Registrar Movimiento
      </Button>
    </form>
  );
};

export default MovementForm;