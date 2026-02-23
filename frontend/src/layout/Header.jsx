import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import logo from '/logo-small.png';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = getCartCount();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    // Ya no necesitamos limpiar el carrito manualmente, el CartContext lo gestiona por usuario
    closeMenu();
  };

  return (
    <header className="bg-card-bg border-b border-sage-200 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group" onClick={closeMenu}>
              {/* Logo más grande para ocupar el espacio del texto eliminado */}
              <img className="h-12 w-auto transition-transform group-hover:scale-110" src={logo} alt="MJ Master Logo" />
            </Link>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Inicio
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Productos
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Nosotros
            </Link>
          </nav>

          {/* Área de Usuario y Carrito (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Carrito */}
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <span className="text-gray-300 text-sm">Hola, <span className="text-primary font-semibold">{user.name || 'Usuario'}</span></span>
                <Button
                  variant="danger-outline"
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm"
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-lime-400 text-dark-bg px-4 py-2 rounded font-bold text-sm transition-colors shadow-md hover:shadow-primary/20"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón Hamburguesa (Mobile) */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Carrito en Mobile (siempre visible) */}
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-primary transition-colors" onClick={closeMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-card-bg border-t border-sage-200 animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-primary hover:bg-sage-50/10 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Inicio
            </Link>
            <Link 
              to="/products" 
              className="text-gray-300 hover:text-primary hover:bg-sage-50/10 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Productos
            </Link>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-primary hover:bg-sage-50/10 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Nosotros
            </Link>
          </div>
          
          <div className="pt-4 pb-4 border-t border-sage-200">
            {user ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-400 mt-1">{user.email}</div>
                  </div>
                </div>
                <Button
                  variant="danger-outline"
                  onClick={handleLogout}
                  className="w-full mt-2"
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <Link
                  to="/login"
                  className="block text-center text-gray-300 hover:text-white hover:bg-sage-50/10 px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-primary hover:bg-lime-400 text-dark-bg px-3 py-2 rounded-md text-base font-bold shadow-md"
                  onClick={closeMenu}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
