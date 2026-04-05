import React, { useState } from "react";

const ModalDevolucion = ({
  venta,
  onCancelar,
  onConfirmar,
  cantidadDevuelta
}) => {
  const [cantidades, setCantidades] = useState({});

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96 space-y-4">
        <h3 className="text-lg font-bold">Devolución</h3>

        {venta.items.map(item => {
          const devuelta = cantidadDevuelta(venta.id, item.id);
          const disponible = item.cantidad - devuelta;

          if (disponible <= 0) return null;

          return (
            <div key={item.id} className="flex justify-between items-center">
              <span>
                {item.nombre} (${item.precio})
                <span className="text-xs text-gray-500">
                  {" "}Disp: {disponible}
                </span>
              </span>

              <input
                type="number"
                min={0}
                max={disponible}
                value={cantidades[item.id] ?? ""}
                onChange={e => {
                  const value = Math.max(
                    0,
                    Math.min(disponible, Number(e.target.value) || 0)
                  );

                  setCantidades(prev => ({
                    ...prev,
                    [item.id]: value,
                  }));
                }}
                className="w-16 border p-1"
              />
            </div>
          );
        })}

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancelar}
            className="px-3 py-1 border rounded"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              const cantidadesLimpias = Object.fromEntries(
                Object.entries(cantidades).filter(([_, v]) => v > 0)
              );

              if (Object.keys(cantidadesLimpias).length === 0) return;

              onConfirmar(cantidadesLimpias);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDevolucion;
