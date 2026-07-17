import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Plus, Minus, AlertTriangle, ArrowUpDown } from 'lucide-react';

const TransactionModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [type, setType] = useState('ENTRY');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType('ENTRY');
      setQuantity(1);
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = Number(quantity);

    if (!quantity || isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      setError('La cantidad debe ser un número entero mayor que cero');
      return;
    }

    if (type === 'OUTPUT' && product && product.stock < qty) {
      setError(`Stock insuficiente para realizar este retiro. Stock actual: ${product.stock}`);
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await onSubmit(type, qty);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al registrar la transacción.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center text-slate-800 dark:text-slate-100 font-bold">
          <ArrowUpDown className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Registrar Movimiento
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Info del Producto Seleccionado */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Producto seleccionado</p>
          <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{product?.name}</p>
          <div className="mt-2 inline-flex items-center justify-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-bold">
            Stock actual: {product?.stock ?? 0} uds
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-xl text-sm font-semibold flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Tipo de Movimiento (Botones Grandes) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Tipo de Movimiento
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setType('ENTRY');
                setError('');
              }}
              className={`py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center transition-all ${
                type === 'ENTRY'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Plus className="w-5 h-5 mr-2" /> Ingreso
            </button>
            <button
              type="button"
              onClick={() => {
                setType('OUTPUT');
                setError('');
              }}
              className={`py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center transition-all ${
                type === 'OUTPUT'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Minus className="w-5 h-5 mr-2" /> Retiro
            </button>
          </div>
        </div>

        {/* Cantidad (Gran Input Centrado) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Cantidad (Unidades)
          </label>
          <input
            type="number"
            min="1"
            required
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError('');
            }}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center font-bold text-2xl"
          />
        </div>

        {/* Acciones */}
        <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-5 py-3 text-white rounded-xl transition-colors font-bold shadow-lg dark:shadow-none flex items-center ${
              type === 'ENTRY'
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                : 'bg-red-500 hover:bg-red-600 shadow-red-200'
            }`}
          >
            {isLoading ? 'Procesando...' : `Confirmar ${type === 'ENTRY' ? 'Ingreso' : 'Retiro'}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
