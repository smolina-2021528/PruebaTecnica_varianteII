import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import ProductTable from '../components/products/ProductTable';
import ProductModal from '../components/products/ProductModal';
import CategoryModal from '../components/products/CategoryModal';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { Plus, Search, Package } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      const data = await getProducts(params);
      setProducts(data);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError('Error al cargar los productos.');
      }
    }
  }, [search, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Error al cargar categorías');
      }
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadInitial();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [search, selectedCategory]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el producto "${product.name}"?`)) return;
    try {
      await deleteProduct(product._id);
      showNotification('success', `Producto "${product.name}" eliminado.`);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar el producto.';
      showNotification('danger', msg);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, {
          name: formData.name,
          category: formData.category,
          price: formData.price,
          minStock: formData.minStock,
        });
        showNotification('success', `Producto "${formData.name}" actualizado.`);
      } else {
        await createProduct(formData);
        showNotification('success', `Producto "${formData.name}" creado.`);
      }
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar el producto.';
      showNotification('danger', msg);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <Alert type={notification.type} message={notification.message} />
      )}

      {error && (
        <Alert type="danger" message={error} />
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
        <div className="flex gap-2 self-start sm:self-auto">
          <Button variant="secondary" onClick={() => setIsCategoryModalOpen(true)}>
            Categorías
          </Button>
          <Button onClick={handleOpenCreateModal} className="flex gap-2">
            <Plus size={18} />
            Nuevo Producto
          </Button>
        </div>
      </div>

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

      <ProductTable
        products={products}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteProduct}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? 'Editar Producto' : 'Crear Producto'}
        product={editingProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onRefresh={fetchCategories}
        showNotification={showNotification}
      />
    </div>
  );
};

export default ProductsPage;
