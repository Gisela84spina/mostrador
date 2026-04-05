import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cantidadDevuelta, diasDesde,
  LIMITE_DIAS_DEVOLUCION
 } from "../utils/devoluciones";



const Ventas = ({
  ventas,
  setVentas
}) => {


  const navigate = useNavigate();
  
  
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [cantidades, setCantidades] = useState({});
  
  const location = useLocation();

  const hoy = new Date().toISOString().slice(0, 10);

  const fechaVista =
    location.state?.fecha || hoy;

  const key = `ventas_${fechaVista}`;

  


  useEffect(() => {
    const venta = location.state?.ventaParaDevolver;
    if (!venta) return;
  
    const dias = diasDesde(venta.fecha);
  
    if (dias > LIMITE_DIAS_DEVOLUCION) {
      alert(
        `Esta venta tiene ${dias} días.\nLas devoluciones son hasta ${LIMITE_DIAS_DEVOLUCION} días.`
      );
      navigate(-1);
      return;
    }
  
    setVentaSeleccionada(venta);
    setCantidades({});
  }, [location.state]);
  

const exportarCierreCSV = cierre => {
  let csv = `Repuestos Colombo
Fecha: ${cierre.fecha}

RESUMEN
Ventas,${cierre.ventas}
Devoluciones,${cierre.devoluciones}
Salidas,${cierre.salidas}
Neto,${cierre.neto}

DETALLE
Hora,Tipo,Producto,Cantidad,Precio,Subtotal
`;

cierre.operaciones.forEach(op => {

  // 👉 SALIDAS
  if (op.type === "expense") {
    csv += `${op.hora},SALIDA-${op.categoria || "otro"},${op.concepto},1,${op.total},${op.total}\n`;
    return;
  }

  // 👉 VENTAS / DEVOLUCIONES
  if (!op.items) return;

  op.items.forEach(item => {
    csv += `${op.hora},${op.type === "sale" ? "VENTA" : "DEVOLUCIÓN"},${item.nombre},${item.cantidad},${item.precio},${item.precio * item.cantidad}\n`;
  });
});


  descargarCSV(csv, `cierre_${cierre.fecha}.csv`);
};


const cerrarDia = () => {




  if (ventas.length === 0) {
    alert("No hay movimientos para cerrar el día");
    return;
  }


  // Totales
  const totalVentas = ventas
    .filter(v => v.type === "sale")
    .reduce((acc, v) => acc + Number(v.total), 0);

  const totalDevoluciones = ventas
    .filter(v => v.type === "refund")
    .reduce((acc, v) => acc + Number(v.total), 0);

    const totalSalidas = ventas
  .filter(v => v.type === "expense")
  .reduce((acc, v) => acc + Number(v.total), 0);


  const netoDelDia = totalVentas - totalDevoluciones - totalSalidas;

  // Snapshot del día
  const cierre = {
    fecha: hoy,
    ventas: totalVentas,
    devoluciones: totalDevoluciones,
    salidas: totalSalidas,
    neto: netoDelDia,
    operaciones: ventas,
  };

  // Guardar historial de cierres
  const historial =
    JSON.parse(localStorage.getItem("cierres_dia")) || [];

    const yaCerrado = historial.some(
      c => c.fecha === fechaVista
    );
    
    if (yaCerrado) {
      const confirmar = window.confirm(
        "Este día ya fue exportado. ¿Querés generar el cierre nuevamente?"
      );
      if (!confirmar) return;
    }
    

    const nuevoHistorial = yaCerrado
    ? historial.map(c =>
        c.fecha === fechaVista ? cierre : c
      )
    : [...historial, cierre];
  
  localStorage.setItem(
    "cierres_dia",
    JSON.stringify(nuevoHistorial)
  );
  

  // Exportar CSV único
  exportarCierreCSV(cierre);
  
  alert("Día cerrado correctamente");
};

 
  // =========================
  // DESCARGA CSV
  // =========================
  const descargarCSV = (contenido, nombre) => {
    const blob = new Blob([contenido], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = nombre;
    link.click();

    URL.revokeObjectURL(url);
  };

  // =========================
  // DEVOLUCIÓN
  // =========================

  
  const totalVentas = ventas
  .filter(v => v.type === "sale")
  .reduce((acc, v) => acc + Number(v.total), 0);

  const totalDevoluciones = ventas
  .filter(v => v.type === "refund")
  .reduce((acc, v) => acc + Number(v.total), 0);

  const totalSalidas = ventas
  .filter(v => v.type === "expense")
  .reduce((acc, v) => acc + Number(v.total), 0);


const netoDelDia = totalVentas - totalDevoluciones - totalSalidas;

const confirmarDevolucion = () => {
  if (!ventaSeleccionada || !ventaSeleccionada.items) {
    alert("No se pudo cargar la venta para devolución");
    return;
  }
  
  const itemsDevueltos = ventaSeleccionada?.items?.filter(item => cantidades[item.id] > 0)
  .map(item => ({
    ...item,
    cantidad: cantidades[item.id],
  })) || [];


  if (itemsDevueltos.length === 0) {
    alert("No seleccionaste ningún producto");
    return;
  }

  const totalDevuelto = itemsDevueltos.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const devolucion = {
    id: Date.now(),
    fecha: hoy,
    fechaVentaOriginal: ventaSeleccionada.fecha,
    hora: new Date().toLocaleTimeString(),
    type: "refund",
    originalId: ventaSeleccionada.id,
    items: itemsDevueltos,
    total: totalDevuelto,
  };

  
  const keyHoy = `ventas_${hoy}`;
  const ventasHoy = JSON.parse(localStorage.getItem(keyHoy)) || [];

  const nuevasVentasHoy = [...ventasHoy, devolucion];
  localStorage.setItem(keyHoy, JSON.stringify(nuevasVentasHoy));
  



  const historial =
    JSON.parse(localStorage.getItem("devoluciones_globales")) || [];
  localStorage.setItem(
    "devoluciones_globales",
    JSON.stringify([...historial, devolucion])
  );

  setVentaSeleccionada(null);
};


  // =========================
  // RENDER
  // =========================
  return (
    <section className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Ventas del día</h2>

      <div className="p-4 bg-gray-100 rounded space-y-1">
  <p>Ventas: <strong>${totalVentas.toFixed(2)}</strong></p>
  <p>Devoluciones: <strong>${totalDevoluciones.toFixed(2)}</strong></p>
  <p>Salidas: <strong>${totalSalidas.toFixed(2)}</strong></p>

  <p className="font-bold mt-2">
    Neto del día: ${netoDelDia.toFixed(2)}
  </p>
</div>



      <button onClick={() => navigate("/")}>
        ⬅ Volver al mostrador
      </button>

      <button
  onClick={cerrarDia}
  className="bg-green-700 text-white p-3 rounded w-full"
>
  Exportar cierre del día
</button>



      <ul className="space-y-3">
        {ventas.map(v => (
          <li
          key={v.id}
          className={`p-3 border rounded flex justify-between items-center
            ${
              v.type === "refund"
                ? "bg-red-100 opacity-60"
                : v.type === "expense"
                ? "bg-yellow-100"
                : "bg-white"
            } `
        }
        >
        
            <div>
              <p className="font-semibold">
                {v.hora} — ${v.total}
              </p>
              <p className="text-sm text-gray-600">
                 Tipo: {
                   v.type === "refund"
                     ? "DEVOLUCIÓN"
                     : v.type === "expense"
                     ? "SALIDA"
                     : "VENTA"
  }
</p>


            </div>

            {v.type === "sale" && 
            diasDesde(v.fecha)<=LIMITE_DIAS_DEVOLUCION &&(
  <button
    onClick={() => {
      setVentaSeleccionada(v);
      setCantidades({});
    }}
    className="bg-red-600 text-white px-4 py-2 rounded"
  >
    DEVOLUCIÓN
  </button>
)}



            <button onClick={() => navigate("/admin")}>
  Ir a admin
</button>

          </li>
        ))}
      </ul>


      {ventaSeleccionada && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded w-96 space-y-4">
      <h3 className="text-lg font-bold">Devolución</h3>

      {ventaSeleccionada?.items?.map(item => {
  const devuelta = cantidadDevuelta(ventaSeleccionada.id, item.id);
  const disponible = item.cantidad - devuelta;
  

   if (disponible <= 0) return null;

   

  return (
    <div key={item.id} className="flex justify-between items-center">
      <span>
        {item.nombre} (${item.precio})  
        <span className="text-xs text-gray-500">
          {" "}Disp: {disponible}
        </span>
      </span>

      <input
        type="number"
        min="0"
        max={disponible}
        value={cantidades[item.id] || ""}
        onChange={e => {
          const value = Math.max(0, Number(e.target.value) || 0);
          setCantidades({
            ...cantidades,
            [item.id]: Math.min(value, disponible),
          });
        }}
        
        className="w-16 border p-1"
      />
    </div>
  );
})}


      <div className="flex justify-end gap-2">
        <button
          onClick={() => setVentaSeleccionada(null)}
          className="px-3 py-1 border rounded"
        >
          Cancelar
        </button>

        <button
          onClick={() => confirmarDevolucion()}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
)}



    </section>
  );
};

export default Ventas;
