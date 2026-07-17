import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { getProducts } from '../services/productService';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ReportsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Detectar modo oscuro dinámicamente
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    // Escuchar cambios en la clase "dark" del elemento html para actualizar los gráficos en tiempo real
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error al obtener la lista de productos para los gráficos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
    
    return () => observer.disconnect();
  }, []);

  // Calcular la distribución por categoría
  const categoryData = useMemo(() => {
    const counts = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.stock;
      return acc;
    }, {});
    
    return Object.keys(counts)
      .map(key => ({ name: key, value: counts[key] }))
      .filter(item => item.value > 0); // Omitir categorías sin existencias
  }, [products]);

  // Calcular el Top 5 de productos por valor total de inventario (precio * stock)
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
      .slice(0, 5)
      .map(p => ({
        name: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
        valor: p.price * p.stock,
        fullName: p.name
      }));
  }, [products]);

  // Estilo dinámico para los tooltips de los gráficos según el tema
  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
    color: isDarkMode ? '#f8fafc' : '#0f172a',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  if (loading) {
    return <Loader size="lg" className="mt-12" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reportes Generales</h2>
      
      {error && <Alert type="danger" message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Categoría (PieChart) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
            Distribución por Categoría (Existencias)
          </h3>
          
          {categoryData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <p className="text-sm">No hay unidades en stock para graficar.</p>
            </div>
          ) : (
            <>
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie 
                      data={categoryData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5} 
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={tooltipStyle} 
                      itemStyle={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    {entry.name}: {entry.value} uds
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top 5 Productos por Valor (BarChart) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
            Top 5 Productos por Valor de Inventario
          </h3>
          
          {topProducts.length === 0 ? (
            <div className="h-72 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <p className="text-sm">No hay productos registrados para graficar.</p>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart 
                  data={topProducts} 
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke={isDarkMode ? '#334155' : '#e2e8f0'} 
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b' }} 
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <Tooltip 
                    cursor={{ fill: isDarkMode ? '#334155/30' : '#f8fafc' }} 
                    contentStyle={tooltipStyle} 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Valor del Inventario']}
                  />
                  <Bar dataKey="valor" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;