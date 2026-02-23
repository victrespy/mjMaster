import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Rutas Públicas (con Header y Footer normales) */}
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

            {/* Rutas de Administración (con AdminLayout) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
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
