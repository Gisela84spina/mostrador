
# 🏍️ Sistema de Mostrador para Repuestos de Motos

Aplicación web orientada a la gestión de ventas en mostrador para un negocio de repuestos de motos.

El sistema está diseñado para operar en condiciones reales de trabajo, priorizando velocidad, simplicidad y funcionamiento offline, permitiendo registrar operaciones diarias y mantener control del flujo de dinero sin depender de conexión a internet.

---

## 🌐 Demo

👉 (aguantame al sr vercel)

---

## 🚀 Problema que resuelve

En muchos negocios pequeños, la gestión del mostrador se realiza de forma manual (papel o Excel), lo que genera:

* pérdida de información
* errores en el registro de ventas
* dificultad para controlar el flujo diario de caja
* dependencia de conexión a internet

Esta aplicación digitaliza ese proceso, ofreciendo una alternativa simple, rápida y confiable para el registro de operaciones diarias.

---

## ⚙️ Funcionalidades principales

### 🧾 Gestión de operaciones

* Registro de ventas
* Registro de devoluciones vinculadas a ventas originales
* Registro de gastos del negocio (salidas de dinero)

---

### 📊 Control diario

* Visualización de operaciones por día
* Cálculo automático de:

  * total de ventas
  * devoluciones
  * gastos
  * resultado neto del día

---

### 📦 Gestión de productos

* Alta, edición y eliminación de productos
* Persistencia en Firebase (Firestore)
* Cache local para funcionamiento offline

---

### 🌐 Funcionamiento offline

* Registro de operaciones mediante localStorage
* Continuidad de uso sin conexión
* Pensado para entornos donde la conexión puede fallar

---

### 📁 Exportación de datos

* Exportación del cierre diario a Excel
* Enfoque orientado a control financiero externo

---

## 🧠 Decisiones técnicas

* Se priorizó la operación en mostrador sobre la complejidad técnica, evitando dependencias innecesarias de red

* Las operaciones diarias (ventas, devoluciones y gastos) se almacenan en localStorage, garantizando velocidad y funcionamiento offline

* El catálogo de productos se gestiona en Firebase (Firestore), permitiendo persistencia remota y futura escalabilidad

* Se separaron intencionalmente las responsabilidades:

  * Firebase → productos
  * localStorage → operaciones del día

* Se diseñó una arquitectura que permite evolucionar hacia un sistema más completo (control de stock, sincronización, backend) sin necesidad de reestructurar la base

* El sistema está pensado para un flujo donde el control financiero se consolida externamente (por ejemplo, en Excel)

---

## 📊 Lógica de negocio

* Las operaciones se agrupan por día bajo claves ventas_YYYY-MM-DD

* Tipos de operación:

  * sale → suma al total
  * refund → resta del total
  * expense → resta del total

* Resultado del día:

Ventas - Devoluciones - Gastos

* Las devoluciones se registran en el día en que se realizan, no en el original

---

## 🛠️ Tecnologías utilizadas

* React
* Vite
* JavaScript
* Tailwind CSS
* localStorage (persistencia de operaciones offline)
* Firebase (Firestore) para gestión de productos

---

## ⚠️ Limitaciones actuales

* No incluye control de stock
* Las operaciones no se sincronizan en tiempo real
* La actualización de datos depende de recarga en algunos casos

---

## 💡 Posibles mejoras

* Implementación de control de stock
* Sincronización en tiempo real
* Backend completo para operaciones
* Autenticación de usuarios
* Mejora de UX en flujos críticos

---

## 👩‍💻 Autor

Desarrollado por Gisela Spina

---

## 💥 Cómo ejecutarlo

npm install
npm run dev

---

## 🧠 Cierre

Este proyecto demuestra la capacidad de diseñar una solución funcional para un problema real, tomando decisiones técnicas orientadas a la simplicidad, resiliencia (offline) y claridad en la lógica de negocio.

El foco no estuvo únicamente en la interfaz, sino en construir un flujo confiable para el uso diario en un entorno real de trabajo.


---


