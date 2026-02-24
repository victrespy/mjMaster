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
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={
              <div className="app-layout min-h-screen bg-dark-bg text-gray-100 font-display">
                <Header />
                <main className="app-main container mx-auto px-4 py-8">
                  <Home />
                </main>
                <Footer />
              </div>
            } />
            
            <Route path="/products" element={
              <div className="app-layout min-h-screen bg-dark-bg text-gray-100 font-display">
                <Header />
                <main className="app-main container mx-auto px-4 py-8">
                  <Products />
                </main>
                <Footer />
              </div>
            } />

            <Route path="/about" element={
              <div className="app-layout min-h-screen bg-dark-bg text-gray-100 font-display">
                <Header />
                <main className="app-main container mx-auto px-4 py-8">
                  <About />
                </main>
                <Footer />
              </div>
            } />

            <Route path="/cart" element={
              <div className="app-layout min-h-screen bg-dark-bg text-gray-100 font-display">
                <Header />
                <main className="app-main container mx-auto px-4 py-8">
                  <Cart />
                </main>
                <Footer />
              </div>
            } />

            <Route path="/login" element={
              <div className="app-layout min-h-screen bg-dark-bg text-gray-100 font-display">
                <Header />
                <main className="app-main container mx-auto px-4 py-8">
                  <Login />
                </main>
                <Footer />
              </div>
            } />

            <Route path="/register" element={
              <div className="app-layout min-h-screen bg-dark-bg text-gray-100 font-display">
                <Header />
                <main className="app-main container mx-auto px-4 py-8">
                  <Register />
                </main>
                <Footer />
              </div>
            } />

            {/* Ruta Protegida de Perfil */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="app-layout min-h-screen bg-dark-bg text-gray-100 font-display">
                  <Header />
                  <main className="app-main container mx-auto px-4 py-8">
                    <UserProfile />
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            } />

            {/* Rutas de Administración */}
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
              <div className="app-layout min-h-screen bg-dark-bg text-gray-100 font-display">
                <Header />
                <main className="app-main container mx-auto px-4 py-8">
                  <NotFound />
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
