import { useState, useEffect } from "react";
import {Routes, Route } from "react-router-dom";
import { getProductos } from "./services/products.service";

import Mostrador from "./pages/Mostrador";
import Ventas from "./pages/ventas";
import Admin from "./pages/Admin";
import AdminProductos from "./pages/AdminProductos";
import HistorialVentas from "./pages/HistorialVentas";
import HistorialDia from "./pages/HistorialDia";
import Salidas from "./pages/Salidas";



/* =======================
   SONIDOS
======================= */
const ctx = new (window.AudioContext || window.webkitAudioContext)();

const playBeep = () => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.value = 1200;
  gain.gain.value = 0.1;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
};

const playError = () => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.value = 300;
  gain.gain.value = 0.15;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
};

const playVentaOk = () => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    1200,
    ctx.currentTime + 0.15
  );

  gain.gain.value = 0.12;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
};

/* =======================
   LIMPIEZA VENTAS VIEJAS
======================= */
const limpiarVentasViejas = () => {
  const LIMITE_DIAS = 30;
  const ahora = Date.now();

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("ventas_")) {
      const fecha = key.replace("ventas_", "");
      const tiempo = new Date(fecha).getTime();

      if (!isNaN(tiempo)) {
        const dias = (ahora - tiempo) / (1000 * 60 * 60 * 24);
        if (dias > LIMITE_DIAS) {
          localStorage.removeItem(key);
        }
      }
    }
  });
};

/* =======================
   APP
======================= */
function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [total, setTotal] = useState(0);
  const [ventaOk, setVentaOk] = useState(false);
  const [modoEscaner, setModoEscaner] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [devoluciones, setDevoluciones] = useState([]);


  const hoy = new Date().toISOString().slice(0, 10);

  const ventasDelDia = ventas.filter(v => v.fecha === hoy);
  const devolucionesDelDia = devoluciones.filter(d => d.fecha === hoy);


  const resetVenta = () => {
    setCarrito([]);
    setModoEscaner(false)
    setBusqueda("");
  };
  

  /* Cargar productos (solo localStorage) */
  useEffect(() => {
    const cargar = async () => {
      const lista = await getProductos();
      setProductos(lista);
    };
    cargar();
  }, []);
  
  
  
  /* Limpiar ventas viejas al iniciar */
  useEffect(() => {
    limpiarVentasViejas();
  }, []);

  useEffect(() => {
    const todasLasVentas = [];
  
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("ventas_")) {
        const data = JSON.parse(localStorage.getItem(key)) || [];
        todasLasVentas.push(...data);
      }
    });
  
    setVentas(todasLasVentas);
  }, []);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("devoluciones_globales")) || [];
  
    setDevoluciones(data);
  }, []);
  
  

  /* Recalcular total */
  useEffect(() => {
    const nuevoTotal = carrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    setTotal(nuevoTotal);
  }, [carrito]);

  useEffect(() => {
    if (!modoEscaner) return;
    if (!busqueda) return;
  
    const match = productos.find(p => p.codigo === busqueda);
  
    if (match) {
      agregarAlCarrito(match);
      setBusqueda("");
    } else {
      playError();
      setBusqueda("");
    }
  }, [busqueda, modoEscaner, productos]);
  

  /* =======================
     CARRITO
  ======================= */
  const agregarAlCarrito = (producto) => {
    playBeep();

    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id);
      if (existe) {
        return prev.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const restarDelCarrito = (producto) => {
    setCarrito(prev =>
      prev
        .map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad - 1 }
            : p
        )
        .filter(p => p.cantidad > 0)
    );
  };

  const aumentarCantidad = (id) => {
    setCarrito(prev =>
      prev.map(p =>
        p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };

  /* =======================
     CERRAR VENTA
  ======================= */
  const cerrarVenta = () => {
    if (carrito.length === 0) return;

    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0, 10);
    const hora = ahora.toLocaleTimeString();

    const venta = {
      id: Date.now(),
      fecha,
      hora,
      type: "sale",
      items: carrito,
      total,
      
    };

    const key = `ventas_${fecha}`;
    const ventas = JSON.parse(localStorage.getItem(key)) || [];
 
    ventas.push(venta);
    localStorage.setItem(key, JSON.stringify(ventas));
    setVentas(prev => [...prev, venta]);


    playVentaOk();
    setVentaOk(true);

    setTimeout(() => {
      resetVenta();
      setVentaOk(false);
    }, 800);
    
  };
  

  /* =======================
     FILTRO
  ======================= */
  const productosFiltrados = productos.filter(p =>
    modoEscaner
      ? p.codigo === busqueda
      : p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );


  const cantidadDevuelta = (ventaId, itemId) => {
    return devoluciones
      .filter(d => d.ventaId === ventaId)
      .reduce((acc, d) => {
        const item = d.items.find(i => i.itemId === itemId);
        return acc + (item?.cantidad || 0);
      }, 0);
  };
  
  

  return (

    <Routes>
      <Route
        path="/"
        element={
    <Mostrador
      productos={productosFiltrados}
      carrito={carrito}
      busqueda={busqueda}
      setBusqueda={setBusqueda}
      agregarAlCarrito={agregarAlCarrito}
      restarDelCarrito={restarDelCarrito}
      aumentarCantidad={aumentarCantidad}
      total={total}
      playError={playError}
      cerrarVenta={cerrarVenta}
      resetVenta={resetVenta}
      ventaOk={ventaOk}
      modoEscaner={modoEscaner}
      setModoEscaner={setModoEscaner}
    />
        }
        />
        <Route
  path="/ventas"
  element={
    <Ventas
      ventas={ventas}
      setVentas={setVentas}
      devoluciones={devoluciones}
      setDevoluciones={setDevoluciones}
      cantidadDevuelta={cantidadDevuelta}
    />
  }
/>

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/productos" element={<AdminProductos />}/>
        <Route path="/historial" element={<HistorialVentas />} />
        <Route 
          path="/historial/:fecha"  
          element={<HistorialDia />}
        />
        <Route path="/admin/salidas" element={<Salidas />} />




</Routes>
  );
}

export default App;


