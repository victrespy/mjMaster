import React, { useState, useEffect } from 'react';
import reactLogo from '../assets/react.svg';
import Button from '../components/Button';

const Home = () => {
  const [count, setCount] = useState(0);
  const [backendMessage, setBackendMessage] = useState('Cargando...');

  useEffect(() => {
    // Usamos la URL correcta del backend (9443)
    fetch('https://localhost:9443/api/hello')
      .then(response => {
        if (!response.ok) throw new Error('Error de red');
        return response.json();
      })
      .then(data => setBackendMessage(data.message || 'Conectado correctamente'))
      .catch(error => setBackendMessage('Error conectando al backend. ¿Has aceptado el certificado en https://localhost:9443/api/hello?'));
  }, []);

  const isError = backendMessage.includes('Error');

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 text-center">
        
        {/* Hero Section */}
        <div className="animate-fade-in-up">
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="inline-block hover:scale-110 transition-transform duration-300">
            <img src={reactLogo} className="h-32 w-auto mx-auto animate-spin-slow filter drop-shadow-[0_0_10px_rgba(140,244,37,0.5)]" alt="React logo" />
          </a>
          <h1 className="mt-6 text-5xl font-extrabold text-primary tracking-tight">
            MJ Master <span className="text-gray-100">Growshop</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
            Tu tienda de confianza para el cultivo y parafernalia. Calidad premium, envíos discretos.
          </p>
        </div>
        
        {/* Backend Status Card */}
        <div className="bg-card-bg border border-sage-200/20 shadow-xl rounded-xl p-8 transform hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-200 mb-4 uppercase tracking-wider text-xs">Estado del Sistema</h2>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${isError ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-green-900/30 text-primary border border-primary/30'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${isError ? 'bg-red-500 animate-pulse' : 'bg-primary animate-pulse'}`}></span>
            {backendMessage}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-card-bg border border-sage-200/20 shadow-xl rounded-xl p-8 space-y-6">
          <p className="text-gray-400 text-sm uppercase tracking-wider">Zona de Pruebas</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => setCount((count) => count + 1)} 
              variant="primary"
              className="w-full sm:w-auto"
            >
              Contador: {count}
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={() => alert('¡Funcionalidad en desarrollo!')}
              className="w-full sm:w-auto bg-sage-200 text-gray-200 hover:bg-sage-100"
            >
              Ver Catálogo
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
