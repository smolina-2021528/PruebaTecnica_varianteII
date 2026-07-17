import React from 'react';
import SummaryCards from '../components/reports/SummaryCards';
import Card from '../common/Card';

const mockAlerts = [
  { id: '1', product: 'Monitor Dell 27"', stock: 2, minStock: 5 },
  { id: '2', product: 'Teclado Mecánico', stock: 1, minStock: 10 },
];

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard y Alertas</h1>
      
      {/* Tarjetas resumen */}
      <SummaryCards totalIn={150} totalOut={45} lowStockAlerts={mockAlerts.length} />

      {/* Sección de Alertas */}
      <Card title="Alertas de Inventario Crítico">
        <div className="space-y-3">
          {mockAlerts.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded"
            >
              <div>
                <p className="font-semibold text-gray-800">{item.product}</p>
                <p className="text-sm text-gray-600">Stock Mínimo Requerido: {item.minStock}</p>
              </div>
              <span className="font-bold text-red-600">Stock Actual: {item.stock}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;