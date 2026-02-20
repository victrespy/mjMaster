import React from 'react';

/**
 * Botón reutilizable con Tailwind CSS
 * @param {string} variant - 'primary' | 'secondary' | 'danger' | 'outline'
 * @param {React.ReactNode} children - Contenido del botón
 * @param className
 * @param {object} props - Resto de props (onClick, type, etc.)
 */
const Button = ({ variant = 'primary', children, className = '', ...props }) => {
  
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform active:scale-95";
  
  const variants = {
    primary: "bg-primary text-dark-bg hover:bg-lime-400 focus:ring-primary shadow-md hover:shadow-primary/20",
    secondary: "bg-sage-200 text-gray-100 hover:bg-sage-100 focus:ring-sage-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-dark-bg",
  };

  const buttonClass = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
