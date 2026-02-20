import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import viteLogo from '/vite.svg';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-green-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-8" src={viteLogo} alt="Logo" />
              <span className="ml-2 text-xl font-bold text-white">MJ Master</span>
            </Link>
          </div>

          {/* Navegación Principal */}
          <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/" className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">
              Catálogo
            </Link>
            <Link to="/about" className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">
              Nosotros
            </Link>
          </nav>

          {/* Área de Usuario */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white text-sm">Hola, Usuario</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-green-700 hover:bg-gray-100 px-4 py-2 rounded font-bold text-sm transition"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
