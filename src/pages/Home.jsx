import { useState } from "react";

import { Link } from "react-router-dom";

import Carrusel from "../components/Carrusel";


export default function Home({ productos, agregarAlCarrito, searchTerm }) {
  
  

  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortByPrice, setSortByPrice] = useState("");
  const activos = productos.filter(p => !p.eliminado);
  const [agregado, setAgregado] = useState(null);


  // --- FILTROS + ORDEN ---
   const filteredProducts = activos

    .filter((p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) =>
      selectedCategory === "all"
        ? true
        : p.categoria === selectedCategory
    )
    .sort((a, b) => {
      if (sortByPrice === "asc") return a.precio - b.precio;
      if (sortByPrice === "desc") return b.precio - a.precio;
      return 0;
    });

  return (
    <div
  className="min-h-screen p-6"
  style={{
    background: "linear-gradient(to bottom right, #E6DDCF, #C6CBB9)"
  }}
>

      

      <Carrusel />

      <h1 className="text-gray-900 font-semibold text-2xl mb-6">
        Productos
      </h1>

      {/* --- FILTROS UI --- */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        
        {/* Categorías */}
        <select className="border p-3 rounded-xl w-full sm:w-auto
         bg-white shadow-sm"

          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          
        >
          <option value="all">Todas las categorías</option>
          <option value="plantas chicas">Plantas chicas</option>
          <option value="plantas grandes">Plantas grandes</option>
          <option value="mix chicos">Mix chicos</option>
          <option value="mix grandes">Mix grandes</option>
        </select>

        {/* Precio */}
        <select className="border p-3 rounded-xl w-full sm:w-auto
         bg-white shadow-sm"

          value={sortByPrice}
          onChange={(e) => setSortByPrice(e.target.value)}
        
        >
          <option value="">Ordenar por precio</option>
          <option value="asc">Precio menor a mayor</option>
          <option value="desc">Precio mayor a menor</option>
        </select>
      </div>

      {/* Si no hay productos */}
      {productos.length === 0 && (
        <p className="text-gray-600">Cargando productos...</p>
      )}

      {/* Lista de productos filtrados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredProducts.map((prod) => (
    <div key={prod.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">

    <Link to={`/producto/${prod.id}`} className="flex flex-col items-center">
      <img
        src={prod.imagenes?.[0] || prod.imagen || "/placeholder.png"} 
        alt={prod.nombre}
        className="w-24 h-24 sm:w-28 sm:h-28 object-cover mb-3"
      />
  
      <h3 className="text-lg font-semibold">{prod.nombre}</h3>
      <p className="text-gray-700 mb-3">${prod.precio}</p>
    </Link>
  
    <button
      onClick={() => {
        agregarAlCarrito(prod);
        setAgregado(prod.id);
        setTimeout(() => setAgregado(null), 1200);
      }}
      className={`py-2 px-4 rounded-lg transition text-white 
     ${agregado === prod.id ? "bg-[#6F8A6D]" : "bg-[#7A8F6A] hover:bg-[#6A7F5A]"}
    `}
    >
      {agregado === prod.id ? "✔ Agregado!" : "Agregar al carrito"}
    </button>
  
  </div>
  
        ))}
      </div>
    </div>
  );
}


