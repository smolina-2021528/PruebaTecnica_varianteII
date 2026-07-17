import React from 'react';
import Table from '../common/Table';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';

const ProductTable = ({ products = [], onEdit, onDelete, onQuickStock }) => {
  const headers = ['Producto', 'Categoría', 'Precio', 'Stock', 'Stock Mínimo', 'Acciones'];

  const getStockBadge = (product) => {
    if (product.stock === 0) {
      return (
        <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-transparent">
          Agotado
        </span>
      );
    }
    if (product.stock <= product.minStock) {
      return (
        <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-transparent">
          Bajo ({product.stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-transparent">
        {product.stock}
      </span>
    );
  };

  const renderRow = (product, idx) => (
    <tr key={product._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
        <span className={product.stock === 0 ? 'text-slate-400 dark:text-slate-500 line-through' : ''}>
          {product.name}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
          {product.category}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
        ${Number(product.price).toFixed(2)}
      </td>
      <td className="px-6 py-4 text-center">
        {getStockBadge(product)}
      </td>
      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-center font-medium">
        {product.minStock}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center space-x-2">
          {onQuickStock && (
            <button 
              onClick={() => onQuickStock(product)} 
              className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" 
              title="Registrar Movimiento (Ingreso/Retiro)"
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => onEdit(product)} 
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" 
            title="Editar"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(product)} 
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" 
            title="Eliminar"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
      <Table
        headers={headers}
        data={products}
        renderRow={renderRow}
        emptyMessage="No se encontraron productos."
      />
    </div>
  );
};

export default ProductTable;
