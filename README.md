# 🏪 AlmacénOS

Aplicación de escritorio para punto de venta y gestión de inventario, diseñada para pequeños comercios chilenos. Permite registrar ventas por código de barra, administrar productos y visualizar reportes de ventas y ganancias, todo con datos persistentes en local sin necesidad de internet ni servidor.

---

## 📸 Capturas de pantalla

> 🔜 Próximamente

---

## ✨ Funcionalidades

### 🛒 Nueva Venta (Punto de Venta)
- Registro de productos por **código de barra** (compatible con pistola lectora USB)
- Carrito de compras con ajuste de cantidad y eliminación de ítems
- Cálculo automático de **neto, IVA (19%) y total** en pesos chilenos (CLP)
- Cálculo de **ganancia por venta** en tiempo real
- Guardado instantáneo de boleta al finalizar

### 📦 Inventario
- CRUD completo de productos
- Campos: código de barra, nombre, precio de costo y porcentaje de ganancia
- **Precio de venta calculado automáticamente** según el margen definido
- Búsqueda en tiempo real por nombre o código de barra
- Preview del precio de venta al completar el formulario

### 🧾 Historial de Boletas
- Lista de todas las ventas ordenadas de más reciente a más antigua
- Vista expandible por boleta con detalle de ítems, neto, IVA, total y ganancia

### 📊 Reportes
- Alternancia entre vista **diaria** y **mensual**
- Métricas de: ventas totales, ganancia neta, IVA acumulado y costo de lo vendido
- Gráfico de barras de los **últimos 7 días** o **últimos 6 meses** (ventas vs. ganancia)

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|------------|
| UI Framework | React 19 |
| Bundler | Vite 8 |
| Desktop | Electron 41 |
| Gráficos | Recharts 3 |
| Íconos | Lucide React |
| Persistencia | localStorage |
| Empaquetado | Electron Builder (target: NSIS para Windows) |

> **Sin backend.** Todos los datos (productos y ventas) se guardan localmente en el navegador de Electron mediante `localStorage`.

---

## 🚀 Instalación y ejecución

### Prerrequisitos

- Node.js `>= 18.x`
- npm

### Modo desarrollo (web)

```bash
git clone https://github.com/BrandonLYP/ad-almacen-os.git
cd ad-almacen-os
npm install
npm run dev
```

### Modo desarrollo (Electron — app de escritorio)

```bash
npm run electron:dev
```

Abre la aplicación como ventana nativa de escritorio con recarga en caliente.

### Build de producción (instalador Windows `.exe`)

```bash
npm run electron:build
```

Genera el instalador en la carpeta `release/`.

---

## 📁 Estructura del proyecto

```
ad-almacen-os/
├── electron/
│   └── main.js            # Proceso principal de Electron
├── src/
│   ├── App.jsx            # Toda la lógica y UI de la app
│   ├── main.jsx           # Punto de entrada React
│   ├── index.css          # Estilos globales
│   └── assets/            # Imágenes y recursos
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎨 Diseño

La app usa un tema oscuro personalizado con paleta marrón/ámbar, tipografías **DM Sans**, **Syne** y **Bebas Neue**, y todos los estilos definidos en línea mediante objetos de constantes de color centralizados.

---

## 👨‍💻 Autor

**Brandon** — [@BrandonLYP](https://github.com/BrandonLYP)

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
