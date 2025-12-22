

import React from "react";

const CartPage = ({ 
  carrito, 
  restarDelCarrito, 
  eliminarDelCarrito,
  aumentarCantidad, 
  total,
  enviarCarritoPorWhatsApp
  
  
}) => {
  
  
  return (
    <section className="bg-white shadow-lg rounded-xl max-w-3xl mx-auto my-8 p-6 w-[90%] md:w-3/4 lg:w-2/3">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Tu carrito 🛒
      </h2>

      {carrito.length === 0 ? (
        <p className="text-gray-500 text-center">Aún no agregaste productos.</p>
      ) : (
        <div className="space-y-4">
          {carrito.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.imagen || item.imagen || "./placeholder.png" }
                  alt={item.nombre}
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
                <div>
                  <h3 className="font-semibold text-lg">{item.nombre}</h3>
                  <p className="text-gray-600">
                    ${item.precio} x {item.cantidad}
                  </p>

                  {/* Controles */}
                  <div className="flex items-center space-x-3 mt-2">
                    <button
                      onClick={() => restarDelCarrito(item)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>

                    <span className="font-medium">{item.cantidad}</span>

                    <button
                      onClick={() => aumentarCantidad(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>

                    <button 
                      onClick={() => eliminarDelCarrito(item)}
                      className="text-red-500 ml-4"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

             
            </div>
          ))}
        </div>
      )}

      {/* TOTAL */}
      {carrito.length > 0 && (
        <div className="mt-8 border-t pt-4 text-center">
          <div className="flex justify-between text-lg font-semibold text-gray-800">
            <span>Total:</span>
            <span>${total}</span>

          </div>

          <button
  onClick={enviarCarritoPorWhatsApp}
  className="bg-green-600 text-white px-4 py-2 rounded-lg w-full mt-4"
>
  Finalizar compra por WhatsApp
</button>

        </div>
      )}
    </section>
  );
};

export default CartPage;

