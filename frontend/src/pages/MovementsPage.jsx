import React, { useState, useEffect } from 'react';
import MovementForm from '../components/movements/MovementForm';
import MovementTable from '../components/movements/MovementTable';
import Alert from '../common/Alert';

// Ajusta las rutas según los servicios Axios/Fetch de tu proyecto
import { getProducts } from '../services/productService';
import { getMovements, createEntry, createOutlet } from '../services/movementService';

const MovementsPage = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMovements, setLoadingMovements] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchData = async () => {
    try {
      setLoadingProducts(true);
      setLoadingMovements(true);

      const [productsRes, movementsRes] = await Promise.all([
        getProducts(),
        getMovements()
      ]);

      setProducts(productsRes.data || productsRes);
      setMovements(movementsRes.data || movementsRes);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error al cargar los datos del inventario.' });
    } finally {
      setLoadingProducts(false);
      setLoadingMovements(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterMovement = async (movementData, resetForm) => {
    setSubmitting(true);
    setFeedback(null);

    try {
      if (movementData.type === 'ENTRY') {
        await createEntry({ productId: movementData.productId, quantity: movementData.quantity });
      } else {
        await createOutlet({ productId: movementData.productId, quantity: movementData.quantity });
      }

      setFeedback({ type: 'success', message: 'Movimiento registrado con éxito.' });
      resetForm();
      
      // Actualización de stock e historial desde el servidor
      await fetchData();
    } catch (err) {
      // Si el backend rechaza, NO se altera la interfaz manualmente
      const errorMessage = err.response?.data?.message || 'Error al procesar el movimiento en el servidor.';
      setFeedback({ type: 'error', message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestión de Entradas y Salidas</h1>

      {feedback && (
        <Alert type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <MovementForm
            products={products}
            onSubmit={handleRegisterMovement}
            loading={submitting || loadingProducts}
          />
        </div>
        <div className="md:col-span-2">
          <MovementTable movements={movements} loading={loadingMovements} />
        </div>
      </div>
    </div>
  );
};

export default MovementsPage;