import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ProductPage({ agregarAlCarrito }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const ref = doc(db, "productos", id);
        const snap = await getDoc(ref);
        const data = snap.data();

        if (!snap.exists()) {
          setProducto(null);
        } else {
          let imagenes = [];

if (Array.isArray(data.imagenes) && data.imagenes.length > 0) {
  imagenes = data.imagenes;
} else if (data.imagen) {
  imagenes = [data.imagen];
}

setProducto({
  id: snap.id,
  ...data,
  imagenes
});

        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  if (loading) {
    return <p className="text-center p-6">Cargando producto...</p>;
  }

  if (!producto) {
    return <p className="text-center p-6">Producto no encontrado</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center">

      <div
  className="w-full flex gap-3 overflow-x-scroll snap-x snap-proximity mb-4"
  style={{ WebkitOverflowScrolling: "touch" }}
>
  {producto.imagenes.length > 0 ? (
    producto.imagenes.map((img, i) => (
      <img
        key={i}
        src={img}
        alt={`${producto.nombre}-${i}`}
        className="min-w-[240px] h-60 object-cover rounded-lg flex-shrink-0 snap-center"
      />
    ))
  ) : (
    <img
      src="/placeholder.png"
      alt="sin imagen"
      className="w-60 h-60 object-cover rounded-lg"
    />
  )}
</div>



        <h1 className="text-2xl font-semibold mb-2">{producto.nombre}</h1>

        <p className="text-xl text-green-700 font-bold mb-2">
          ${producto.precio}
        </p>

        <p className="text-gray-600 mb-4">
          Categoría: <span className="font-medium">{producto.categoria}</span>
        </p>

        <button
  onClick={() => agregarAlCarrito(producto)}
  className="
    w-full
    bg-green-700
    hover:bg-green-800
    text-white
    py-3
    rounded-xl
    text-base
    font-medium
    transition-colors
  "
>
  Agregar al carrito
</button>

        
      </div>
    </div>
  );
}
