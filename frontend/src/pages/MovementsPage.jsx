import React, { useCallback, useEffect, useState } from 'react';
import MovementForm from '../components/movements/MovementForm';
import MovementTable from '../components/movements/MovementTable';
import Alert from '../components/common/Alert';
import { getProducts } from '../services/productService';
import {
  createEntry,
  createOutput,
  getMovements,
} from '../services/movementService';

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || error.message || fallback;
};

const MovementsPage = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMovements, setLoadingMovements] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchData = useCallback(async () => {
    setLoadingProducts(true);
    setLoadingMovements(true);
    setFeedback(null);

    try {
      const [productsData, movementsData] = await Promise.all([
        getProducts(),
        getMovements(),
      ]);

      setProducts(Array.isArray(productsData) ? productsData : []);
      setMovements(Array.isArray(movementsData) ? movementsData : []);
    } catch (error) {
      setFeedback({
        type: 'danger',
        message: getErrorMessage(
          error,
          'Error al cargar los datos del inventario.',
        ),
      });
    } finally {
      setLoadingProducts(false);
      setLoadingMovements(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRegisterMovement = async (movementData, resetForm) => {
    setSubmitting(true);
    setFeedback(null);

    try {
      if (movementData.type === 'ENTRY') {
        await createEntry({
          productId: movementData.productId,
          quantity: movementData.quantity,
        });
      } else {
        await createOutput({
          productId: movementData.productId,
          quantity: movementData.quantity,
        });
      }

      setFeedback({
        type: 'success',
        message: 'Movimiento registrado con éxito.',
      });

      resetForm();
      await fetchData();
    } catch (error) {
      setFeedback({
        type: 'danger',
        message: getErrorMessage(
          error,
          'Error al procesar el movimiento en el servidor.',
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Gestión de Entradas y Salidas
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Registra movimientos de inventario y revisa el historial actualizado desde el servidor.
        </p>
      </div>

      {feedback && (
        <Alert type={feedback.type} message={feedback.message} />
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <MovementForm
            products={products}
            onSubmit={handleRegisterMovement}
            loading={submitting || loadingProducts}
          />
        </div>

        <div className="xl:col-span-2">
          <MovementTable
            movements={movements}
            loading={loadingMovements}
          />
        </div>
      </div>
    </div>
  );
};

export default MovementsPage;