import { useState, useEffect } from "react";
import { useCarrusel } from "../hooks/useCarrusel";

export default function Carrusel() {
  const { imagenes } = useCarrusel();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (imagenes.length <= 1) return;

    setIndex(0);

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % imagenes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imagenes]);

  if (!imagenes.length) return null;

  const next = () =>
    setIndex((index + 1) % imagenes.length);

  const prev = () =>
    setIndex((index - 1 + imagenes.length) % imagenes.length);

  return (
    <div className="w-full h-64 mb-10 overflow-hidden rounded-2xl
     shadow-md relative " 
    >

      <img
        src={imagenes[index].url}
        className="w-full h-full object-cover transition-all duration-500"
        alt="Carrusel"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#E6DDCF]/40
      to-transparent pointer-events-none"/>
      {/* Flecha izquierda */}
      {imagenes.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 
                     bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
        >
          ‹
        </button>
      )}

      {/* Flecha derecha */}
      {imagenes.length > 1 && (
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 
                     bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
        >
          ›
        </button>
      )}
    </div>
  );
}
