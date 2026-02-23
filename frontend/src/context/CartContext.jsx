import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getProductById } from '../services/productService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, loading } = useAuth(); // Obtenemos el usuario del contexto de autenticación
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [productsCache, setProductsCache] = useState({}); // Caché de productos: { id: productData }
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Determinar la clave de almacenamiento según el usuario
  const getStorageKey = () => {
    if (loading) return null; // Esperar a que termine de cargar el usuario
    return user ? `cart_user_${user.email}` : 'cart_guest';
  };

  // Cargar carrito cuando cambia el usuario (o al iniciar)
  useEffect(() => {
    if (loading) return;

    const key = getStorageKey();
    if (!key) return;

    try {
      const storedCart = localStorage.getItem(key);
      if (storedCart) {
        // storedCart debería ser un array de { id, quantity }
        const parsedCart = JSON.parse(storedCart);
        // Asegurarnos de que solo guardamos id y quantity
        const minimalCart = parsedCart.map(item => ({
          id: item.id,
          quantity: item.quantity
        }));
        setCartItems(minimalCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setCartItems([]);
    }
    setIsInitialized(true);
  }, [user, loading]);

  // Guardar en localStorage cada vez que cambie el carrito (solo id y quantity)
  useEffect(() => {
    if (!isInitialized || loading) return;

    const key = getStorageKey();
    if (key) {
      const minimalCart = cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));
      localStorage.setItem(key, JSON.stringify(minimalCart));
    }
  }, [cartItems, user, loading, isInitialized]);

  // Cargar detalles de productos faltantes en la caché
  useEffect(() => {
    if (!isInitialized) return;

    // Identificar IDs que están en el carrito pero no en la caché
    const missingIds = cartItems
      .map(item => item.id)
      .filter(id => !Object.prototype.hasOwnProperty.call(productsCache, id));

    if (missingIds.length > 0) {
      setIsLoadingDetails(true);

      Promise.all(missingIds.map(id => getProductById(id)))
        .then(results => {
          setProductsCache(prevCache => {
            const newCache = { ...prevCache };
            missingIds.forEach((id, index) => {
              if (results[index]) {
                newCache[id] = results[index];
              } else {
                // Producto no encontrado (Descatalogado)
                newCache[id] = {
                  id: id,
                  isDiscontinued: true, // Flag para identificarlo
                  name: "Producto Descatalogado",
                  description: "Este producto ya no está disponible.",
                  price: 0,
                  stock: 0,
                  picture: null
                };
              }
            });
            return newCache;
          });
        })
        .catch(error => {
          console.error("Error al cargar detalles de productos:", error);
        })
        .finally(() => {
          setIsLoadingDetails(false);
        });
    }
  }, [cartItems, isInitialized, productsCache]);

  // Ajustar cantidades automáticamente si exceden el stock
  useEffect(() => {
    if (!isInitialized || isLoadingDetails) return;

    let hasChanges = false;
    const adjustedCart = cartItems.map(item => {
      const product = productsCache[item.id];
      
      // Si tenemos el producto y no está descatalogado
      if (product && !product.isDiscontinued) {
        // Si la cantidad en carrito es mayor que el stock disponible
        if (item.quantity > product.stock && product.stock > 0) {
          hasChanges = true;
          return { ...item, quantity: product.stock };
        }
      }
      return item;
    });

    if (hasChanges) {
      console.log("⚠️ Ajustando cantidades del carrito al stock disponible...");
      setCartItems(adjustedCart);
    }
  }, [productsCache, isInitialized, isLoadingDetails]); // Dependemos de productsCache para saber cuándo llegan los datos de stock

  // Calcular cartDetails combinando cartItems y productsCache
  const cartDetails = useMemo(() => {
    return cartItems.map(item => {
      const product = productsCache[item.id];
      // Devolvemos el producto si existe en caché (incluso si es descatalogado)
      if (product) {
        return {
          ...product,
          quantity: item.quantity
        };
      }
      return null;
    }).filter(Boolean); // Filtramos los nulos (aún cargando)
  }, [cartItems, productsCache]);

  // Añadir producto al carrito
  const addToCart = (product, quantity = 1) => {
    // Actualizamos también la caché inmediatamente
    if (product && product.id && !productsCache[product.id]) {
      setProductsCache(prev => ({ ...prev, [product.id]: product }));
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Verificar stock antes de sumar
        const currentStock = product.stock || (productsCache[product.id]?.stock) || Infinity;
        const newQuantity = Math.min(existingItem.quantity + quantity, currentStock);

        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      } else {
        // Verificar stock inicial
        const initialQuantity = Math.min(quantity, product.stock || Infinity);
        return [...prevItems, { id: product.id, quantity: initialQuantity }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Verificar stock disponible en caché
    const product = productsCache[productId];
    const maxStock = product ? product.stock : Infinity;

    // No permitir superar el stock
    const finalQuantity = Math.min(newQuantity, maxStock);

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: finalQuantity } 
          : item
      )
    );
  };

  // Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular total del carrito (ignorando descatalogados y sin stock)
  const getCartTotal = () => {
    return cartDetails.reduce((total, item) => {
      // Si está descatalogado o no hay stock, no suma al total
      if (item.isDiscontinued || item.stock <= 0) {
        return total;
      }
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

  // Calcular número de items (opcional: decidir si contar los sin stock)
  // Por ahora contamos todos los items físicos en el carrito
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems: cartDetails,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isLoadingDetails
    }}>
      {children}
    </CartContext.Provider>
  );
};
