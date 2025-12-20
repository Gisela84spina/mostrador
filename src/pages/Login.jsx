import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Si ya está logueado → redirigir
  useEffect(() => {
    if (localStorage.getItem("adminLogged") === "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const ADMIN_EMAIL = "sucule@tienda.com";
    const ADMIN_PASS = "1966";

    if (email.trim() === ADMIN_EMAIL && password.trim() === ADMIN_PASS) {
      localStorage.setItem("adminLogged", "true");
      navigate("/admin", { replace: true });
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#E6DDCF] to-[#C6CBB9]
">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-[#6A7F5A] hover:bg-[#7A8F6A]
          text-white py-2 rounded-lg font-semibold">
          Ingresar
        </button>
      </form>
    </div>
  );
}
