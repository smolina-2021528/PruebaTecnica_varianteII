import React from 'react';
import SummaryCards from '../components/reports/SummaryCards';
import Card from '../components/common/Card';

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reportes y Resumen General</h1>
      
      <SummaryCards totalIn={320} totalOut={110} lowStockAlerts={2} />

      <Card title="Resumen Ejecutivo">
        <p className="text-gray-600">
          Vista consolidada del estado del inventario. Aquí se integrarán los gráficos y exportaciones en próximos sprints.
        </p>
      </Card>
    </div>
  );
};

export default ReportsPage;