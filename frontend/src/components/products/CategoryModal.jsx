import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { createCategory, deleteCategory } from '../../services/categoryService';
import { Plus, Trash } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, categories = [], onRefresh, showNotification }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) {
      setError('El nombre es obligatorio.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createCategory(name);
      setNewCategoryName('');
      showNotification('success', `Categoría "${name}" creada.`);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear la categoría.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    try {
      await deleteCategory(category._id);
      showNotification('success', `Categoría "${category.name}" eliminada.`);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo eliminar la categoría.';
      showNotification('danger', msg);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestionar Categorías">
      <div className="space-y-4">
        <form onSubmit={handleCreate} className="flex gap-2">
          <Input
            placeholder="Nueva categoría..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" isLoading={submitting} className="flex gap-1 shrink-0">
            <Plus size={16} />
            Agregar
          </Button>
        </form>

        {error && <Alert type="danger" message={error} />}

        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
          {categories.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
              No hay categorías registradas.
            </p>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between py-2.5 px-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {cat.name}
                </span>
                <Button
                  variant="outline"
                  className="p-1.5 h-7 w-7 text-slate-400 hover:text-red-600"
                  onClick={() => handleDelete(cat)}
                  title="Eliminar"
                >
                  <Trash size={14} />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
