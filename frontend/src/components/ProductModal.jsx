import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const API_URL = "https://localhost:9443/api";

const StarsDisplay = ({ value = 0 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={`${i <= value ? 'text-yellow-400' : 'text-gray-600' } text-sm`}>★</span>
      ))}
    </div>
  );
};

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  // Reviews local state so we can update after posting
  const [reviews, setReviews] = useState([]);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Solo reseteamos si cambia el ID del producto
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setReviews(product.reviews || []);
      setRating(0);
      setComment('');
      setErrorMsg(null);
    }
  }, [product.id]); // Dependencia clave: product.id

  if (!product) return null;

  const imageUrl = product.picture ? product.picture : '/products/placeholder.avif';

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleAddToCart = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const qty = Math.max(1, Math.min(quantity, product.stock || Infinity));
    addToCart(product, qty);
    onClose();
  };

  const increment = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setQuantity((q) => Math.min((product.stock || Infinity), q + 1));
  };

  const decrement = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setQuantity((q) => Math.max(1, q - 1));
  };

  const onQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (Number.isNaN(val)) return setQuantity(1);
    setQuantity(Math.max(1, Math.min(val, product.stock || Infinity)));
  };

  // --- Review logic ---
  const hasReviewed = user && reviews.some((r) => {
    const authorMatch = r.authorName && user.name && r.authorName === user.name;
    const userIdMatch = r.user && (r.user === `/api/users/${user.id}` || r.user?.id === user.id || r.user === user.id);
    return authorMatch || userIdMatch;
  });

  const submitReview = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!user) {
      setErrorMsg('Debes iniciar sesión para escribir una reseña.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setErrorMsg('Selecciona una puntuación entre 1 y 5.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        rating: rating,
        comment: comment,
        product: `/api/products/${product.id}`
      };

      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data['hydra:description'] || data.message || 'Error guardando la reseña.';
        setErrorMsg(msg);
        setSubmitting(false);
        return;
      }

      const newReview = await res.json();
      
      // Asegurarnos de que el autor se muestra correctamente inmediatamente
      if (!newReview.authorName && user.name) {
        newReview.authorName = user.name;
      }

      setReviews((prev) => [newReview, ...(prev || [])]);
      setRating(0);
      setHoverRating(0);
      setComment('');
    } catch (err) {
      console.error('Error creando reseña:', err);
      setErrorMsg('Error de red al enviar la reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-card-bg border border-sage-200/20 rounded-xl shadow-2xl max-w-4xl w-full mt-12 overflow-hidden transform transition-all animate-scale-in">
        <div className="flex flex-col sm:flex-row max-h-[90vh]">
          <div className="sm:w-1/2 w-full h-64 sm:h-auto bg-white/5 relative">
            <img src={imageUrl} alt={product.name} className="w-full h-full object-contain p-4" />
          </div>

          <div className="sm:w-1/2 w-full p-6 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-100 leading-tight">{product.name}</h2>
                <p className="text-xl text-primary font-bold mt-2">{parseFloat(product.price).toFixed(2)} €</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Descripción</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{product.description || 'Descripción no disponible.'}</p>
              </div>

              <div className="p-4 bg-sage-50/5 rounded-lg border border-sage-200/10">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {product.stock > 0 ? `En stock: ${product.stock} uds` : 'Agotado'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-dark-bg border border-sage-200/20 rounded-lg">
                    <button
                      onClick={decrement}
                      className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                      type="button"
                      disabled={product.stock <= 0}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={product.stock || undefined}
                      value={quantity}
                      onChange={onQuantityChange}
                      className="w-12 text-center bg-transparent outline-none text-gray-100 font-medium appearance-none"
                      disabled={product.stock <= 0}
                    />
                    <button
                      onClick={increment}
                      className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                      type="button"
                      disabled={product.stock <= 0}
                    >
                      +
                    </button>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart} 
                    className="flex-1 py-2.5 shadow-lg shadow-primary/10" 
                    disabled={product.stock <= 0}
                  >
                    Añadir al Carrito
                  </Button>
                </div>
              </div>

              <div className="border-t border-sage-200/10 pt-6">
                <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
                  Reseñas <span className="text-sm font-normal text-gray-500">({reviews.length})</span>
                </h3>

                {user ? (
                  !hasReviewed ? (
                    <form onSubmit={submitReview} className="bg-sage-50/5 p-4 rounded-lg border border-sage-200/10 mb-6">
                      <h4 className="text-sm font-bold text-gray-300 mb-3">Escribe tu opinión</h4>
                      
                      {errorMsg && <div className="mb-3 text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-500/20">{errorMsg}</div>}

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1,2,3,4,5].map((i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setRating(i)}
                              onMouseEnter={() => setHoverRating(i)}
                              onMouseLeave={() => setHoverRating(0)}
                              className={`text-2xl transition-transform hover:scale-110 ${ (hoverRating || rating) >= i ? 'text-yellow-400' : 'text-gray-600' }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 ml-2">{rating > 0 ? ['Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'][rating-1] : ''}</span>
                      </div>

                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="w-full bg-dark-bg border border-sage-200/20 text-gray-100 p-3 rounded-lg outline-none focus:border-primary/50 transition-colors text-sm mb-3 resize-none"
                        placeholder="¿Qué te ha parecido este producto?"
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="submit" className="px-4 py-1.5 text-sm" disabled={submitting || rating < 1}>
                          {submitting ? 'Enviando...' : 'Publicar'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg mb-6 text-center">
                      <p className="text-sm text-primary">¡Gracias por tu valoración!</p>
                    </div>
                  )
                ) : (
                  <div className="bg-sage-50/5 p-4 rounded-lg border border-sage-200/10 mb-6 text-center">
                    <p className="text-sm text-gray-400">
                      <a href="/login" className="text-primary hover:underline">Inicia sesión</a> para dejar una reseña.
                    </p>
                  </div>
                )}

                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((r, idx) => (
                      <div key={r.id || idx} className="bg-dark-bg p-4 rounded-lg border border-sage-200/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-sage-200/20 flex items-center justify-center text-xs font-bold text-gray-300">
                              {(r.authorName || r.author || 'A').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-gray-200">{r.authorName || r.author || 'Anónimo'}</span>
                          </div>
                          <span className="text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Reciente'}</span>
                        </div>
                        <div className="mb-2">
                          <StarsDisplay value={r.rating || 0} />
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{r.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-4">Sé el primero en opinar sobre este producto.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;
