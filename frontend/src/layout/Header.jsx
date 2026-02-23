import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const userMenuRef = useRef(null);

  const cartCount = getCartCount();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const closeUserMenu = () => setIsUserOpen(false);

  // Cerrar el menú de usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        closeUserMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    // Ya no necesitamos limpiar el carrito manualmente, el CartContext lo gestiona por usuario
    closeMenu();
    closeUserMenu();
  };

  return (
    <header className="bg-card-bg border-b border-sage-200 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">

          {/* Left: Mobile logo (visible only on small screens) */}
          <div className="flex items-center">
            <div className="md:hidden">
              <Link to="/" className="flex items-center" onClick={closeMenu} aria-label="Inicio">
                <span style={{ fontFamily: 'var(--font-logo)' }} className={`font-extrabold text-primary tracking-tight select-none whitespace-nowrap transition-transform duration-200 ${isMenuOpen ? 'text-5xl scale-110' : 'text-3xl'}`}>
                  <span className={`inline-block transform transition-transform duration-200 ${isMenuOpen ? '-translate-y-1' : ''}`}>M</span>
                  <span className={`inline-block ${isMenuOpen ? 'ml-3' : 'ml-2'} transform transition-transform duration-200 ${isMenuOpen ? '-translate-y-1' : ''}`}>J</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Center: Desktop nav and centered logo */}
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/products"
                className="text-gray-300 hover:text-primary px-3 py-1 rounded-md text-base md:text-xl font-semibold transition-colors leading-none"
                onClick={closeMenu}
              >
                Productos
              </Link>

              <Link to="/" className="flex items-center px-2 mx-6 group" onClick={closeMenu} aria-label="Inicio">
                <span style={{ fontFamily: 'var(--font-logo)' }} className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight transition-transform duration-200 select-none group-hover:scale-105 group-hover:drop-shadow-lg whitespace-nowrap">
                  <span className="inline-block transform transition-transform duration-200 group-hover:-translate-y-1">M</span>
                  <span className="inline-block ml-3 transform transition-transform duration-200 group-hover:-translate-y-1">J</span>
                </span>
              </Link>

              <Link
                to="/about"
                className="text-gray-300 hover:text-primary px-3 py-1 rounded-md text-base md:text-xl font-semibold transition-colors leading-none"
                onClick={closeMenu}
              >
                Nosotros
              </Link>
            </div>
          </div>

          {/* Right: Desktop icons and Mobile cart+hamburger (same area) */}
          <div className="flex items-center space-x-4">
            {/* Desktop: cart + user dropdown */}
            <div className="hidden md:flex md:flex-1 items-center justify-end space-x-6">
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

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="flex items-center justify-center p-2 rounded-full text-gray-300 hover:text-primary hover:bg-sage-50/5 transition-all focus:outline-none"
                >
                  <span className="sr-only">Menú Usuario</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {isUserOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-card-bg border border-sage-200 rounded-xl shadow-2xl py-2 z-50 transform origin-top-right animate-fade-in-down">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-sage-200/50">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Hola,</p>
                          <p className="text-sm font-bold text-primary truncate">{user.name || 'Usuario'}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-sage-50/10 hover:text-red-400 transition-colors"
                        >
                          Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-sage-50/10 hover:text-primary transition-colors"
                          onClick={closeUserMenu}
                        >
                          Iniciar Sesión
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-sage-50/10 hover:text-primary transition-colors"
                          onClick={closeUserMenu}
                        >
                          Registrarse
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: cart + hamburger (visible only on small screens) */}
            <div className="flex md:hidden items-center space-x-4">
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
      </div>

      {/* Menú Móvil Desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-card-bg border-t border-sage-200 animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
