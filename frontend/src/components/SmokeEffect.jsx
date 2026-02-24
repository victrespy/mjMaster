import React from 'react';

// Recuperamos el SVG de la voluta que te gustaba
const SmokeWisp = ({ className, style, opacity = 0.6 }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={`absolute ${className}`} 
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="smokeFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="warp" />
        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="20" in="SourceGraphic" in2="warp" />
      </filter>
    </defs>
    
    <path 
      d="M40,100 Q60,50 100,80 T160,80 T180,120 T140,160 T80,150 T40,100 Z" 
      fill="gray"
      fillOpacity={opacity}
      filter="url(#smokeFilter)"
      className="blur-sm"
    />
  </svg>
);

const SmokeEffect = () => {
  // Definimos la animación keyframes aquí para asegurarnos de que se aplica
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes floatUpInfinite {
      0% { transform: translateY(110vh) scale(0.8) rotate(0deg); opacity: 0; }
      10% { opacity: 0.5; }
      90% { opacity: 0.5; }
      100% { transform: translateY(-20vh) scale(1.5) rotate(20deg); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);

  // Generamos muchas volutas para asegurar flujo constante
  const wisps = [
    { id: 1, left: '10%', size: '500px', duration: '15s', delay: '0s' },
    { id: 2, left: '30%', size: '600px', duration: '18s', delay: '5s' },
    { id: 3, left: '50%', size: '550px', duration: '20s', delay: '2s' },
    { id: 4, left: '70%', size: '650px', duration: '16s', delay: '8s' },
    { id: 5, left: '20%', size: '450px', duration: '22s', delay: '12s' },
    { id: 6, left: '80%', size: '500px', duration: '19s', delay: '15s' },
    // Volutas extra para rellenar huecos
    { id: 7, left: '40%', size: '600px', duration: '25s', delay: '10s' },
    { id: 8, left: '60%', size: '500px', duration: '21s', delay: '3s' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {wisps.map((wisp) => (
        <div 
          key={wisp.id}
          className="absolute bottom-0 mix-blend-screen"
          style={{
            left: wisp.left,
            width: wisp.size,
            height: wisp.size,
            animation: `floatUpInfinite ${wisp.duration} linear infinite`,
            animationDelay: `-${wisp.delay}`, // Delay negativo para que empiecen ya en movimiento
            opacity: 0.6
          }}
        >
          <SmokeWisp className="w-full h-full" opacity={0.5} />
        </div>
      ))}
    </div>
  );
};

export default SmokeEffect;
