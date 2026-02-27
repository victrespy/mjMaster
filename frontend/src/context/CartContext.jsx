import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getProductById } from '../services/productService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, loading } = useAuth(); 
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [productsCache, setProductsCache] = useState({}); 
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const getStorageKey = () => {
    if (loading) return null; 
    return user ? `cart_user_${user.email}` : 'cart_guest';
  };

  useEffect(() => {
    if (loading) return;

    const key = getStorageKey();
    if (!key) return;

    try {
      const storedCart = localStorage.getItem(key);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Filtramos items inválidos que puedan venir del localStorage
        const minimalCart = parsedCart
          .filter(item => item && item.id)
          .map(item => ({
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

  useEffect(() => {
    if (!isInitialized) return;

    // Filtramos IDs válidos y que no estén ya en la caché
    const missingIds = cartItems
      .map(item => item.id)
      .filter(id => id && !Object.prototype.hasOwnProperty.call(productsCache, id));

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
                newCache[id] = {
                  id: id,
                  isDiscontinued: true,
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

  useEffect(() => {
    if (!isInitialized || isLoadingDetails) return;

    let hasChanges = false;
    const adjustedCart = cartItems.map(item => {
      const product = productsCache[item.id];
      
      if (product && !product.isDiscontinued) {
        if (item.quantity > product.stock && product.stock > 0) {
          hasChanges = true;
          return { ...item, quantity: product.stock };
        }
      }
      return item;
    });

    if (hasChanges) {
      setCartItems(adjustedCart);
    }
  }, [productsCache, isInitialized, isLoadingDetails]);

  const cartDetails = useMemo(() => {
    return cartItems.map(item => {
      const product = productsCache[item.id];
      if (product) {
        return {
          ...product,
          quantity: item.quantity
        };
      }
      return null;
    }).filter(Boolean);
  }, [cartItems, productsCache]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;

    if (!productsCache[product.id]) {
      setProductsCache(prev => ({ ...prev, [product.id]: product }));
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        const currentStock = product.stock || (productsCache[product.id]?.stock) || Infinity;
        const newQuantity = Math.min(existingItem.quantity + quantity, currentStock);

        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      } else {
        const initialQuantity = Math.min(quantity, product.stock || Infinity);
        return [...prevItems, { id: product.id, quantity: initialQuantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const product = productsCache[productId];
    const maxStock = product ? product.stock : Infinity;
    const finalQuantity = Math.min(newQuantity, maxStock);

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: finalQuantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartDetails.reduce((total, item) => {
      if (item.isDiscontinued || item.stock <= 0) {
        return total;
      }
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

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
