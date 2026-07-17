import React from 'react';
import Table from '../common/Table';
import Button from '../common/Button';
import { Edit, Trash } from 'lucide-react';

const ProductTable = ({ products = [], onEdit, onDelete }) => {
  const headers = ['Nombre', 'Categoría', 'Precio', 'Stock', 'Stock Mínimo', 'Acciones'];

  const renderRow = (product, idx) => (
    <tr key={product._id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{product.name}</td>
      <td className="px-6 py-4">{product.category}</td>
      <td className="px-6 py-4">${Number(product.price).toFixed(2)}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          product.stock === 0 
            ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
            : product.stock <= product.minStock
            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
        }`}>
          {product.stock}
        </span>
      </td>
      <td className="px-6 py-4">{product.minStock}</td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
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
