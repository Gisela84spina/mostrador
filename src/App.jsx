
import Header from "./components/Header";
import CartPage from "./pages/CartPage";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductPage from "./pages/ProductPage";
import { CLIENTE } from "./config/cliente";



import { db } from "./firebase";

import { 
  collection,
  getDocs, 
  addDoc, 
  updateDoc, 
  doc 
} from "firebase/firestore";



function App() {
 
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

 
  // -------------------------
  // CARGAR PRODUCTOS
  // -------------------------
  const cargarProductos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
  
      const lista = querySnapshot.docs.map(docu => {
        const data = docu.data();
  
        return {
          id: docu.id,
          ...data,
          eliminado: data.eliminado ?? false,
          imagenes: Array.isArray(data.imagenes) && data.imagenes.length > 0
            ? data.imagenes
            : data.imagen
              ? [data.imagen]
              : []
        };
      });
  
      setProductos(lista);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };
  

  const actualizarProductoFirebase = async (producto) => {
    try {
      const ref = doc(db, "productos", producto.id);
      await updateDoc(ref, {
        nombre: producto.nombre,
        precio: producto.precio,
        imagenes: producto.imagenes ?? [],
        descripcion: producto.descripcion ?? "",
        categoria: producto.categoria ?? ""
      });
      cargarProductos();
    } catch (error) {
      console.error("Error actualizando producto:", error);
    }
  };
  
  
  
  const agregarProducto = async (producto) => {
    try {
      await addDoc(collection(db, "productos"), {
        ...producto,
        eliminado: false,
      });
      cargarProductos();
    } catch (error) {
      console.error("Error agregando producto:", error);
    }
  };

  const [adminLogueado, setAdminLogueado] = useState(false);
  
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  // CARGAR CARRITO DESDE LOCALSTORAGE
useEffect(() => {
  const guardado = localStorage.getItem("carrito");
  if (guardado) {
    setCarrito(JSON.parse(guardado));
  }
}, []);

// GUARDAR CARRITO EN LOCALSTORAGE
useEffect(() => {
  if (carrito.length > 0) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } else {
    localStorage.removeItem("carrito");
  }
}, [carrito]);


//blindaje recalcula total

useEffect(() => {
  console.log("Carrito para total:", carrito);
  const nuevo = carrito.reduce(
    (acc, item) => acc + item.precio * (item.cantidad ?? 1),
    0
  );
  console.log("total calculado:", nuevo);
  setTotal(nuevo);
}, [carrito]);

  // -------------------------
  // RESTAR
  // -------------------------
  const restarDelCarrito = (producto) => {
    const id = producto.id;
  
    setCarrito(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const nueva = item.cantidad - 1;
            return nueva > 0 ? { ...item, cantidad: nueva } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };
  
  const eliminarDelCarrito = (producto) => {
    const id = producto.id;
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  // -------------------------
  // AGREGAR AL CARRITO (SUMAR)
  // -------------------------
  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
  
      if (existe) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
  
      // BLINDEO: si viene sin cantidad, le pongo 1
      return [...prev, { ...producto, cantidad: producto.cantidad ?? 1 }];
    });
  };
  
  const aumentarCantidad = (id) => {
    setCarrito(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };
  const enviarCarritoPorWhatsApp = () => {

  
    if (carrito.length === 0) return;
  
    const items = carrito
      .map(item => 
  `🛍️ ${item.nombre}
  🆔 ID: ${item.id}
  📦 Cantidad: ${item.cantidad}
  💲 Precio unitario: $${item.precio}
  💰 Subtotal: $${item.precio * item.cantidad}
  🖼️ Imagen:
  ${item.imagenes?.[0] || "Sin imagen"}`
      )
      .join("\n\n----------------------\n\n");
  
    const mensaje = `Hola! Quiero realizar este pedido:\n\n${items}\n\n🧾 Total: $${total}`;
  
    const url = `https://wa.me/${CLIENTE.telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  };
   
  
  

  const eliminarProductoFirebase = async (id) => {
    try {
      const ref = doc(db, "productos", id);
      await updateDoc(ref, { eliminado: true });
      cargarProductos();
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };
  const restaurarProductoFirebase = async (id) => {
    try {
      const ref = doc(db, "productos", id);
      await updateDoc(ref, { eliminado: false });
      cargarProductos();
    } catch (error) {
      console.error("Error restaurando producto:", error);
    }
  };
  //cargar productos
  useEffect(() => {
    cargarProductos();
  }, []);
  

  // -------------------------
  // RENDER
  // -------------------------

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

<Header
  cartCount={carrito.reduce((sum, item) => sum + (item.cantidad ?? 1), 0)}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
/>

    <main className="flex-1 w-full ">

      <Routes>
         <Route 
           path="/" 
           element={<Home productos={productos} 
           agregarAlCarrito={agregarAlCarrito} 
           searchTerm={searchTerm}
           />
          } 
       />

          <Route
            path="/producto/:id"
            element={<ProductPage agregarAlCarrito={agregarAlCarrito} />}
          />

<Route
  path="/cart"
  element={
    <CartPage 
      carrito={carrito}
      restarDelCarrito={restarDelCarrito}
      eliminarDelCarrito={eliminarDelCarrito}
      aumentarCantidad={aumentarCantidad}
      total={total}
      enviarCarritoPorWhatsApp={enviarCarritoPorWhatsApp}
    />
  }
/>



          <Route
          path="/login"
          element={<Login setAdminLogueado={setAdminLogueado} />}
          />

          <Route
          path="/admin/*"
          element={<ProtectedRoute setAdminLogueado={setAdminLogueado}>
           <AdminDashboard 
            productos={productos}
            agregarProducto={agregarProducto}
            eliminarProducto={eliminarProductoFirebase}
            restaurarProducto={restaurarProductoFirebase}
            actualizarProducto={actualizarProductoFirebase}
          />

          
          </ProtectedRoute>
          }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
   
