import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Botón reutilizable con Tailwind CSS
 * @param {string} variant - 'primary' | 'secondary' | 'danger' | 'outline' | 'danger-outline'
 * @param {React.ReactNode} children - Contenido del botón
 * @param className
 * @param {string} to - Si se proporciona, renderiza un Link de React Router
 * @param {string} href - Si se proporciona, renderiza un enlace <a>
 * @param {object} props - Resto de props (onClick, type, etc.)
 */
const Button = ({ variant = 'primary', children, className = '', to, href, ...props }) => {
  
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform active:scale-95 cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-dark-bg hover:bg-lime-400 focus:ring-primary shadow-md hover:shadow-primary/20",
    secondary: "bg-sage-200 text-gray-100 hover:bg-sage-100 focus:ring-sage-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-dark-bg",
    "danger-outline": "bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/50 focus:ring-red-500",
    // Variante específica para el Hero (botón secundario transparente con borde gris)
    "hero-secondary": "border border-gray-500 text-gray-300 hover:bg-white/10 hover:border-white hover:text-white backdrop-blur-sm",
  };

  const buttonClass = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={buttonClass} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={buttonClass} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
