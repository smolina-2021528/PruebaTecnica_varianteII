import React from 'react';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import { Package, Hash, DollarSign, AlertTriangle, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  // Datos simulados para el Sprint 1 (mientras el backend de reportes está listo)
  const kpis = [
    { title: 'Total Productos', value: '12', icon: <Package className="text-blue-500" size={24} />, description: 'Ítems registrados' },
    { title: 'Total Unidades', value: '148', icon: <Hash className="text-indigo-500" size={24} />, description: 'Productos en almacén' },
    { title: 'Valor Inventario', value: '$24,500.00', icon: <DollarSign className="text-emerald-500" size={24} />, description: 'Costo total estimado' },
    { title: 'Bajo Inventario', value: '3', icon: <AlertTriangle className="text-amber-500" size={24} />, description: 'Stock <= mínimo' },
    { title: 'Productos Agotados', value: '1', icon: <AlertCircle className="text-red-500" size={24} />, description: 'Stock = 0' },
  ];

  const lowStockAlerts = [
    { name: 'Mouse Inalámbrico', stock: 3, minStock: 5 },
    { name: 'Teclado Mecánico', stock: 2, minStock: 5 },
    { name: 'Memoria USB 64GB', stock: 4, minStock: 8 },
  ];

  const outOfStockAlerts = [
    { name: 'Monitor LED 24"', category: 'Tecnología' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Panel de Control</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Resumen general del inventario y alertas del sistema.
        </p>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {kpi.title}
              </span>
              {kpi.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">{kpi.value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{kpi.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Alertas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bajo Stock */}
        <Card title="Alertas de Bajo Stock">
          <div className="space-y-3">
            {lowStockAlerts.map((prod, idx) => (
              <Alert 
                key={idx} 
                type="warning" 
                message={`${prod.name} tiene un stock bajo de ${prod.stock} unidades (Mínimo requerido: ${prod.minStock})`} 
              />
            ))}
          </div>
        </Card>

        {/* Sin Stock */}
        <Card title="Alertas de Productos Agotados">
          <div className="space-y-3">
            {outOfStockAlerts.length > 0 ? (
              outOfStockAlerts.map((prod, idx) => (
                <Alert 
                  key={idx} 
                  type="danger" 
                  message={`CRÍTICO: El producto "${prod.name}" de la categoría "${prod.category}" se encuentra totalmente agotado.`} 
                />
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No hay productos agotados.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
