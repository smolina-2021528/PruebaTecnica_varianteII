import React from 'react';
import Table from '../common/Table';
import Button from '../common/Button';
import { Edit, Trash, ArrowUpDown } from 'lucide-react';

const ProductTable = ({ products = [], onEdit, onDelete, onQuickStock }) => {
  const headers = ['Nombre', 'Categoría', 'Precio', 'Stock', 'Stock Mínimo', 'Acciones'];

  const getStockBadge = (product) => {
    if (product.stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
          Agotado
        </span>
      );
    }
    if (product.stock <= product.minStock) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          Bajo ({product.stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
        {product.stock}
      </span>
    );
  };

  const renderRow = (product, idx) => (
    <tr key={product._id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
      <td className="px-6 py-4">
        <span className={`font-medium ${product.stock === 0 ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
          {product.name}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {product.category}
        </span>
      </td>
      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
        ${Number(product.price).toFixed(2)}
      </td>
      <td className="px-6 py-4">
        {getStockBadge(product)}
      </td>
      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
        {product.minStock}
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-1.5">
          {onQuickStock && (
            <Button
              variant="outline"
              className="p-1.5 h-8 w-8 text-slate-500 hover:text-indigo-600 dark:text-slate-400"
              onClick={() => onQuickStock(product)}
              title="Ajuste rápido de stock"
            >
              <ArrowUpDown size={16} />
            </Button>
          )}
          <Button
            variant="outline"
            className="p-1.5 h-8 w-8 text-slate-500 hover:text-indigo-600 dark:text-slate-400"
            onClick={() => onEdit(product)}
            title="Editar"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="outline"
            className="p-1.5 h-8 w-8 text-slate-500 hover:text-red-600 dark:text-slate-400"
            onClick={() => onDelete(product)}
            title="Eliminar"
          >
            <Trash size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <Table
      headers={headers}
      data={products}
      renderRow={renderRow}
      emptyMessage="No se encontraron productos."
    />
  );
};

export default ProductTable;
