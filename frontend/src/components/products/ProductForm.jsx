import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';

const ProductForm = ({ product, onSubmit, onCancel, categories = [] }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [minStock, setMinStock] = useState('5');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      setPrice(String(product.price ?? ''));
      setStock(String(product.stock ?? '0'));
      setMinStock(String(product.minStock ?? '5'));
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setStock('0');
      setMinStock('5');
    }
    setErrors({});
    setSubmitError('');
  }, [product]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!category) newErrors.category = 'La categoría es obligatoria';
    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = 'El precio debe ser un número mayor o igual a 0';
    }
    if (!isEdit && (stock === '' || isNaN(Number(stock)) || Number(stock) < 0)) {
      newErrors.stock = 'El stock inicial debe ser un número mayor o igual a 0';
    }
    if (minStock === '' || isNaN(Number(minStock)) || Number(minStock) < 0) {
      newErrors.minStock = 'El stock mínimo debe ser un número mayor o igual a 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      minStock: Number(minStock),
    });
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <Alert type="danger" message={submitError} />
      )}

      <Input
        label="Nombre del Producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej. Laptop Pro 15&quot;"
        error={errors.name}
        required
      />

      <Select
        label="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={categoryOptions}
        placeholder="Seleccione una categoría"
        error={errors.category}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio ($)"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          error={errors.price}
          required
        />

        <Input
          label="Stock Mínimo"
          type="number"
          min="0"
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
          placeholder="5"
          error={errors.minStock}
          required
        />
      </div>

      {!isEdit && (
        <Input
          label="Stock Inicial"
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="0"
          error={errors.stock}
          required
        />
      )}

      {isEdit && (
        <p className="text-xs text-slate-400 dark:text-slate-500 italic">
          El stock se modifica mediante entradas y salidas de inventario.
        </p>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-6">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {isEdit ? 'Guardar Cambios' : 'Crear Producto'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
