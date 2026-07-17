import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import ProductTable from '../components/products/ProductTable';
import ProductModal from '../components/products/ProductModal';
import { Plus, Search, Package } from 'lucide-react';

const initialProducts = [
  { _id: '1', name: 'Laptop Pro 15"', category: 'Tecnología', price: 1299.99, stock: 15, minStock: 5 },
  { _id: '2', name: 'Mouse Inalámbrico', category: 'Accesorios', price: 29.99, stock: 3, minStock: 5 },
  { _id: '3', name: 'Teclado Mecánico RGB', category: 'Accesorios', price: 89.99, stock: 2, minStock: 5 },
  { _id: '4', name: 'Monitor LED 24"', category: 'Tecnología', price: 189.99, stock: 0, minStock: 5 },
  { _id: '5', name: 'Memoria USB 64GB', category: 'Accesorios', price: 15.99, stock: 4, minStock: 8 },
];

const initialCategories = [
  { _id: '1', name: 'Tecnología' },
  { _id: '2', name: 'Accesorios' },
  { _id: '3', name: 'Mobiliario' },
];

const ProductsPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? prod.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`¿Está seguro de que desea eliminar el producto "${product.name}"?`)) {
      setProducts(products.filter((p) => p._id !== product._id));
      showNotification('success', `Producto "${product.name}" eliminado.`);
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingProduct) {
      setProducts(products.map((p) =>
        p._id === editingProduct._id
          ? { ...p, ...formData }
          : p
      ));
      showNotification('success', `Producto "${formData.name}" actualizado.`);
    } else {
      const newProduct = {
        _id: String(Date.now()),
        ...formData,
      };
      setProducts([...products, newProduct]);
      showNotification('success', `Producto "${formData.name}" creado.`);
    }
    setIsModalOpen(false);
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {notification && (
        <Alert type={notification.type} message={notification.message} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Gestión de Productos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administra los productos de tu inventario, sus categorías y sus niveles de stock.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} className="flex gap-2 self-start sm:self-auto">
          <Plus size={18} />
          Nuevo Producto
        </Button>
      </div>

      {/* Resumen rápido */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
            <Package size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalProducts}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total productos</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">!</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{lowStockCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Bajo stock</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
            <span className="text-lg font-bold text-red-600 dark:text-red-400">0</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{outOfStockCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Agotados</p>
          </div>
        </Card>
      </div>

      {/* Barra de Filtros */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={18} />}
          />

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categoryOptions}
            placeholder="Todas las categorías"
          />
        </div>
      </Card>

      {/* Tabla de Productos */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteProduct}
      />

      {/* Modal de Producto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Editar Producto' : 'Crear Producto'}
        product={editingProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default ProductsPage;
