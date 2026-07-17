import React from 'react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';

const ReportsPage = () => {
  // Datos simulados para el Sprint 1 (mientras el backend de reportes está listo)
  const topProducts = [
    { name: 'Laptop Pro 15"', category: 'Tecnología', totalSold: 12, valueSold: 15599.88 },
    { name: 'Mouse Inalámbrico', category: 'Accesorios', totalSold: 8, valueSold: 239.92 },
    { name: 'Teclado Mecánico RGB', category: 'Accesorios', totalSold: 5, valueSold: 449.95 },
  ];

  const categoriesReport = [
    { category: 'Tecnología', productCount: 2, totalUnits: 15, inventoryValue: 19689.85 },
    { category: 'Accesorios', productCount: 3, totalUnits: 9, inventoryValue: 323.91 },
    { category: 'Mobiliario', productCount: 0, totalUnits: 0, inventoryValue: 0.00 },
  ];

  const renderTopProductRow = (prod, idx) => (
    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100">#{idx + 1} {prod.name}</td>
      <td className="px-6 py-4">{prod.category}</td>
      <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">{prod.totalSold} u.</td>
      <td className="px-6 py-4 font-semibold">${Number(prod.valueSold).toFixed(2)}</td>
    </tr>
  );

  const renderCategoryRow = (cat, idx) => (
    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{cat.category}</td>
      <td className="px-6 py-4">{cat.productCount}</td>
      <td className="px-6 py-4">{cat.totalUnits} u.</td>
      <td className="px-6 py-4 font-semibold">${Number(cat.inventoryValue).toFixed(2)}</td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Reportes de Inventario</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Analítica de rotación de productos y distribución de valor por categorías.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Productos */}
        <Card title="Productos Más Vendidos (Salidas)">
          <Table
            headers={['Producto', 'Categoría', 'Cantidad Vendida', 'Total Recaudado']}
            data={topProducts}
            renderRow={renderTopProductRow}
            emptyMessage="No hay movimientos registrados para calcular rotación."
          />
        </Card>

        {/* Resumen por Categorías */}
        <Card title="Distribución por Categoría">
          <Table
            headers={['Categoría', 'N° Productos', 'Total Unidades', 'Valor del Stock']}
            data={categoriesReport}
            renderRow={renderCategoryRow}
            emptyMessage="No se encontraron categorías con productos."
          />
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
