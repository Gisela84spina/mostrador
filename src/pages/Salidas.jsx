import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Salidas = () => {
  const navigate = useNavigate();

  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");

  const hoy = new Date().toISOString().slice(0, 10);
  const key = `ventas_${hoy}`;

  const [categoria, setCategoria] = useState("");


  const guardarSalida = () => {
    if (!concepto || !categoria || !monto || Number(monto) <= 0) {
        alert("Completá concepto, tipo de salida y monto válido");
        return;
      }
      

    const salida = {
      id: Date.now(),
      fecha: hoy,
      hora: new Date().toLocaleTimeString(),
      type: "expense",
      categoria,
      concepto,
      total: Number(monto),
    };

    const movimientos =
      JSON.parse(localStorage.getItem(key)) || [];

    localStorage.setItem(
      key,
      JSON.stringify([...movimientos, salida])
    );

    alert("Salida registrada");

    setConcepto("");
    setMonto("");
    setCategoria("");
  };

  return (
    <section className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Registrar salida</h2>

      <input
        type="text"
        placeholder="Concepto (alquiler, luz, proveedor...)"
        value={concepto}
        onChange={e => setConcepto(e.target.value)}
        className="w-full border p-2 rounded"
      />

<select
  value={categoria}
  onChange={e => setCategoria(e.target.value)}
  className="border p-2 rounded w-full"
>
  <option value="">Tipo de salida</option>
  <option value="proveedor">Proveedor</option>
  <option value="servicio">Servicio</option>
  <option value="alquiler">Alquiler</option>
  <option value="impuesto">Impuesto</option>
  <option value="otro">Otro</option>
</select>


      <input
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={e => setMonto(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={guardarSalida}
        className="bg-red-700 text-white w-full p-3 rounded"
      >
        Guardar salida
      </button>

      <button
        onClick={() => navigate("/admin")}
        className="underline text-sm"
      >
        Volver a admin
      </button>
    </section>
  );
};

export default Salidas;
