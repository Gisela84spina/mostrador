import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HistorialVentas = () => {
  const navigate = useNavigate();
  const [dias, setDias] = useState([]);

  useEffect(() => {
    const diasGuardados = Object.keys(localStorage)
      .filter(k => k.startsWith("ventas_"))
      .map(k => k.replace("ventas_", ""))
      .sort((a, b) => b.localeCompare(a)); // más nuevo primero

    setDias(diasGuardados);
  }, []);
  
  return (
    <section className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Historial de ventas</h2>

      <button onClick={() => navigate("/ventas")}>
        ⬅ Volver
      </button>

      {dias.length === 0 && (
        <p className="text-gray-500">
          No hay ventas registradas
        </p>
      )}

      <ul className="space-y-3">
        {dias.map(fecha => (
          <li
            key={fecha}
            className="p-4 border rounded bg-white flex justify-between items-center"
          >
            <span className="font-semibold">{fecha}</span>

            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={() => navigate(`/historial/${fecha}`)}
            >
              Ver
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HistorialVentas;