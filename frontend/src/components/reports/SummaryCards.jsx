import React from 'react';
import Card from '../common/Card';

const SummaryCards = ({ totalIn = 0, totalOut = 0, lowStockAlerts = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-500">Total Entradas</h3>
        <p className="text-2xl font-bold text-green-600 mt-1">{totalIn} unidades</p>
      </Card>

      <Card className="border-l-4 border-red-500">
        <h3 className="text-sm font-medium text-gray-500">Total Salidas</h3>
        <p className="text-2xl font-bold text-red-600 mt-1">{totalOut} unidades</p>
      </Card>

      <Card className="border-l-4 border-yellow-500">
        <h3 className="text-sm font-medium text-gray-500">Alertas de Stock Bajo</h3>
        <p className="text-2xl font-bold text-yellow-600 mt-1">{lowStockAlerts} productos</p>
      </Card>
    </div>
  );
};

export default SummaryCards;