import React, { useEffect, useMemo, useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';

const MovementForm = ({ products = [], onSubmit, loading }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [type, setType] = useState('ENTRY');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const selectedProduct = useMemo(() => {
    return products.find((product) => String(product._id) === String(selectedProductId));
  }, [products, selectedProductId]);

  useEffect(() => {
    setError('');
  }, [selectedProductId, type, quantity]);

  const resetForm = () => {
    setSelectedProductId('');
    setType('ENTRY');
    setQuantity('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!selectedProductId) {
      setError('Por favor, selecciona un producto.');
      return;
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError('La cantidad debe ser un número entero mayor a cero.');
      return;
    }

    if (type === 'OUTPUT') {
      const currentStock = Number(selectedProduct?.stock || 0);

      if (parsedQuantity > currentStock) {
        setError(
          `Stock insuficiente. El stock actual es de ${currentStock} unidades.`,
        );
        return;
      }
    }

    onSubmit(
      {
        productId: selectedProductId,
        type,
        quantity: parsedQuantity,
      },
      resetForm,
    );
  };

  const productOptions = products.map((product) => ({
    value: product._id,
    label: `${product.name} (Stock: ${product.stock})`,
  }));

  const typeOptions = [
    { value: 'ENTRY', label: 'Entrada' },
    { value: 'OUTPUT', label: 'Salida' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Registrar movimiento
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          El stock se actualiza únicamente cuando el backend confirma la operación.
        </p>
      </div>

      {error && <Alert type="danger" message={error} />}

      <Select
        label="Producto"
        options={productOptions}
        value={selectedProductId}
        onChange={(event) => setSelectedProductId(event.target.value)}
        placeholder="Selecciona un producto"
        required
        disabled={loading}
      />

      {selectedProduct && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-800 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-300">
          <strong>Stock actual:</strong> {selectedProduct.stock} unidades
        </div>
      )}

      <Select
        label="Tipo de movimiento"
        options={typeOptions}
        value={type}
        onChange={(event) => setType(event.target.value)}
        required
        disabled={loading}
      />

      <Input
        label="Cantidad"
        type="number"
        min="1"
        step="1"
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        placeholder="Ej. 10"
        required
        disabled={loading}
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={loading}
        className="w-full"
      >
        Registrar movimiento
      </Button>
    </form>
  );
};

export default MovementForm;