import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle, PackageX, AlertCircle } from 'lucide-react';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
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
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error al obtener la información del Dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader size="lg" className="mt-12" />;
  }

  const activeAlerts = summary.lowStockCount + summary.outOfStockCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Panel de Control</h2>

      {error && <Alert type="danger" message={error} />}
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4 transition-colors">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Productos</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{summary.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4 transition-colors">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Valor del Inventario</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              ${Number(summary.inventoryValue).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4 transition-colors">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Alertas Activas</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{activeAlerts}</p>
          </div>
        </div>
      </div>

      {/* Alertas de inventario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos Agotados */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-red-50/50 dark:bg-red-900/10 flex items-center">
            <PackageX className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <h3 className="font-semibold text-red-900 dark:text-red-300">Productos Agotados ({outOfStockList.length})</h3>
          </div>
          <div className="p-5">
            {outOfStockList.length === 0 ? (
               <p className="text-slate-500 dark:text-slate-400 text-sm py-2">No hay productos agotados.</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {outOfStockList.map((p, idx) => (
                  <li key={p._id || idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{p.name}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-md">Stock: 0</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bajo Inventario */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-amber-50/50 dark:bg-amber-900/10 flex items-center">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
            <h3 className="font-semibold text-amber-900 dark:text-amber-300">Bajo Inventario ({lowStockList.length})</h3>
          </div>
          <div className="p-5">
            {lowStockList.length === 0 ? (
               <p className="text-slate-500 dark:text-slate-400 text-sm py-2">No hay productos con bajo inventario.</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {lowStockList.map((p, idx) => (
                  <li key={p._id || idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{p.name}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-md">Stock: {p.stock} (Mín: {p.minStock})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;