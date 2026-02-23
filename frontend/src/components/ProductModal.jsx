import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const API_URL = "https://localhost:9443/api";
const API_BASE_URL = "https://localhost:9443";

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
  const [reviews, setReviews] = useState(product.reviews || []);

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

  useEffect(() => {
    // resetear cantidad y reviews cuando cambie el producto
    setQuantity(1);
    setReviews(product.reviews || []);
    setRating(0);
    setComment('');
    setErrorMsg(null);
  }, [product]);

  if (!product) return null;

  const getImageUrl = (path) => {
    if (!path) return '/products/placeholder.avif';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleOverlayClick = (e) => {
    // Si clicas en el overlay fuera del modal, cerramos
    if (e.target === e.currentTarget) onClose();
  };

  const handleAddToCart = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const qty = Math.max(1, Math.min(quantity, product.stock || Infinity));
    addToCart(product, qty);
    // Cerrar el modal automáticamente después de añadir
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
  // Comprobar si el usuario ya ha reseñado este producto
  const hasReviewed = user && reviews.some((r) => {
    // r.authorName (backend), or r.user could be IRI or object
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
        // no enviamos 'user', el backend asignará el usuario autenticado
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
      // Añadir al inicio de la lista local
      setReviews((prev) => [newReview, ...(prev || [])]);
      // limpiar formulario
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

  // Simple portal mounting to body
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-card-bg rounded-lg shadow-xl max-w-4xl w-full mt-12 overflow-hidden">
        <div className="flex flex-col sm:flex-row max-h-[90vh]">
          <div className="sm:w-1/2 w-full h-64 sm:h-auto">
            <img 
              src={getImageUrl(product.picture)} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/products/placeholder.avif';
              }}
            />
          </div>

          <div className="sm:w-1/2 w-full p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-100">{product.name}</h2>
                <p className="text-gray-400 mt-1">{parseFloat(product.price).toFixed(2)} €</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200 ml-4"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Descripción</h3>
                <p className="text-gray-300 mt-2">{product.description || 'Descripción no disponible.'}</p>
              </div>

              {/* Bloque de añadir al carrito */}
              <div className="mt-6 flex items-center justify-between bg-transparent">
                <div className="text-sm text-gray-400">{product.stock > 0 ? `En stock: ${product.stock}` : 'Sin stock'}</div>
                <div className="flex items-center gap-3">
                  <Button onClick={handleAddToCart} className="px-4 py-2" disabled={product.stock <= 0}>
                    Añadir al carrito
                  </Button>

                  {/* Control de cantidad */}
                  <div className="flex items-center bg-slate-800/40 rounded px-2">
                    <button
                      onClick={decrement}
                      className="px-2 text-gray-200"
                      aria-label="Disminuir cantidad"
                      type="button"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={product.stock || undefined}
                      value={quantity}
                      onChange={onQuantityChange}
                      className="w-16 text-center bg-transparent outline-none text-gray-100"
                      aria-label="Cantidad"
                    />
                    <button
                      onClick={increment}
                      className="px-2 text-gray-200"
                      aria-label="Aumentar cantidad"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Sección de reseñas con formulario arriba */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Reseñas</h3>

                {/* Formulario */}
                {user ? (
                  hasReviewed ? (
                    <p className="text-sm text-gray-400 mt-2">Ya has escrito una reseña para este producto.</p>
                  ) : (
                    <form onSubmit={submitReview} className="mt-3 space-y-3">
                      {errorMsg && <div className="text-sm text-red-400">{errorMsg}</div>}

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setRating(i)}
                              onMouseEnter={() => setHoverRating(i)}
                              onMouseLeave={() => setHoverRating(0)}
                              className={`text-2xl ${ (hoverRating || rating) >= i ? 'text-yellow-400' : 'text-gray-500' }`}
                              aria-label={`Puntuación ${i}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        <div className="text-sm text-gray-400">{rating > 0 ? `${rating}/5` : 'Selecciona una puntuación'}</div>
                      </div>

                      <div>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          className="w-full bg-slate-800/30 text-gray-100 p-2 rounded outline-none"
                          placeholder="Escribe tu reseña aquí..."
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Button type="submit" className="px-4 py-2" disabled={submitting || rating < 1}>
                          {submitting ? 'Enviando...' : 'Enviar reseña'}
                        </Button>
                        <Button type="button" className="px-4 py-2 bg-gray-600" onClick={() => { setRating(0); setComment(''); setErrorMsg(null); }}>
                          Limpiar
                        </Button>
                      </div>
                    </form>
                  )
                ) : (
                  <p className="text-sm text-gray-400 mt-2">Inicia sesión para dejar una reseña.</p>
                )}

                {/* Lista de reseñas */}
                <div className="mt-4 space-y-3">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((r) => (
                      <div key={r.id || r._id || Math.random()} className="bg-slate-800/40 p-3 rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold text-gray-100">{r.author || r.user || r.authorName || 'Anónimo'}</div>
                            <StarsDisplay value={r.rating || 0} />
                          </div>
                          <div className="text-sm text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</div>
                        </div>
                        <div className="text-sm text-gray-300 mt-1">{r.comment || r.text || ''}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No hay reseñas para este producto.</p>
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
