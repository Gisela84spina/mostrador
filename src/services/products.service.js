import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";

const PATH = ["proyecto", "colombo", "productos"];

/* ===== LEER ===== */
export async function getProductos() {
  const snap = await getDocs(collection(db, ...PATH));
  const lista = snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  // cache offline
  localStorage.setItem("productos", JSON.stringify(lista));

  return lista;
}

/* ===== LEER LOCAL (offline) ===== */
export function getProductosLocal() {
  const local = localStorage.getItem("productos");
  return local ? JSON.parse(local) : [];
}

/* ===== AGREGAR ===== */
export async function addProducto(producto) {
  await addDoc(collection(db, ...PATH), producto);
  return getProductos(); // refresca cache
}

/* ===== ACTUALIZAR ===== */
export async function updateProducto(id, cambios) {
  await updateDoc(
    doc(db, ...PATH, id),
    cambios
  );
  return getProductos();
}

/* ===== BORRAR ===== */
export async function deleteProducto(id) {
  await deleteDoc(doc(db, ...PATH, id));
  return getProductos();
}
