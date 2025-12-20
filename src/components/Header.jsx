import { Link } from "react-router-dom";
import logo from "../assets/logo-sucule66.jpg"

export default function Header({ cartCount, searchTerm, setSearchTerm }) {
  return (
    <header
     className="flex justify-between items-center p-4 text-white"
     style={{ background:  " #FFFFFF" }}
    >

      {/* 🔥 Logo / título que envía al Home */}
      <Link to="/" className="flex items-center">
       <img
         src={logo}
         alt="Sucule66"
         className="h-16 object-contain"
      />
      </Link>

      <input
       type="text"
       placeholder="Buscar producto..."
       value={searchTerm}
       onChange={(e)=>setSearchTerm(e.target.value)}
       className="mx-3 flex-1 max-w-xs px-3 py-2 rounded-lg text-sm 
             border border-gray-300 focus:outline-none 
             focus:ring-2 focus:ring-[#7A8F6A]"
/>

      {/* 🔥 Botón carrito */}
      <Link
        to="/cart"
        className="relative  px-3 py-2 rounded bg-[#E6DDCF] hover:bg-[#C6CBB9] transition"
      >
        🛒
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-2 rounded-full">
            {cartCount}
          </span>
        )}
      </Link>

    </header>
  );
}

  