# 🌿 Guía de Estilos: MJ Master E-commerce

Esta guía define la identidad visual y el sistema de diseño de **MJ Master**. El objetivo es mantener la coherencia entre lo orgánico y lo tecnológico.

---

## 1. Paleta de Colores

### 1.1 Colores de Marca
| Color | Muestra | HEX | Clase Tailwind | Uso |
| :--- | :---: | :--- | :--- | :--- |
| **Primary** | <img src="https://via.placeholder.com/50/8cf425?text=+" /> | `#8cf425` | `text-primary` | CTAs y acentos vibrantes. |
| **Dark BG** | <img src="https://via.placeholder.com/50/121212?text=+" /> | `#121212` | `bg-dark-bg` | Fondo base profundo. |
| **Card BG** | <img src="https://via.placeholder.com/50/1e1e1e?text=+" /> | `#1e1e1e` | `bg-card-bg` | Superficies elevadas. |

### 1.2 Escala Sage (Verdes Botánicos)
| Nivel | Muestra | HEX | Uso |
| :--- | :---: | :--- | :--- |
| **Sage 50** | <img src="https://via.placeholder.com/30/1e241a?text=+" /> | `#1e241a` | Fondos de inputs y detalles sutiles. |
| **Sage 100** | <img src="https://via.placeholder.com/30/2a3325?text=+" /> | `#2a3325` | Bordes de tarjetas y separadores. |
| **Sage 200** | <img src="https://via.placeholder.com/30/3d4a36?text=+" /> | `#3d4a36` | Bordes destacados y estados hover. |
| **Sage 500** | <img src="https://via.placeholder.com/30/8a9a7d?text=+" /> | `#8a9a7d` | Textos secundarios y leyendas. |

---

## 2. Tipografía

Usamos **Inter** para todo el sistema por su legibilidad técnica y moderna.

- **Titulares:** `font-extrabold`, `tracking-tight`, `text-white`.
- **Cuerpo:** `font-normal`, `text-gray-300`.

---

## 3. Componentes Visuales

### 3.1 Botones (Buttons)

#### **Botón Primario**
Representa la acción principal. Verde neón con texto oscuro.
```html
<!-- Ejemplo Visual -->
<div style="background-color: #8cf425; color: black; padding: 10px 20px; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 0 15px rgba(140, 244, 37, 0.3);">
  AÑADIR AL CARRITO
</div>
```
*Clases:* `bg-primary text-black font-bold rounded-lg shadow-lg hover:scale-105 transition-transform`

#### **Botón Secundario (Glass)**
Para acciones secundarias. Fondo oscuro traslúcido.
```html
<!-- Ejemplo Visual -->
<div style="background-color: rgba(0,0,0,0.3); color: white; padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(4px); display: inline-block;">
  SABER MÁS
</div>
```
*Clases:* `bg-black/30 backdrop-blur-sm border border-white/10 text-white rounded-lg`

---

### 3.2 Tarjetas (Cards)

Las tarjetas utilizan el concepto de **elevación por color**, no por sombra pesada.

- **Borde:** `border border-sage-200/20`
- **Fondo:** `bg-card-bg`
- **Efecto Hover:** El borde aumenta su opacidad a `border-primary/50`.

---

## 4. Efectos Ambientales (Atmósfera)

MJ Master no es una tienda estática; vive a través de sus efectos:

### 4.1 Smoke Effect (`SmokeEffect.jsx`)
- **Técnica:** Canvas 2D con partículas alpha.
- **Propósito:** Aporta una sensación de profundidad y "humo" que refuerza la temática del Growshop.
- **Uso:** Fondo global de la aplicación, visible en zonas con transparencia (`bg-transparent`).

### 4.2 Leaf Shower (`LeafShower.jsx`)
- **Técnica:** Animación CSS `float-up` con rotación aleatoria.
- **Propósito:** Dinamismo botánico. Las hojas caen/flotan suavemente por la pantalla.
- **Configuración:** 
  - Opacidad: `0.4` a `0.6`.
  - Velocidad: Lenta (`15s` de duración) para no distraer de la compra.

---

## 5. Guía de Espaciado y Formas

- **Redondez:** Usamos `0.75rem` (`rounded-xl`) como estándar para suavizar la interfaz tecnológica.
- **Contenedores:** `max-w-7xl mx-auto px-4` para mantener el contenido centrado y respirable.
- **Grids:**
  - Móvil: 2 columnas.
  - Desktop: 4 a 6 columnas (Categorías).

---

## 6. Accesibilidad (A11y)

1. **Contraste:** El texto principal es siempre `white` o `gray-100` sobre el fondo `#121212` (Ratio > 7:1).
2. **Interactividad:** Todos los elementos clicables tienen un estado `:hover` visualmente distinto (cambio de color o escala).
3. **Lectura:** Uso de `leading-relaxed` en párrafos largos para evitar la fatiga visual en modo oscuro.

---
*Documento de referencia para el equipo de desarrollo de MJ Master.*
