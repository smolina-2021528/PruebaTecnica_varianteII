import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Alert from '../components/common/Alert';

import { getSummary, getLowStock, getOutOfStock } from '../services/dashboardService';

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalUnits: 0,
    inventoryValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });
  const [lowStockList, setLowStockList] = useState([]);
  const [outOfStockList, setOutOfStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryRes, lowStockRes, outOfStockRes] = await Promise.all([
          getSummary(),
          getLowStock(),
          getOutOfStock()
        ]);

        const summaryData = summaryRes.data || summaryRes;
        const lowData = lowStockRes.data || lowStockRes;
        const outData = outOfStockRes.data || outOfStockRes;

        setLowStockList(lowData);
        setOutOfStockList(outData);

        setSummary({
          totalProducts: summaryData.totalProducts ?? 0,
          totalUnits: summaryData.totalUnits ?? 0,
          inventoryValue: summaryData.inventoryValue ?? 0,
          lowStockCount: summaryData.lowStockCount ?? lowData.length,
          outOfStockCount: summaryData.outOfStockCount ?? outData.length
        });
      } catch (err) {
        setError('Error al obtener la información del Dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const alertColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Producto', accessor: 'name' },
    { header: 'Stock Actual', accessor: 'stock' },
    { header: 'Mínimo Requerido', accessor: (row) => row.minStock || 'N/A' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard de Inventario</h1>

      {error && <Alert type="error" message={error} />}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card title="Total Productos" value={summary.totalProducts} loading={loading} />
        <Card title="Total Unidades" value={summary.totalUnits} loading={loading} />
        <Card 
          title="Valor Inventario" 
          value={`$${Number(summary.inventoryValue).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} 
          loading={loading} 
        />
        <Card 
          title="Bajo Stock" 
          value={summary.lowStockCount} 
          loading={loading}
          className="border-l-4 border-yellow-500"
        />
        <Card 
          title="Agotados" 
          value={summary.outOfStockCount} 
          loading={loading}
          className="border-l-4 border-red-500"
        />
      </div>

      {/* Listas de Alerta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">Productos con Bajo Stock</h3>
          <Table 
            columns={alertColumns} 
            data={lowStockList} 
            loading={loading} 
            emptyMessage="No hay productos con bajo stock."
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Productos Agotados</h3>
          <Table 
            columns={alertColumns} 
            data={outOfStockList} 
            loading={loading} 
            emptyMessage="No hay productos agotados."
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;