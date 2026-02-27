import React, { useState } from 'react';

// Importamos los componentes REALES del proyecto
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import SmokeEffect from '../components/SmokeEffect';

// Iconos SVG manuales para evitar dependencias externas
const Icons = {
  Palette: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><circle cx="12" cy="12" r="3"/><path d="m16 12 2 2"/><path d="m12 16 2 2"/><path d="m8 12-2 2"/><path d="m12 8-2-2"/></svg>
  ),
  Type: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
  ),
  Box: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  ),
  Wind: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  )
};

const StyleGuide = () => {
  const [tab, setTab] = useState('colors');

  return (
    <div className="min-h-screen bg-dark-bg text-gray-300 font-display selection:bg-primary/30 selection:text-primary overflow-x-hidden relative">
      
      <style>{`
        @keyframes leafPreviewFall {
          0% { transform: translateY(-120%) rotate(0deg) scale(1); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(120%) rotate(360deg) scale(1.2); opacity: 0; }
        }
        .animate-leaf-preview {
          animation: leafPreviewFall 6s linear infinite;
        }
        @keyframes smokePreviewFloat {
          0% { transform: translateY(100%) scale(0.8); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-100%) scale(1.5); opacity: 0; }
        }
        .animate-smoke-preview {
          animation: smokePreviewFloat 8s ease-in-out infinite;
        }
      `}</style>

      <SmokeEffect />
      
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-72 p-8 md:fixed h-full border-r border-sage-200/20 bg-dark-bg/95 backdrop-blur-xl">
          <div className="mb-12">
            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              <span className="text-primary">MJ</span> MASTER
            </h1>
            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Guía de Estilos Interactiva</p>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'colors', label: 'Colores', icon: Icons.Palette },
              { id: 'typography', label: 'Tipografía', icon: Icons.Type },
              { id: 'components', label: 'Componentes', icon: Icons.Box },
              { id: 'effects', label: 'Animaciones', icon: Icons.Wind },
            ].map(item => (
              <button key={item.id} onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  tab === item.id ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}>
                <item.icon /> {item.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-auto pt-12">
             <Button to="/about" variant="outline" className="w-full text-xs">Volver a Nosotros</Button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 md:ml-72 min-h-screen animate-fade-in-up">
          
          {tab === 'colors' && (
            <section className="space-y-12 max-w-5xl">
              <header>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Sistema Cromático</h2>
                <div className="h-1 w-20 bg-primary mt-2"></div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ColorBox name="Primary" hex="#8cf425" tailwind="bg-primary" desc="Color de marca. Usado para CTAs y elementos de acción." />
                <ColorBox name="Dark BG" hex="#121212" tailwind="bg-dark-bg" desc="Fondo principal. Proporciona el contraste necesario para el modo oscuro." />
                <ColorBox name="Card BG" hex="#1e1e1e" tailwind="bg-card-bg" desc="Superficies de tarjetas y contenedores secundarios." />
              </div>

              <div className="pt-8">
                <h3 className="text-xl font-bold text-white mb-6">Escala Sage (Botánica)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <ColorBox name="Sage 50" hex="#1e241a" tailwind="bg-sage-50" mini />
                  <ColorBox name="Sage 100" hex="#2a3325" tailwind="bg-sage-100" mini />
                  <ColorBox name="Sage 200" hex="#3d4a36" tailwind="bg-sage-200" mini />
                  <ColorBox name="Sage 500" hex="#8a9a7d" tailwind="bg-sage-500" mini />
                  <ColorBox name="Sage 900" hex="#0a0c08" tailwind="bg-sage-900" mini />
                </div>
              </div>
            </section>
          )}

          {tab === 'typography' && (
            <section className="space-y-12 max-w-5xl">
              <header>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Tipografía</h2>
                <div className="h-1 w-20 bg-primary mt-2"></div>
              </header>

              <div className="p-12 bg-card-bg border border-sage-200/20 rounded-2xl shadow-2xl">
                <div className="space-y-10">
                  <div>
                    <h1 className="text-7xl font-black text-white italic tracking-tighter leading-none">MJ MASTER DISPLAY</h1>
                    <p className="text-primary font-mono text-xs mt-3 uppercase tracking-widest">font-black italic tracking-tighter</p>
                  </div>
                  <div className="pt-4">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">La revolución del growshop moderno comienza aquí.</h2>
                    <p className="text-primary font-mono text-xs mt-3 uppercase tracking-widest">font-extrabold tracking-tight</p>
                  </div>
                  <div className="max-w-3xl pt-4">
                    <p className="text-lg text-gray-300 leading-relaxed">
                      El cuerpo de texto está optimizado para interfaces oscuras. Usamos la fuente Inter por su versatilidad y claridad técnica.
                    </p>
                    <p className="text-primary font-mono text-xs mt-3 uppercase tracking-widest">text-gray-300 leading-relaxed</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tab === 'components' && (
            <section className="space-y-12 max-w-6xl">
              <header>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Biblioteca de UI</h2>
                <div className="h-1 w-20 bg-primary mt-2"></div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-white border-l-4 border-primary pl-4 uppercase tracking-wider">Botones</h3>
                  <div className="flex flex-wrap gap-4 bg-card-bg p-8 rounded-xl border border-sage-200/10">
                    <Button variant="primary">Primario</Button>
                    <Button variant="secondary">Secundario</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="hero-secondary">Hero Secondary</Button>
                    <Button variant="danger">Peligro</Button>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-white border-l-4 border-primary pl-4 uppercase tracking-wider">Categoría</h3>
                  <div className="max-w-sm">
                    <CategoryCard category={{ name: 'Semillas Feminizadas', picture: null }} />
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8 pt-8">
                  <h3 className="text-xl font-bold text-white border-l-4 border-primary pl-4 uppercase tracking-wider">Productos (Cards)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ProductCard product={{ name: 'Amnesia Haze (3 uds)', price: 25.50, stock: 100, picture: null }} />
                    <ProductCard product={{ name: 'Kit Iluminación LED', price: 180.00, stock: 5, picture: null }} />
                    <ProductCard product={{ name: 'Grinder Metálico', price: 12.00, stock: 0, picture: null }} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {tab === 'effects' && (
            <section className="space-y-12 max-w-5xl">
              <header>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Atmósfera & Movimiento</h2>
                <div className="h-1 w-20 bg-primary mt-2"></div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-card-bg border border-sage-200/20 rounded-3xl overflow-hidden relative group">
                   <h4 className="text-white font-bold text-xl mb-4">Efecto: Leaf Shower</h4>
                   <p className="text-sm text-gray-400 mb-8">Hojas orgánicas que flotan aleatoriamente para dar vida a la interfaz.</p>
                   <div className="h-64 bg-black/40 rounded-xl relative overflow-hidden flex items-center justify-center">
                      <img 
                        src="/mj-magic.webp" 
                        alt="Hoja animada" 
                        className="w-32 h-32 object-contain animate-leaf-preview drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                      />
                      <div className="absolute inset-0 flex items-end justify-center pb-4 text-primary/30 font-bold text-[10px] uppercase tracking-widest">Animación Individual</div>
                   </div>
                </div>

                <div className="p-10 bg-card-bg border border-sage-200/20 rounded-3xl relative group overflow-hidden">
                  <h4 className="text-white font-bold text-xl mb-4">Efecto: Animación de Humo</h4>
                  <p className="text-sm text-gray-400 mb-8">Volutas de humo dinámicas que aportan profundidad y atmósfera.</p>
                  <div className="h-64 bg-black/40 rounded-xl relative overflow-hidden flex items-center justify-center">
                    {/* Mini Smoke Preview */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="w-48 h-48 animate-smoke-preview text-primary/20" fill="currentColor">
                        <path d="M40,100 Q60,50 100,80 T160,80 T180,120 T140,160 T80,150 T40,100 Z" className="blur-md" />
                      </svg>
                      <svg viewBox="0 0 200 200" className="w-64 h-64 animate-smoke-preview text-primary/10" style={{ animationDelay: '-4s' }} fill="currentColor">
                        <path d="M40,100 Q60,50 100,80 T160,80 T180,120 T140,160 T80,150 T40,100 Z" className="blur-xl" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex items-end justify-center pb-4 text-primary/30 font-bold text-[10px] uppercase tracking-widest">Vista Previa Humo</div>
                  </div>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

const ColorBox = ({ name, hex, tailwind, desc, mini }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-card-bg border border-sage-200/10 rounded-2xl transition-all hover:border-primary/50 group ${mini ? 'p-3' : 'p-5'}`}>
      <div 
        className={`w-full ${mini ? 'h-12' : 'h-24'} rounded-xl cursor-pointer flex items-center justify-center relative shadow-inner mb-4 overflow-hidden`}
        style={{ backgroundColor: hex }}
        onClick={copy}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          {copied ? <Icons.Check /> : <Icons.Copy />}
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold text-sm">{name}</h4>
        <p className="text-primary font-mono text-[10px] mt-0.5">{hex}</p>
        {!mini && <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">{desc}</p>}
      </div>
    </div>
  );
};

export default StyleGuide;
