import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <section className="h-screen flex flex-col justify-center items-center gap-4">
      <h2 className="text-2xl font-bold">Panel administrador</h2>

      <button onClick={() => navigate("/")}>
        ⬅ Volver al mostrador
      </button>


      <button
        onClick={() => navigate("/admin/productos")}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Gestionar productos
      </button>

      <button
  onClick={() => navigate("/admin/salidas")}
  className="bg-red-700 text-white px-6 py-3 rounded"
>
  Registrar salidas
</button>

    </section>
  );
};

export default Admin;
