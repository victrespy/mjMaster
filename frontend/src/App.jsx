import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './layout/Header';
import Footer from './layout/Footer';
import AdminLayout from './layout/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import SmokeEffect from './components/SmokeEffect'; // Importamos el efecto
import './App.css';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen bg-dark-bg"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-layout min-h-screen bg-dark-bg text-gray-100 font-display relative overflow-hidden">
            
            {/* EFECTO DE HUMO GLOBAL */}
            <div className="fixed inset-0 pointer-events-none z-5">
              <SmokeEffect />
            </div>

            {/* Contenido principal con z-index superior */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={
                  <>
                    <Header />
                    <main className="app-main container mx-auto px-4 py-8 flex-grow z-3">
                      <Home />
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/products" element={
                  <>
                    <Header />
                    <main className="app-main container mx-auto px-4 py-8 flex-grow">
                      <Products />
                    </main>
                    <Footer />
                  </>
                } />

                <Route path="/about" element={
                  <>
                    <Header />
                    <main className="app-main container mx-auto px-4 py-8 flex-grow">
                      <About />
                    </main>
                    <Footer />
                  </>
                } />

                <Route path="/cart" element={
                  <>
                    <Header />
                    <main className="app-main container mx-auto px-4 py-8 flex-grow">
                      <Cart />
                    </main>
                    <Footer />
                  </>
                } />

                <Route path="/login" element={
                  <>
                    <Header />
                    <main className="app-main container mx-auto px-4 py-8 flex-grow">
                      <Login />
                    </main>
                    <Footer />
                  </>
                } />

                <Route path="/register" element={
                  <>
                    <Header />
                    <main className="app-main container mx-auto px-4 py-8 flex-grow">
                      <Register />
                    </main>
                    <Footer />
                  </>
                } />

                {/* Ruta Protegida de Perfil */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Header />
                    <main className="app-main container mx-auto px-4 py-8 flex-grow">
                      <UserProfile />
                    </main>
                    <Footer />
                  </ProtectedRoute>
                } />

                {/* Rutas de Administración (con AdminLayout) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="reviews" element={<AdminReviews />} />
                </Route>
                
                {/* Ruta Comodín (404) */}
                <Route path="*" element={
                  <>
                    <Header />
                    <main className="app-main container mx-auto px-4 py-8 flex-grow">
                      <NotFound />
                    </main>
                    <Footer />
                  </>
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
