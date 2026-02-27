import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card-bg border-t border-sage-200/20 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-primary tracking-wide">MJ Master</span>
            <p className="text-sm text-gray-400 mt-1">Tu Growshop de confianza.</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Facebook</a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-sage-200/10 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MJ Master. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
