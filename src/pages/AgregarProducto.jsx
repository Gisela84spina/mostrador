import { serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function AgregarProducto({ agregarProducto }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenes, setImagenes] = useState([]);
  
  const navigate = useNavigate();
  const CLOUD_NAME = "dy2lgqgk6";
  const UPLOAD_PRESET = "tienda_upload";
  const [subiendo, setSubiendo] = useState(false);
  const [categoria, setCategoria] = useState("");



  const handleImagenUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendo(true);
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
  
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData
        }
      );
      if (!res.ok) {
        throw new Error("Error en Cloudinary");
      }
      
      const data = await res.json();
      setImagenes(prev => [...prev, data.secure_url]);

    } catch (error) {
      alert("Error subiendo imagen");
    } finally {
      setSubiendo(false);
    }
  };
  

  const handleSubmit = (e) => {

    e.preventDefault();

    if (subiendo) {
      alert("La imagen todavía se está subiendo");
      return;
    }
    
    if (!nombre || precio <= 0) {
      alert("Completá correctamente el nombre y el precio");
      return;
    }
    
    if (imagenes.length === 0) {
      alert("Esperá a que termine de subir la imagen");
      return;
    }
    if (!categoria) {
      alert("Seleccioná una categoría");
      return;
    }
    
    

  
    const nuevoProducto = {
      
      nombre,
      precio: Number(precio),
      imagenes,
      categoria,
      eliminado: false,
      createdAt: serverTimestamp()
      
    };
  
    agregarProducto(nuevoProducto);
  
    // limpiar formulario
    setNombre("");
    setPrecio("");
    setImagenes([]);
    setCategoria("");
    
  
    alert("Producto agregado con éxito");
  
  
    // ACÁ vamos a agregar la lógica
    console.log("Producto listo para agregar:", { nombre, precio, imagenes, categoria });
    navigate("/");
  
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Agregar Producto</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-semibold mb-1">Nombre:</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Precio:</label>
            <input 
              type="number"
              className="w-full p-2 border rounded"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Imagen:</label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleImagenUpload}
              className="w-full p-2 border rounded"
            />
            {imagenes.length > 0 && (
  <img
    src={imagenes[imagenes.length - 1]}
    alt="preview"
    className="mt-4 w-full h-40 object-cover rounded"
  />
)}

          </div>
          <div>
  <label className="block font-semibold mb-1">Categoría:</label>
  <select
    className="w-full p-2 border rounded"
    value={categoria}
    onChange={(e) => setCategoria(e.target.value)}
    required
  >
    <option value="all">Todas las categorías</option>
          <option value="plantas chicas">Plantas chicas</option>
          <option value="plantas grandes">Plantas grandes</option>
          <option value="mix chicos">Mix chicos</option>
          <option value="mix grandes">Mix grandes</option>
  </select>
</div>


          <button
  type="submit"
  disabled={imagenes.length === 0 || subiendo}
  className={`w-full p-2 rounded-lg font-semibold transition
    ${subiendo || imagenes.length === 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 text-white"}
  `}
>
  {subiendo ? "Subiendo imagen..." : "Guardar producto"}
</button>

        </form>
      </div>
    </div>
  );

}