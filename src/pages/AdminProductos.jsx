import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProductos,
  addProducto,
  deleteProducto,
  updateProducto
} from "../services/products.service";

const AdminProductos = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [codigo, setCodigo] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const [editCodigo, setEditCodigo] = useState("");


  const cargar = async () => {
    const lista = await getProductos();
    setProductos(lista);
  };

  useEffect(() => {
    cargar();
  }, []);

  const agregar = async () => {
    if (!codigo || !nombre || Number(precio) <= 0) return;

    await addProducto({
        nombre,
        precio: Number(precio),
        codigo
      });
      
    setNombre("");
    setPrecio("");
    setCodigo("");
    cargar();
  };

  const borrar = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    await deleteProducto(id);
    cargar();
  };

  const guardarEdicion = async (id) => {
    if (!editCodigo || !editNombre || Number(editPrecio) <= 0) return;
  
    await updateProducto(id, {
      nombre: editNombre,
      precio: Number(editPrecio),
      codigo: editCodigo
    });
  
    setProductos(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, nombre: editNombre, precio: Number(editPrecio), codigo: editCodigo }
            : p
        )
      );
      
    setEditandoId(null);
    setEditCodigo("");
    setEditNombre("");
    setEditPrecio("");
   
  };
  

  return (
    <section className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Productos</h2>

      <button onClick={() => navigate("/admin")}>⬅ Volver</button>
      <button onClick={() => navigate("/")}>🏠 Mostrador</button>

      <div className="flex gap-2">
        <input
          placeholder="Código"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          className="border p-2"
        />
        <button onClick={agregar} className="bg-black text-white px-4">
          +
        </button>
      </div>

      <ul className="space-y-2">
        {productos.map(p => (
          <li key={p.id} className="flex justify-between border p-2">
            <span>{p.codigo} — {p.nombre} — ${p.precio}</span>
            {editandoId === p.id ? (
  <div className="flex gap-2">
    <input
      autoFocus
      value={editCodigo}
      onChange={e => setEditCodigo(e.target.value)}
      className="border p-1"
    />
    <input
      value={editNombre}
      onChange={e => setEditNombre(e.target.value)}
      className="border p-1"
    />
    
    <input
      type="number"
      value={editPrecio}
      onChange={e => setEditPrecio(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
        guardarEdicion(p.id);
    }
  }}
  className="border p-1"
/>

<button
  onClick={() => guardarEdicion(p.id)}
  className="text-green-600"
>
  guardar
</button>

    
  </div>
) : (
  <>

    <div className="flex gap-2">
      <button
        onClick={() => {
          setEditandoId(p.id);
          setEditNombre(p.nombre);
          setEditPrecio(p.precio);
          setEditCodigo(p.codigo || "");
        }}
        className="text-blue-600"
      >
        editar
      </button>

      <button
        onClick={() => borrar(p.id)}
        className="text-red-600"
      >
        borrar
      </button>
    </div>
  </>
)}

          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminProductos;

