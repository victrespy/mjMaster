import React, { useState, useEffect } from 'react';
import reactLogo from '../assets/react.svg';
import Button from '../components/Button';

const Home = () => {
  const [count, setCount] = useState(0);
  const [backendMessage, setBackendMessage] = useState('Cargando...');

  useEffect(() => {
    fetch('https://localhost:9443/api/hello')
      .then(response => response.json())
      .then(data => setBackendMessage(data.message))
      .catch(error => setBackendMessage('Error conectando al backend: ' + error));
  }, []);

  const isError = backendMessage.includes('Error');

  return (
    <div className="max-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="inline-block">
            <img src={reactLogo} className="h-24 w-auto mx-auto animate-spin" alt="React logo" />
          </a>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bienvenido a Project Skeleton
          </h1>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 mb-2">Estado del Backend:</h2>
          <p className={`text-sm font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
            {backendMessage}
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 space-y-4">
          <p className="text-gray-500">Ejemplo de interactividad:</p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
            <Button onClick={() => setCount((count) => count + 1)} variant="primary">
              Contador es {count}
            </Button>
            
            <Button variant="secondary" onClick={() => alert('Hola')}>
                Botón Secundario
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
