import React, { useEffect, useState, useRef } from 'react';

// Queremos 4 hojas por lado (8 en total)
const PER_SIDE = 4;
const MAX_LEAVES = PER_SIDE * 2;
// Usar import.meta.url para construir un path seguro en Vite/ESM
const IMAGE_SRC = (typeof import.meta !== 'undefined' && import.meta.url) ? new URL('/mj-magic.webp', import.meta.url).href : '/mj-magic.webp';
const ANIM_DURATION = 600; // ms

const rand = (min, max) => Math.random() * (max - min) + min;

// Genera un array de "bottom" espaciados entre minBottom y maxBottom (en %), con un pequeño jitter
function generateBottoms(count, minBottom = 0, maxBottom = 18) {
  if (count <= 0) return [];
  const step = (maxBottom - minBottom) / Math.max(1, count - 1);
  return Array.from({ length: count }).map((_, i) => {
    const base = minBottom + step * i;
    const jitter = rand(-Math.min(2, step / 2), Math.min(2, step / 2));
    const val = Math.max(minBottom, Math.min(maxBottom, base + jitter));
    return `${val.toFixed(1)}%`;
  });
}

// Genera posiciones (bottom, corner, xOffset) espaciadas para un lote de hojas
function generatePositions(count, minBottom = 2, maxBottom = 22, minX = 2, maxX = 30) {
  const bottoms = generateBottoms(count, minBottom, maxBottom);
  if (count === 0) return [];
  return bottoms.map((b, i) => {
    // alternamos esquinas para dispersar a izquierda/derecha
    const corner = i % 2 === 0 ? 'left' : 'right';
    // fracción para espaciar el xOffset dentro del rango
    const frac = count === 1 ? 0.5 : i / (count - 1);
    // invertir fracción para alguna variedad
    const adj = 0.15 + frac * 0.85;
    const xOffset = (minX + adj * (maxX - minX)) + rand(-3, 3);
    return { bottom: b, corner, xOffset: Number(xOffset.toFixed(1)) };
  });
}

// Genera posiciones simétricas: por cada posición produce una izquierda y una derecha con la misma 'bottom'
function generateSymmetricPositions(pairsCount, minBottom = 2, maxBottom = 20, minX = 1, maxX = 6) {
  if (pairsCount <= 0) return [];
  const bottoms = generateBottoms(pairsCount, minBottom, maxBottom);
  const positions = [];
  for (let i = 0; i < pairsCount; i++) {
    const b = bottoms[i];
    // xOffset diferente ligeramente para izquierda/derecha
    const baseFrac = pairsCount === 1 ? 0.5 : i / (pairsCount - 1);
    const adj = 0.2 + baseFrac * 0.8;
    // generar offsets modestos y positivos (entrando en pantalla)
    const leftX = Number((minX + adj * (maxX - minX) + rand(-1.5, 1.5)).toFixed(1));
    const rightX = Number((minX + (1 - adj) * (maxX - minX) + rand(-1.5, 1.5)).toFixed(1));
    positions.push({ bottom: b, corner: 'left', xOffset: leftX });
    positions.push({ bottom: b, corner: 'right', xOffset: rightX });
  }
  return positions;
}

function makeLeaf(id) {
  return {
    id,
    corner: Math.random() < 0.5 ? 'left' : 'right',
    // bottom por defecto (puede ser sobrescrito cuando se generen lotes espaciados)
    bottom: `${rand(0, 10).toFixed(1)}%`,
    // rotación ligeramente más moderada
    rotate: rand(-30, 30).toFixed(1),
    scale: rand(0.9, 1.25).toFixed(2),
    // xOffset en vw moderado para que entren más en la pantalla
    xOffset: rand(3, 18).toFixed(1),
    delay: Math.round(rand(0, 400)),
    visible: true,
  };
}

