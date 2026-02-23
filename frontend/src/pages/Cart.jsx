import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { createOrder } from '../services/orderService';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = getCartTotal();
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!window.confirm(`¿Confirmar compra por ${total.toFixed(2)} €?`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createOrder(cartItems);
      clearCart();
      alert('¡Pedido realizado con éxito! Gracias por tu compra.');
      navigate('/'); // O redirigir a /orders si existiera
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-100">Tu carrito está vacío</h2>
        <p className="text-gray-400 mb-8">¡Añade algunos productos para empezar!</p>
        <Button to="/products" variant="primary" className="px-6 py-3 text-base">
          Ver Productos
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Carrito de Compras</h1>
      
      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lista de Productos */}
        <div className="lg:w-2/3">
          <div className="bg-card-bg border border-sage-200 rounded-lg shadow-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-sage-100 border-b border-sage-200 text-sm font-semibold text-gray-300 uppercase">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-center">Total</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-sage-200 items-center hover:bg-sage-50 transition-colors">
                {/* Producto (Imagen + Nombre) */}
                <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-sage-100 rounded overflow-hidden border border-sage-200">
                    <img 
                      src={item.picture || '/products/placeholder.avif'} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100">{item.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-1">{item.description}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 text-sm hover:text-red-300 mt-1 flex items-center gap-1 transition-colors focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Precio Unitario */}
                <div className="col-span-6 md:col-span-2 text-center md:text-right font-medium text-gray-300">
                  <span className="md:hidden text-gray-500 text-sm mr-2">Precio:</span>
                  {parseFloat(item.price).toFixed(2)} €
                </div>

                {/* Cantidad */}
                <div className="col-span-6 md:col-span-2 flex justify-center items-center">
                  <div className="flex items-center border border-sage-200 rounded-lg overflow-hidden bg-sage-100">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 hover:bg-sage-200 transition-colors text-gray-300 focus:outline-none"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-semibold text-gray-100 w-8 text-center bg-card-bg">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-sage-200 transition-colors text-gray-300 focus:outline-none"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total por Item */}
                <div className="col-span-12 md:col-span-2 text-center md:text-right font-bold text-primary text-lg">
                  <span className="md:hidden text-gray-500 text-sm mr-2">Total:</span>
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Link to="/products" className="text-primary hover:text-lime-400 hover:underline flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Seguir comprando
            </Link>
            <button 
              onClick={clearCart}
              className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors focus:outline-none"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Resumen del Pedido */}
        <div className="lg:w-1/3">
          <div className="bg-card-bg border border-sage-200 rounded-lg shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-100 border-b border-sage-200 pb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="font-medium text-gray-200">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Envío</span>
                <span className="font-medium text-gray-200">
                  {shippingCost === 0 ? <span className="text-primary">Gratis</span> : `${shippingCost.toFixed(2)} €`}
                </span>
              </div>
              {shippingCost > 0 && (
                <div className="text-xs text-sage-500 mt-1">
                  ¡Envío gratis en pedidos superiores a 50€!
                </div>
              )}
            </div>
            
            <div className="border-t border-sage-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-100">Total</span>
                <span className="text-2xl font-bold text-primary">{total.toFixed(2)} €</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">Impuestos incluidos</p>
            </div>
            
            <Button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 text-base shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 'Finalizar Compra'}
            </Button>
            
            <div className="mt-6 flex justify-center gap-4 text-gray-600">
              {/* Iconos de pago simulados (placeholders oscuros) */}
              <div className="w-8 h-5 bg-sage-200 rounded opacity-50"></div>
              <div className="w-8 h-5 bg-sage-200 rounded opacity-50"></div>
              <div className="w-8 h-5 bg-sage-200 rounded opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
