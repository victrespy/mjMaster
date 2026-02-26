import React, { useEffect, useState, useRef } from 'react';

// 4 hojas por lado -> 8 en total
const LEAVES_COUNT = 8;
const IMAGE_SRC = (typeof import.meta !== 'undefined' && import.meta.url) ? new URL('/mj-magic.webp', import.meta.url).href : '/mj-magic.webp';

const rand = (min, max) => Math.random() * (max - min) + min;

export function LeafShower() {
  const [leaves, setLeaves] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const imgLoaded = useRef(false);

  useEffect(() => {
    // Precargar imagen
    const img = new Image();
    img.src = IMAGE_SRC;
    img.onload = () => { imgLoaded.current = true; };

    // Detectar si es móvil para ajustar posición vertical
    const isMobile = window.innerWidth < 768;

    // Generar las 8 hojas con sus propiedades
    const newLeaves = [];
    
    for (let i = 0; i < LEAVES_COUNT; i++) {
      const isLeft = i % 2 === 0;
      
      // Trigger: momento en el que la hoja "cae". Distribuido a lo largo del scroll.
      const triggerPercent = 10 + (i * (80 / LEAVES_COUNT));

      // Posición final en la esquina inferior (acumulación)
      const minBottom = isMobile ? -35 : -25;
      const maxBottom = isMobile ? 5 : 15;
      const finalBottom = rand(minBottom, maxBottom);
      
      // Offset lateral:
      let finalSideOffset;
      if (isLeft) {
        // Hojas izquierdas: ajustado para que no se metan tanto en medio
        // Antes: -10 a 15 (muy adentro). Ahora: -15 a 5 (más sutil)
        finalSideOffset = rand(-15, 5); 
      } else {
        // Hojas derechas: más afuera de la pantalla
        finalSideOffset = rand(-25, 0);
      }

      newLeaves.push({
        id: i,
        triggerPercent: triggerPercent,
        side: isLeft ? 'left' : 'right',
        
        finalBottom: `${finalBottom}%`,
        finalSideOffset: `${finalSideOffset}vw`,
        
        rotate: rand(-180, 180), 
        scale: rand(1.1, 1.6), 
        duration: rand(1.0, 1.8), 
      });
    }
    setLeaves(newLeaves);

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const scrollPercent = (currentScroll / docHeight) * 100;
      setScrollY(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {leaves.map((leaf) => {
        const hasFallen = scrollY > leaf.triggerPercent;

        const style = {
          position: 'absolute',
          [leaf.side]: leaf.finalSideOffset,
          
          // Tamaño reducido un ~10% respecto a la versión anterior
          width: '20vw', 
          maxWidth: '270px',
          minWidth: '135px',
          
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
        };

        if (hasFallen) {
          // Estado: Caída / En el suelo
          style.bottom = leaf.finalBottom;
          style.opacity = 1;
          style.transform = `rotate(${leaf.rotate}deg) scale(${leaf.scale})`;
          // Transición suave al caer
          style.transition = `bottom ${leaf.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease-in, transform ${leaf.duration}s ease-out`;
        } else {
          // Estado: Arriba / Oculta (Reset)
          style.bottom = '110vh'; 
          style.opacity = 0;
          style.transform = `rotate(0deg) scale(${leaf.scale})`;
          
          // Transición de salida (desvanecimiento)
          style.transition = 'opacity 1s ease-out, bottom 0s linear 1s, transform 1s ease-out';
        }

        return (
          <img
            key={leaf.id}
            src={IMAGE_SRC}
            alt=""
            aria-hidden="true"
            style={style}
          />
        );
      })}
    </div>
  );
}
