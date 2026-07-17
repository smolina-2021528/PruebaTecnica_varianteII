import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const ProductForm = ({ product, onSubmit, onCancel, categories = [] }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [errors, setErrors] = useState({});

  const isEdit = !!product;

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      setPrice(product.price || '');
      setStock(product.stock || '');
      setMinStock(product.minStock || '');
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setStock('0');
      setMinStock('5');
    }
    setErrors({});
  }, [product]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!category) newErrors.category = 'La categoría es obligatoria';
    if (price === '' || Number(price) < 0) newErrors.price = 'El precio debe ser mayor o igual a 0';
    if (!isEdit && (stock === '' || Number(stock) < 0)) newErrors.stock = 'El stock inicial debe ser mayor o igual a 0';
    if (minStock === '' || Number(minStock) < 0) newErrors.minStock = 'El stock mínimo debe ser mayor o igual a 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name,
      category,
      price: Number(price),
      stock: isEdit ? Number(stock) : Number(stock),
      minStock: Number(minStock),
    });
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre del Producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
          required
        />
        
        <Input
          label="Stock Mínimo"
          type="number"
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
          error={errors.minStock}
          required
        />
      </div>

      {!isEdit && (
        <Input
          label="Stock Inicial"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          error={errors.stock}
          required
        />
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
