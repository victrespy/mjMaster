import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

const OrderDetailModal = ({ order, onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!order) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="bg-card-bg border border-sage-200 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all animate-scale-in">
        <div className="p-6 border-b border-sage-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Detalle del Pedido #{order.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-400 font-bold">Fecha</p>
              <p className="text-gray-200">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold">Estado</p>
              <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-bold border border-green-500/30">
                {order.state}
              </span>
            </div>
            <div>
              <p className="text-gray-400 font-bold">Total</p>
              <p className="text-primary font-bold text-lg">{parseFloat(order.total).toFixed(2)} €</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-200 mb-4 border-b border-sage-200/20 pb-2">Productos</h3>
          
          <div className="space-y-4">
            {order.orderProducts && order.orderProducts.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-sage-50/5 p-3 rounded-lg border border-sage-200/10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-sage-200 rounded overflow-hidden flex-shrink-0">
                    {/* Si tuviéramos la imagen del producto en orderProduct, la mostraríamos aquí */}
                    <div className="w-full h-full bg-sage-300 flex items-center justify-center text-gray-500 text-xs">IMG</div>
                  </div>
                  <div>
                    {/* Accedemos al nombre del producto si está disponible, o mostramos ID */}
                    <p className="font-bold text-gray-200">
                      {item.product ? (item.product.name || `Producto #${item.product.id || item.product.split('/').pop()}`) : 'Producto eliminado'}
                    </p>
                    <p className="text-xs text-gray-400">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-200">{parseFloat(item.unitPrice).toFixed(2)} €</p>
                  <p className="text-xs text-gray-500">Unitario</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-sage-200 bg-sage-50/5 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderDetailModal;
