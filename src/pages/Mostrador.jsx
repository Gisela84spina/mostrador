
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


let lastInputTime = Date.now();


const Mostrador = ({
  productos,
  carrito,
  busqueda,
  setBusqueda,
  agregarAlCarrito,
  restarDelCarrito,
  aumentarCantidad,
  total,
  playError,
  cerrarVenta,
  resetVenta,

  modoEscaner,
  setModoEscaner,

}) => {

  const navigate = useNavigate();
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    const keepFocus = () => inputRef.current?.focus();
    window.addEventListener("click", keepFocus);
    return () => window.removeEventListener("click", keepFocus);
  }, []);
  
 

  return (
    <section className="w-full h-screen bg-white flex flex-col">

    {/* HEADER STICKY */}
    <header className="sticky top-0 z-20 bg-white border-b p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Repuestos Colombo
        </h2>
  
        <div className={`text-3xl font-bold ${total > 0 ? "text-green-600" : ""}`}>
  ${total}
</div>

      </div>
    </header>
  
    {/* CONTENIDO */}
    <div className="flex-1 p-6 flex flex-col">
  

    <input
  ref={inputRef}
  type="text"
  value={busqueda}
  onChange={(e) => {
    const now = Date.now();
    const diff = now - lastInputTime;
    lastInputTime = now;

    setModoEscaner(diff < 30);
    setBusqueda(e.target.value);
  }}
  placeholder={modoEscaner ? "Escaneando..." : "Buscar producto"}
  className={`border p-3 rounded w-full mb-4 text-lg ${
    modoEscaner ? "border-blue-500 bg-blue-50" : ""
  }`}

/>



{productos.length === 0 && busqueda && (
  <p className="text-red-500 mt-2">
    No hay coincidencias
  </p>
)}



 

      {/* LISTA */}
<div className="flex-1 overflow-y-auto space-y-4">

{/* RESULTADOS DE BÚSQUEDA */}
{busqueda && productos.length > 0 && (
  <div className="space-y-2">
    {productos.map((p) => (
      <button
        key={p.id}
        onClick={() => {
          agregarAlCarrito(p);
          setBusqueda("");
          setModoEscaner(false);
        }}
        className="w-full text-left border p-3 rounded hover:bg-gray-100"
      >
        <div className="font-semibold">{p.nombre}</div>
        <div className="text-gray-600">${p.precio}</div>
      </button>
    ))}
  </div>
)}

{/* SIN RESULTADOS */}
{busqueda && productos.length === 0 && (
  <p className="text-red-500 mt-2">No hay coincidencias</p>
)}

{/* CARRITO */}
{carrito.length > 0 && (
  <div className="mt-6 space-y-4 border-t pt-4">
    {carrito.map((item) => (
      <div
        key={item.id}
        className="flex justify-between items-center border-b pb-3"
      >
        <div>
          <h3 className="font-semibold text-lg">{item.nombre}</h3>
          <p className="text-gray-600">
            ${item.precio} x {item.cantidad}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => restarDelCarrito(item)}
            className="px-4 py-2 bg-gray-200 rounded text-xl"
          >
            −
          </button>

          <span className="text-xl font-semibold">
            {item.cantidad}
          </span>

          <button
            onClick={() => aumentarCantidad(item.id)}
            className="px-4 py-2 bg-gray-200 rounded text-xl"
          >
            +
          </button>
        </div>
      </div>
    ))}
  </div>
)}
</div>

      

      <button
  onClick={() => setConfirmando(true)}
  className="mt-4 bg-black text-white p-4 rounded text-xl"
>
  COBRAR
</button>
{confirmando && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded w-80 text-center space-y-4">
      <h3 className="text-xl font-bold">¿Confirmar venta?</h3>
      <p className="text-gray-600">Total: ${total}</p>

      <div className="flex gap-4">
        <button
          onClick={() => {
            cerrarVenta();
            setConfirmando(false);
          }}
          className="flex-1 bg-green-600 text-white p-3 rounded"
        >
          CONFIRMAR
        </button>

        <button
          onClick={() => setConfirmando(false)}
          className="flex-1 bg-gray-300 p-3 rounded"
        >
          CANCELAR
        </button>
      </div>
    </div>
  </div>
)}

<button
  onClick={resetVenta}
  className="mt-2 bg-gray-200 text-black p-3 rounded text-lg"
>
  NUEVA VENTA
</button>


<button
  onClick={() => navigate("/ventas")}
  className="text-sm text-gray-500 underline mb-2 self-end"
>
  Ver ventas del día
</button>


<button
  onClick={() => navigate("/admin")}
  className="text-sm text-gray-500 underline mb-2 self-end"
>
  Panel Administrador
</button>

<button
  onClick={() => navigate("/admin/productos")}
  className="text-sm text-gray-500 underline mb-2 self-end"
>
  Productos
</button>

<button
  onClick={() => navigate("/historial")}
  className="text-sm text-gray-500 underline mb-2 self-end"
>
  Historial
</button>



</div>


    </section>
  );
};

export default Mostrador;



