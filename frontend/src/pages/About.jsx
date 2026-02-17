import React from 'react';

const About = () => {
  return (
    <div className="max-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          Acerca del proyecto
        </h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 space-y-4 text-left">
          <p className="text-gray-700">
            Esta es una aplicación de demostración para mostrar cómo funciona
            el enrutamiento en React (SPA).
          </p>
          <p className="text-gray-700">
            El Header y el Footer se mantienen fijos, ¡solo cambia este contenido!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
