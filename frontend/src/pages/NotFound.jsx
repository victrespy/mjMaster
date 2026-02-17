import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="max-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Página no encontrada</h2>
        <p className="mt-2 text-sm text-gray-600">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        
        <div className="mt-6">
          <Link to="/" className="no-underline">
            <Button variant="primary">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
