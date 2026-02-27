import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import Button from "../components/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        phone: formData.phone,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Error al registrar usuario.");
    }
  };

  return (
    // Fondo transparente para ver el humo
    <div className="flex min-h-[80vh] items-center justify-center bg-transparent py-12 relative z-10">
      <div className="w-full max-w-md rounded-lg bg-card-bg/90 backdrop-blur-sm p-8 shadow-2xl border border-sage-200/20">
        <h2 className="mb-6 text-center text-3xl font-bold text-primary tracking-tight">Crear Cuenta</h2>
        
        {error && (
          <div className="mb-4 rounded bg-red-900/30 border border-red-500/50 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded bg-green-900/30 border border-green-500/50 p-3 text-sm text-green-200">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300" htmlFor="name">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              className="w-full rounded bg-sage-50/50 border border-sage-200/50 px-3 py-2 text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-500 transition-colors"
              placeholder="Juan Cultivador"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded bg-sage-50/50 border border-sage-200/50 px-3 py-2 text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-500 transition-colors"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300" htmlFor="phone">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full rounded bg-sage-50/50 border border-sage-200/50 px-3 py-2 text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-500 transition-colors"
              placeholder="600 123 456"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300" htmlFor="address">
              Dirección de Envío
            </label>
            <input
              type="text"
              id="address"
              className="w-full rounded bg-sage-50/50 border border-sage-200/50 px-3 py-2 text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-500 transition-colors"
              placeholder="Calle del Cultivo 420, Madrid"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded bg-sage-50/50 border border-sage-200/50 px-3 py-2 text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-500 transition-colors"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full rounded bg-sage-50/50 border border-sage-200/50 px-3 py-2 text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-500 transition-colors"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full py-3 text-base shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5 mt-6">
            Registrarse
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:text-lime-300 hover:underline font-medium">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
