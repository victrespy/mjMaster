import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/"); // Redirigir al home o dashboard
      } else {
        setError("Credenciales incorrectas. Inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    // Quitamos bg-dark-bg para que se vea el humo de fondo
    <div className="flex min-h-[80vh] items-center justify-center bg-transparent relative z-10">
      <div className="w-full max-w-md rounded-lg bg-card-bg/90 backdrop-blur-sm p-8 shadow-2xl border border-sage-200/20">
        <h2 className="mb-6 text-center text-3xl font-bold text-primary tracking-tight">Iniciar Sesión</h2>
        
        {error && (
          <div className="mb-4 rounded bg-red-900/30 border border-red-500/50 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-300" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded bg-sage-50/50 border border-sage-200/50 px-3 py-2 text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-500 transition-colors"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-300" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded bg-sage-50/50 border border-sage-200/50 px-3 py-2 text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-500 transition-colors"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full py-3 text-base shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿No tienes cuenta? <Link to="/register" className="text-primary hover:text-lime-300 hover:underline font-medium">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
