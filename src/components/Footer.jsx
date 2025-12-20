import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import logo from "../assets/logo-sucule66.jpg"
import {CLIENTE} from "../config/cliente";


export default function Footer() {
  

  return (
    <footer className="w-full bg-gradient-to-b from-[#E6DDCF] to-[#C6CBB9] text-gray-800 mt-20">

      
      {/* CONTENEDOR */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 gap-12 md:grid-cols-4">

        {/* MARCA */}
        <div>
  <img
    src={logo}
    alt="Sucule66"
    className="h-16 mb-4 object-contain"
  />

  <p className="text-sm text-gray-600 leading-relaxed">
    Tienda de productos naturales y seleccionados 🌿  
    Comprá fácil, consultá rápido y recibí atención real.
  </p>
</div>


        {/* NAVEGACIÓN */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 border-b border-[#B7B1A4] pb-2">
            Navegación
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Inicio
              </Link>
            </li>
            
            <li>
              <Link to="/cart" className="hover:text-white transition">
                Carrito
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACTO */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 border-b border-[#B7B1A4] pb-2">
            Contacto
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="text-gray-800">
              Atención personalizada
            </li>
            <li>
            <p className="text-sm text-gray-500 leading-relaxed">
  <a
    href="https://www.google.com/maps/search/?api=1&query=Juan+B+Justo+315,+Junín,+Buenos+Aires,+Argentina"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-blue-300 transition"
  >
    Juan B. Justo 315, Junín, Buenos Aires<br />
    Argentina
  </a>
</p>

            </li>
          </ul>
        </div>

        {/* REDES */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 border-b border-[#B7B1A4] pb-2">
            Redes
          </h3>

          <div className="flex gap-5 text-2xl">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/16mcKH5eKM/" // pegá acá tu link real
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white hover:scale-110 transition-transform"
            >
              <FaFacebookF />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/sucule66?igsh=MMW94NjB1aDh6ejdmZq==" //  link real del cliente
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white hover:scale-110 transition-transform"
            >
              <FaInstagram />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${CLIENTE.telefono}`}
              target="_blank"
              rel="noopener noreferrer"

              aria-label="WhatsApp"
              className="hover:text-white hover:scale-110 transition-transform"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

      </div>

      {/* LÍNEA FINAL */}
      <div className="border-t border-[#C6CBB9] text-center py-5 text-xs text-gray-500">
        © {new Date().getFullYear()} Tienda Digital - Sucu Le · Hecho por Gise  
        <div className="mt-1">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </div>

    </footer>
  );
}
