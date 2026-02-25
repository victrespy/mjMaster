import React, { useEffect, useState } from 'react';

import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CategoryList from '../components/CategoryList';
import Button from '../components/Button';
import { LeafShower } from '../components/LeafShower';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Obtenemos los últimos 8 productos añadidos
        const data = await getProducts(1, 8, null, { createdAt: 'desc' });
        setFeaturedProducts(data.items || []);
      } catch (error) {
        console.error("Error cargando destacados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* EFECTO DE HOJAS FIJAS (en fondo, z bajo) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <LeafShower />
      </div>

      {/* HERO SECTION */}
      <div className="relative h-[600px] w-full mb-12">
        {/* Imagen de fondo con máscara de transparencia */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-[20s]"
          style={{ 
            backgroundImage: "url('/hero.webp')",
            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in"
          }}
        >
          {/* Overlay general para oscurecer y mejorar legibilidad */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <span className="text-primary font-bold tracking-widest uppercase mb-4 animate-fade-in-up">
            Bienvenido a MJ Master
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight max-w-3xl animate-fade-in-up delay-100 drop-shadow-lg">
            Tu Cultivo, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-lime-400">
              Nuestra Pasión
            </span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-xl animate-fade-in-up delay-200 drop-shadow-md">
            Encuentra las mejores semillas, fertilizantes y parafernalia. 
            Calidad premium y envíos 100% discretos garantizados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
            <Button 
              to="/products" 
              variant="primary"
              className="px-8 py-4 text-base shadow-[0_0_20px_rgba(140,244,37,0.3)] hover:shadow-[0_0_30px_rgba(140,244,37,0.5)] transform hover:-translate-y-1"
            >
              Ver Catálogo
            </Button>
            <Button 
              to="/about" 
              variant="hero-secondary"
              className="px-8 py-4 text-base backdrop-blur-sm bg-black/30 border-white/20 hover:bg-black/50"
            >
              Sobre Nosotros
            </Button>
          </div>
        </div>
      </div>

      {/* CATEGORÍAS DESTACADAS */}
      <section className="py-8 bg-transparent relative z-10 -mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100 drop-shadow-lg">
            Explora por <span className="text-primary">Categorías</span>
          </h2>
          
          <CategoryList />

        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-16 bg-card-bg/50 backdrop-blur-sm border-y border-sage-200/10 relative z-10 rounded-xl my-12 mx-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-100">Novedades</h2>
              <p className="text-gray-400 mt-2">Lo último en llegar a nuestro catálogo</p>
            </div>
            <Button to="/products" variant="outline" className="hidden md:flex">
              Ver todo <span className="ml-2">→</span>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onOpen={handleOpenModal} 
                />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Button to="/products" variant="outline">
              Ver todo el catálogo
            </Button>
          </div>
        </div>
      </section>

      {/* VENTAJAS / FEATURES */}
      <section className="py-16 bg-transparent relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-card-bg/90 backdrop-blur-sm border border-sage-200/20 shadow-lg hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Calidad Garantizada</h3>
              <p className="text-gray-400">Seleccionamos solo los mejores productos de los bancos más prestigiosos.</p>
            </div>

            <div className="p-6 rounded-xl bg-card-bg/90 backdrop-blur-sm border border-sage-200/20 shadow-lg hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Envío Discreto</h3>
              <p className="text-gray-400">Paquetes sin logotipos ni referencias al contenido. Tu privacidad es sagrada.</p>
            </div>

            <div className="p-6 rounded-xl bg-card-bg/90 backdrop-blur-sm border border-sage-200/20 shadow-lg hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Envío Rápido 24/48h</h3>
              <p className="text-gray-400">Recibe tu pedido en tiempo récord en cualquier punto de la península.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Producto */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
        />
      )}

    </div>
  );
};

export default Home;
