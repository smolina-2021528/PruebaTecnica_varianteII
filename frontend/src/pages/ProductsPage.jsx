import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import ProductTable from '../components/products/ProductTable';
import ProductModal from '../components/products/ProductModal';
import TransactionModal from '../components/products/TransactionModal';
import { Plus, Search, FolderPlus, Trash2 } from 'lucide-react';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getCategories, 
  createCategory, 
  deleteCategory,
  registerEntry,
  registerOutput
} from '../services/productService';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [transactionProduct, setTransactionProduct] = useState(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    fetchCategories();
  }, []);

  // Cargar productos al cambiar filtros de búsqueda o categoría
  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(search, selectedCategory);
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al obtener la lista de productos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`¿Está seguro de que desea eliminar el producto "${product.name}"?`)) {
      try {
        await deleteProduct(product._id);
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Error al eliminar el producto.');
      }
    }
  };

  const handleProductFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
      } else {
        await createProduct(formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      throw err; // El ProductForm capturará el error
    }
  };

  // Ajuste rápido de stock (Transacciones)
  const handleOpenTransactionModal = (product) => {
    setTransactionProduct(product);
    setIsTransactionOpen(true);
  };

  const handleTransactionSubmit = async (type, quantity) => {
    if (!transactionProduct) return;
    try {
      if (type === 'ENTRY') {
        await registerEntry(transactionProduct._id, quantity);
      } else {
        await registerOutput(transactionProduct._id, quantity);
      }
      fetchProducts();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // CRUD Categorías
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setCategoryError('El nombre es obligatorio');
      return;
    }
    setCategoryError('');
    try {
      await createCategory({ name: newCategoryName });
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      console.error(err);
      setCategoryError(err.response?.data?.message || 'Error al crear la categoría.');
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (window.confirm(`¿Está seguro de que desea eliminar la categoría "${cat.name}"?`)) {
      try {
        await deleteCategory(cat._id);
        fetchCategories();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Error al eliminar la categoría. Asegúrate de que ningún producto la esté utilizando.');
      }
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Gestión de Productos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administra los productos de tu inventario, sus categorías y sus niveles de stock.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button onClick={() => setIsCategoryModalOpen(true)} variant="outline" className="flex gap-2">
            <FolderPlus size={18} />
            Categorías
          </Button>
          <Button onClick={handleOpenCreateModal} className="flex gap-2">
            <Plus size={18} />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {error && <Alert type="danger" message={error} />}

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
      {loading && products.length === 0 ? (
        <Loader size="lg" />
      ) : (
        <ProductTable 
          products={products} 
          onEdit={handleOpenEditModal} 
          onDelete={handleDeleteProduct}
          onQuickStock={handleOpenTransactionModal}
        />
      )}

      {/* Modal de CRUD Producto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSubmit={handleProductFormSubmit}
      />

      {/* Modal de Transacción de Stock Rápido */}
      <TransactionModal
        isOpen={isTransactionOpen}
        onClose={() => setIsTransactionOpen(false)}
        product={transactionProduct}
        onSubmit={handleTransactionSubmit}
      />

      {/* Modal de Categorías */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Gestión de Categorías"
      >
        <form onSubmit={handleAddCategory} className="flex gap-2 items-end mb-6">
          <Input
            label="Nueva Categoría"
            placeholder="Nombre de categoría..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            error={categoryError}
            required
          />
          <Button type="submit" className="h-10">
            Agregar
          </Button>
        </form>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {categories.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No hay categorías registradas.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{cat.name}</span>
                <Button 
                  variant="outline" 
                  className="p-1 h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 border-none"
                  onClick={() => handleDeleteCategory(cat)}
                  title="Eliminar categoría"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProductsPage;
