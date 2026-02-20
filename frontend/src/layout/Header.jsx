import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import viteLogo from '/vite.svg';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-card-bg border-b border-sage-200 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <img className="h-8 w-8 transition-transform group-hover:scale-110" src={viteLogo} alt="Logo" />
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

          {/* Área de Usuario */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-300 text-sm hidden sm:inline">Hola, <span className="text-primary font-semibold">Usuario</span></span>
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
