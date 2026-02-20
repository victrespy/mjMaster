import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '/logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  const cartCount = getCartCount();

  return (
    <header className="bg-card-bg border-b border-sage-200 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <img className="h-8 w-8 transition-transform group-hover:scale-110" src={logo} alt="Logo" />
              <span className="ml-2 text-xl font-bold text-primary tracking-wide">MJ Master</span>
            </Link>
          </div>

          {/* Navegación Principal */}
          <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
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

          {/* Área de Usuario y Carrito */}
          <div className="flex items-center space-x-4">
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
                <span className="text-gray-300 text-sm hidden sm:inline">Hola, <span className="text-primary font-semibold">{user.name || 'Usuario'}</span></span>
                <button
                  onClick={logout}
                  className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/50 px-3 py-1 rounded text-sm transition-all"
                >
                  Salir
                </button>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
