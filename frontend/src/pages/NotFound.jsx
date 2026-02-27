import React from 'react';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-9xl font-extrabold text-primary animate-pulse">404</h1>
        <h2 className="mt-6 text-3xl font-bold text-gray-100">Página no encontrada</h2>
        <p className="mt-2 text-lg text-gray-400">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        
        <div className="mt-8">
          <Button to="/" variant="primary" className="px-8 py-3 text-base">
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