export function LeafShower() {
  const [leaves, setLeaves] = useState([]);
  const targetRef = useRef(0);
  const ticking = useRef(false);
  const imgLoaded = useRef(false);

  useEffect(() => {
    // precargar imagen y comprobar si está accesible
    const img = new Image();
    img.src = IMAGE_SRC;
    img.onload = () => {
      imgLoaded.current = true;
      if (process.env.NODE_ENV !== 'production') console.log('[LeafShower] image preloaded:', IMAGE_SRC);
    };
    img.onerror = (e) => {
      if (process.env.NODE_ENV !== 'production') console.warn('[LeafShower] error loading image', IMAGE_SRC, e);
    };

    // Mostrar hojas simétricas inmediatamente al montar para asegurar visibilidad
    if (window) {
      const pairs = PER_SIDE; // 4 pares -> 8 hojas
      // generar en las esquinas inferiores (bottom pequeño) con más separación vertical
      const positions = generateSymmetricPositions(pairs, 2, 20, 1, 6);
      setLeaves(() => positions.map((p, i) => {
        const leaf = makeLeaf(Date.now() + i);
        return { ...leaf, bottom: p.bottom, corner: p.corner, xOffset: p.xOffset };
      }));
    }

    // initialize minimal set (none)
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollY = window.scrollY || doc.scrollTop;
        // Más sensibles: cada ~20px aparece una hoja (aparecen mucho más rápido)
        const targetCount = Math.min(MAX_LEAVES, Math.floor(scrollY / 20));
        if (process.env.NODE_ENV !== 'production') console.log('[LeafShower] scrollY', Math.round(scrollY), 'targetCount', targetCount);
        updateLeaves(targetCount);
        ticking.current = false;
      });
    };

    // also update on resize (document height changes)
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // initial call in case page already scrolled
    onScroll();

    // Fallback: si no se generan hojas por scroll, crear los pares completos
    const fallbackTimer = setTimeout(() => {
      setLeaves((prev) => (prev.length === 0 ? (() => {
        const positions = generateSymmetricPositions(PER_SIDE, 2, 20, 1, 6);
        return positions.map((p, i) => ({ ...makeLeaf(Date.now() + i), bottom: p.bottom, corner: p.corner, xOffset: p.xOffset }));
      })() : prev));
    }, 200);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const updateLeaves = (targetCount) => {
    targetRef.current = targetCount;
    setLeaves((prev) => {
      const current = prev.length;
      if (targetCount === current) return prev;

      if (targetCount > current) {
        // Añadimos en pares: convertir targetCount a número de pares deseados
        const desiredPairs = Math.floor(targetCount / 2);
        const currentPairs = Math.floor(current / 2);
        const toAddPairs = Math.max(0, Math.min(PER_SIDE - currentPairs, desiredPairs - currentPairs));
        if (toAddPairs <= 0) return prev;
        const positions = generateSymmetricPositions(toAddPairs, 2, 20, 1, 6); // genera 2*toAddPairs posiciones
        const newOnes = positions.map((p, i) => ({ ...makeLeaf(Date.now() + Math.random() * 10000 + i), bottom: p.bottom, corner: p.corner, xOffset: p.xOffset }));
        return [...prev, ...newOnes];
      }

      // targetCount < current -> mark some leaves invisible and remove after animation
      const removeCount = current - targetCount;
      const newArr = prev.slice(0); // copy
      let removed = 0;
      // prefer to remove newest ones (from end)
      for (let i = newArr.length - 1; i >= 0 && removed < removeCount; i--) {
        if (newArr[i].visible) {
          newArr[i] = { ...newArr[i], visible: false };
          removed++;
        }
      }

      // schedule actual removal after animation
      setTimeout(() => {
        setLeaves((latest) => latest.filter((l) => l.visible));
      }, ANIM_DURATION + 50);

      return newArr;
    });
  };

  // debug: imprimir número de hojas cuando cambie (útil para comprobar en consola)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[LeafShower] leaves count =', leaves.length);
    }
  }, [leaves]);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 9999 }}>
      {leaves.map((leaf) => {
        const offset = `${-Math.max(2, Number(leaf.xOffset))}vw`; // al menos -2vw para que entren más en la pantalla
        const style = {
          position: 'fixed',
          bottom: leaf.bottom,
          // posicionamos con offset negativo moderado para que entren en el viewport
          [leaf.corner]: offset,
          transform: `rotate(${leaf.rotate}deg) scale(${leaf.scale})`,
          transition: `opacity ${ANIM_DURATION}ms ease, transform ${ANIM_DURATION + 200}ms cubic-bezier(0.2,0.9,0.2,1)`,
          opacity: leaf.visible ? 1 : 0,
          width: '20vw',
          maxWidth: '260px',
          minWidth: '100px',
          pointerEvents: 'none',
          zIndex: 9999,
          // slight blur/shadow for depth
          filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.45))',
          // keep parts hidden by default because translateX moves them off-canvas
        };

        // add a tiny entrance vertical offset when becoming visible to feel like "emerging"
        style.transform = style.transform + (leaf.visible ? ' translateY(0)' : ' translateY(12px)');

        // Si la imagen no carga, mostrar un placeholder visible en desarrollo
        if (!imgLoaded.current && process.env.NODE_ENV !== 'production') {
          return (
            <div key={leaf.id} style={{ ...style, background: 'linear-gradient(45deg,#84cc16,#06b6d4)', display: 'block' }} />
          );
        }

        return (
          <img
            key={leaf.id}
            src={IMAGE_SRC}
            alt="hoja decorativa"
            aria-hidden
            onError={(e) => { if (process.env.NODE_ENV !== 'production') console.warn('[LeafShower] img onError', e); }}
            style={style}
            className="leaf-shower-image"
          />
        );
      })}

      {/* Dev badge para confirmar montaje y número de hojas */}
      {process.env.NODE_ENV !== 'production' && (
        <div style={{ position: 'fixed', right: 12, top: 12, zIndex: 10000, background: 'rgba(0,0,0,0.6)', color: '#d1fae5', padding: '6px 10px', borderRadius: 8, fontSize: 12, pointerEvents: 'auto' }}>
          Leaves: {leaves.length} • ImgLoaded: {imgLoaded.current ? 'yes' : 'no'}
        </div>
      )}
    </div>
  );
}
