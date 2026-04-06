import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ModalDevolucion from "../components/ModalDevolucion";
import { cantidadDevuelta } from "../utils/devoluciones";


const HistorialDia = () => {
  const { fecha } = useParams();
  const navigate = useNavigate();

  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);




  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem(`ventas_${fecha}`)
    ) || [];
    setVentas(data);
  }, [fecha]);

  const confirmarDevolucion = cantidades => {
    const hoy = new Date().toISOString().slice(0, 10);
  
    const itemsDevueltos = ventaSeleccionada.items
      .filter(item => cantidades[item.id] > 0)
      .map(item => ({
        ...item,
        cantidad: cantidades[item.id],
      }));
  
    if (itemsDevueltos.length === 0) {
      alert("No seleccionaste productos");
      return;
    }



  
    const total = itemsDevueltos.reduce(
      (acc, i) => acc + i.precio * i.cantidad,
      0
    );
  
    const devolucion = {
      id: Date.now(),
      fecha: hoy,
      hora: new Date().toLocaleTimeString(),
      type: "refund",
      originalId: ventaSeleccionada.id,
      items: itemsDevueltos,
      total
    };
  
    const keyHoy = `ventas_${hoy}`;
    const ventasHoy = JSON.parse(localStorage.getItem(keyHoy)) || [];
    localStorage.setItem(
      keyHoy,
      JSON.stringify([...ventasHoy, devolucion])
    );
  
    const historial =
      JSON.parse(localStorage.getItem("devoluciones_globales")) || [];
  
    localStorage.setItem(
      "devoluciones_globales",
      JSON.stringify([...historial, devolucion])
    );
  
    setVentaSeleccionada(null);
    alert("Devolución registrada en el día de hoy");
  };

  const ventasDelDia = ventas.filter(v => v.fecha === fecha);



  const totalVentas = ventasDelDia.reduce((acc, v) => {
    if (v.type === "sale") return acc + v.total;
    if (v.type === "refund") return acc - v.total;
    return acc;
  }, 0);
  
  const totalSalidas = ventasDelDia
  .filter(v => v.type === "expense")
  .reduce((acc, s) => acc + (s.total || s.monto || 0), 0);

  const resultadoDia = totalVentas - totalSalidas;
 
  
  
  
  

  return (
    <section className="p-6 space-y-4">
      <h2 className="text-xl font-bold">
        Ventas del {fecha}
      </h2>
      
      {ventaSeleccionada && (
  <ModalDevolucion
    venta={ventaSeleccionada}
    cantidadDevuelta={cantidadDevuelta}
    onCancelar={() => setVentaSeleccionada(null)}
    onConfirmar={confirmarDevolucion}
  />
)}


      <button onClick={() => navigate("/historial")}>
        ⬅ Volver al historial
      </button>

      

<div className="p-4 border rounded bg-gray-50 space-y-1">
  <p>Total ventas: ${totalVentas}</p>
  <p>Total salidas: ${totalSalidas}</p>
  <hr />
  <p className="font-bold">
    Resultado del día: ${resultadoDia}
  </p>
</div>

<div className="space-y-2">
  <h3 className="font-semibold text-lg">
    Salidas del día
  </h3>

  {ventasDelDia.filter(v => v.type === "expense").length === 0 && (
  <p className="text-gray-500">
    No hubo movimientos este día
  </p>
)}

  <ul className="space-y-2">
  {ventasDelDia
  .filter(v => v.type === "expense")
  .map(s => (
      <li
        key={s.id}
        className="p-3 border rounded bg-white flex justify-between"
      >
        <div>
          <p className="font-medium">{s.concepto}</p>
          <p className="text-sm text-gray-500">
            {s.categoria} — {s.hora}
          </p>
        </div>

        <p className="font-semibold text-red-600">
        - ${s.total || s.monto}
        </p>
      </li>
    ))}
  </ul>
</div>



      <ul className="space-y-3">
        {ventasDelDia.map(v => (
          <li
            key={v.id}
            className="p-3 border rounded bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {v.hora} — ${v.total}
              </p>
              <p className="text-sm text-gray-500">
              {
  v.type === "sale" && "VENTA"
}
{
  v.type === "refund" && "DEVOLUCIÓN"
}
{
  v.type === "expense" && "GASTO"
}
              </p>
            </div>

            {v.type === "sale" && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setVentaSeleccionada(v)}

              >
                DEVOLVER
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HistorialDia;
