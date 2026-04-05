export const cantidadDevuelta = (ventaId, itemId) => {
    const historial =
      JSON.parse(localStorage.getItem("devoluciones_globales")) || [];
  
    return historial
      .filter(v => v.originalId === ventaId)
      .flatMap(v => v.items)
      .filter(i => i.id === itemId)
      .reduce((acc, i) => acc + i.cantidad, 0);

      
  };
  export const diasDesde = fechaStr => {
    const hoy = new Date();
    const fecha = new Date(fechaStr);
    return Math.floor(
      (hoy - fecha) / (1000 * 60 * 60 * 24)
    );
  };
  
  export const LIMITE_DIAS_DEVOLUCION = 7;
  
  