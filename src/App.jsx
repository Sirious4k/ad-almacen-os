import { useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  ShoppingCart, Package, ClipboardList, TrendingUp,
  Plus, Edit2, Trash2, X, Scan, Store, Receipt, AlertCircle, Search,
} from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const IVA = 0.19;

const C = {
  bg:          "#18140f",
  surface:     "#221d16",
  card:        "#2b2419",
  border:      "#3a3025",
  accent:      "#e8a020",
  accentMuted: "#6b4a0e",
  text:        "#f0ebe0",
  muted:       "#b8a898",
  green:       "#4ade80",
  red:         "#f87171",
};

const btnPrimary = {
  padding: "9px 18px",
  background: C.accent,
  color: "#18140f",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 16,
  fontFamily: "inherit",
};
const btnSecondary = {
  padding: "9px 18px",
  background: C.surface,
  color: C.muted,
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 16,
  fontFamily: "inherit",
};
const btnSmall = {
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  color: C.text,
  background: C.surface,
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const clp = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(Math.round(n || 0));

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const todayStr = () => new Date().toISOString().slice(0, 10);

const calcPV = (costo, pct) => Math.round(costo * (1 + pct / 100));

// ─── HOOK ─────────────────────────────────────────────────────────────────────
function useLS(key, init) {
  const [v, sv] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : init;
    } catch {
      return init;
    }
  });
  const set = useCallback(
    (fn) => {
      sv((prev) => {
        const next = typeof fn === "function" ? fn(prev) : fn;
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key]
  );
  return [v, set];
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage }) {
  const nav = [
    { id: "venta",       icon: ShoppingCart, label: "Nueva Venta",  color: "#4ade80", bg: "#1a2e1a", border: "#2d5a2d", activeBg: "#2a4a2a", activeBorder: "#4ade80", iconBg: "rgba(74,222,128,0.15)"  },
    { id: "inventario",  icon: Package,      label: "Inventario",   color: "#60a5fa", bg: "#1a2038", border: "#2d3d70", activeBg: "#1e2d5a", activeBorder: "#60a5fa", iconBg: "rgba(96,165,250,0.15)"  },
    { id: "historial",   icon: ClipboardList,label: "Historial",    color: "#e8a020", bg: "#2a1f10", border: "#6b4a0e", activeBg: "#3d2a10", activeBorder: "#e8a020", iconBg: "rgba(232,160,32,0.15)"  },
    { id: "reportes",    icon: TrendingUp,   label: "Reportes",     color: "#a78bfa", bg: "#1e1a2e", border: "#4a3a70", activeBg: "#2d2444", activeBorder: "#a78bfa", iconBg: "rgba(167,139,250,0.15)" },
  ];

  return (
    <div style={{ width: 160, background: C.bg, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", minHeight: "100vh", padding: "14px 10px", gap: 10, boxSizing: "border-box", flexShrink: 0 }}>
      
      {/* Brand */}
      <div style={{ textAlign: "center", paddingBottom: 14, borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
        <div style={{ fontFamily: "Comico, sans-serif", fontWeight: 800, fontSize: 30, color: C.accent, letterSpacing: "-0.3px" }}>M & B</div>
      </div>

      {/* Nav cards */}
      {nav.map(({ id, icon: Icon, label, color, bg, border, activeBg, activeBorder, iconBg }) => {
        const isActive = page === id;
        return (
          <div
            key={id}
            onClick={() => setPage(id)}
            style={{
              borderRadius: 12,
              padding: "16px 8px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              background: isActive ? activeBg : bg,
              border: `1.5px solid ${isActive ? activeBorder : border}`,
              transition: "all 0.15s",
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={24} color={color} strokeWidth={1.8} />
            </div>
            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 600, color, textAlign: "center", letterSpacing: "0.03em" }}>
              {label}
            </span>
          </div>
        );
      })}

      {/* Version */}
      <div style={{ marginTop: "auto", textAlign: "center", fontSize: 9, color: C.border, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
        v0.2 · Prototipo
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const isOk = type === "success";
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 999,
        background: isOk ? "#14532d" : "#7f1d1d",
        color: isOk ? C.green : C.red,
        padding: "10px 18px",
        borderRadius: 8,
        fontSize: 15,
        border: `1px solid ${isOk ? C.green : C.red}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        fontFamily: "inherit",
      }}
    >
      {msg}
    </div>
  );
}

// ─── PAGE: VENTA ──────────────────────────────────────────────────────────────
function PageVenta({ productos, addVenta }) {
  const [input, setInput] = useState("");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [done, setDone] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const handleKey = (e) => {
    if (e.key !== "Enter") return;
    const code = input.trim();
    if (!code) return;
    const prod = productos.find((p) => p.codigoBarra === code);
    if (!prod) {
      showToast(`Código "${code}" no encontrado`);
      setInput("");
      return;
    }
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === prod.id);
      if (i >= 0) {
        const next = [...prev];
        const q = next[i].cantidad + 1;
        next[i] = { ...next[i], cantidad: q, subtotal: q * next[i].precio };
        return next;
      }
      return [
        ...prev,
        {
          id: prod.id,
          nombre: prod.nombre,
          precio: prod.precioVenta,
          costo: prod.precioCosto,
          cantidad: 1,
          subtotal: prod.precioVenta,
        },
      ];
    });
    setInput("");
    showToast(`${prod.nombre} agregado`, "success");
    inputRef.current?.focus();
  };

  const remove = (id) => setCart((p) => p.filter((x) => x.id !== id));
  const qty = (id, q) => {
    if (q < 1) { remove(id); return; }
    setCart((p) =>
      p.map((x) => (x.id === id ? { ...x, cantidad: q, subtotal: q * x.precio } : x))
    );
  };

  const total   = cart.reduce((s, i) => s + i.subtotal, 0);
  const iva     = Math.round(total * IVA / (1 + IVA));
  const neto    = Math.round(total - iva);
  const ganancia= Math.round(cart.reduce((s, i) => s + (i.precio - i.costo) * i.cantidad, 0));

  const finalizar = () => {
    if (!cart.length) return;
    addVenta({
      id: uid(),
      fecha: new Date().toISOString(),
      items: cart,
      total,
      neto,
      iva,
      ganancia,
    });
    setCart([]);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
    inputRef.current?.focus();
  };

  return (
    <div style={{ display: "flex", gap: 20, padding: 24, height: "calc(100vh - 48px)", boxSizing: "border-box" }}>
      <Toast msg={toast?.msg} type={toast?.type} />

      {/* Left */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
        {/* Scanner */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ color: C.muted, fontSize: 15, marginBottom: 8, display: "flex", alignItems: "center", gap: 6, fontWeight: 600, letterSpacing: "0.05em" }}>
            <Scan size={13} /> ESCANEAR CÓDIGO DE BARRA
          </div>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pistolée o escribe el código y presiona Enter…"
            style={{
              width: "100%",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "10px 14px",
              color: C.text,
              fontSize: 16,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div style={{ color: C.muted, fontSize: 15, marginTop: 7 }}>
            La pistola USB funciona automáticamente como teclado.
          </div>
        </div>

        {/* Cart */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "13px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, color: C.muted, fontSize: 15, fontWeight: 600, letterSpacing: "0.05em" }}>
              <ShoppingCart size={20} /> PRODUCTOS ({cart.length})
            </div>
            <div style={{ color: C.muted, fontSize: 15, fontWeight: 600, letterSpacing: "0.05em", textAlign: "center", minWidth: 70 }}>CANTIDAD</div>
            <div style={{ minWidth: 80 }} />
            <div style={{ width: 28 }} />
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {cart.length === 0 ? (
              <div style={{ color: C.muted, textAlign: "center", padding: 48, fontSize: 16 }}>
                Sin productos. Escanea un código de barra para comenzar.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", padding: "11px 20px", gap: 12, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: C.text, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.nombre}</div>
                    <div style={{ color: C.muted, fontSize: 16 }}>{clp(item.precio)} c/u</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => qty(item.id, item.cantidad - 1)} style={{ ...btnSmall }}>−</button>
                    <span style={{ color: C.text, fontSize: 34, minWidth: 22, textAlign: "center" }}>{item.cantidad}</span>
                    <button onClick={() => qty(item.id, item.cantidad + 1)} style={{ ...btnSmall }}>+</button>
                  </div>
                  <div style={{ color: C.text, fontSize: 34, fontWeight: 400, minWidth: 80, textAlign: "right", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}>{clp(item.subtotal)}</div>
                  <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right: summary */}
      <div style={{ width: 260, flexShrink: 0 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ color: C.muted, fontSize: 15, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 18 }}>RESUMEN</div>

          {[["Neto", neto], ["IVA (19%)", iva]].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: C.muted, fontSize: 34 }}>{label}</span>
              <span style={{ color: C.text, fontSize: 34, fontWeight: 400, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}>{clp(val)}</span>
            </div>
          ))}

          <div style={{ height: 1, background: C.border, margin: "14px 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, alignItems: "baseline" }}>
            <span style={{ color: C.text, fontSize: 34, fontWeight: 700 }}>Total</span>
            <span style={{ color: C.accent, fontSize: 34, fontWeight: 400, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}>{clp(total)}</span>
          </div>

          <button
            onClick={finalizar}
            disabled={!cart.length}
            style={{
              ...btnPrimary,
              width: "100%",
              padding: "13px",
              fontSize: 15,
              opacity: cart.length ? 1 : 0.4,
              cursor: cart.length ? "pointer" : "not-allowed",
            }}
          >
            {done ? "✓ Guardado" : "Finalizar Venta"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: INVENTARIO ─────────────────────────────────────────────────────────
function PageInventario({ productos, setProductos }) {
  const emptyForm = { codigoBarra: "", nombre: "", precioCosto: "", porcentaje: "" };
  const [modal, setModal]  = useState(null);
  const [form,  setForm]   = useState(emptyForm);
  const [error, setError]  = useState("");
  const [search,setSearch] = useState("");

  const open = (p = null) => {
    setForm(p ? { codigoBarra: p.codigoBarra, nombre: p.nombre, precioCosto: p.precioCosto, porcentaje: p.porcentajeGanancia } : emptyForm);
    setError("");
    setModal(p || "new");
  };

  const save = () => {
    const { codigoBarra, nombre, precioCosto, porcentaje } = form;
    if (!codigoBarra || !nombre || !precioCosto || !porcentaje) { setError("Todos los campos son obligatorios"); return; }
    const costo = parseFloat(precioCosto);
    const pct   = parseFloat(porcentaje);
    if (isNaN(costo) || costo <= 0) { setError("Precio de costo inválido"); return; }
    if (isNaN(pct)   || pct < 0)   { setError("Porcentaje inválido"); return; }

    if (modal === "new") {
      if (productos.find((p) => p.codigoBarra === codigoBarra)) { setError("Ese código ya existe"); return; }
      setProductos((prev) => [...prev, { id: uid(), codigoBarra, nombre, precioCosto: costo, porcentajeGanancia: pct, precioVenta: calcPV(costo, pct) }]);
    } else {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === modal.id ? { ...p, codigoBarra, nombre, precioCosto: costo, porcentajeGanancia: pct, precioVenta: calcPV(costo, pct) } : p
        )
      );
    }
    setModal(null);
  };

  const del = (id) => {
    if (window.confirm("¿Eliminar este producto?"))
      setProductos((p) => p.filter((x) => x.id !== id));
  };

  const filtered = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.codigoBarra.includes(search)
  );

  const previewPV =
    form.precioCosto && form.porcentaje &&
    !isNaN(parseFloat(form.precioCosto)) &&
    !isNaN(parseFloat(form.porcentaje))
      ? calcPV(parseFloat(form.precioCosto), parseFloat(form.porcentaje))
      : null;

  return (
    <div style={{ padding: 24, height: "calc(100vh - 48px)", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o código…"
            style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px 9px 36px", color: C.text, fontSize: 16, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button onClick={() => open()} style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 7 }}>
          <Plus size={15} /> Nuevo Producto
        </button>
      </div>

      {/* Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 72px", padding: "10px 20px", borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 15, fontWeight: 600, letterSpacing: "0.05em" }}>
          <span>PRODUCTO</span><span>CÓDIGO</span><span>COSTO</span><span>% GANANCIA</span><span>P. VENTA</span><span></span>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.length === 0 ? (
            <div style={{ color: C.muted, textAlign: "center", padding: 48, fontSize: 16 }}>
              {search ? "Sin resultados." : "No hay productos aún. Agrega el primero."}
            </div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 72px", padding: "12px 20px", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
                <span style={{ color: C.text, fontSize: 16 }}>{p.nombre}</span>
                <span style={{ color: C.muted, fontSize: 15, fontFamily: "monospace" }}>{p.codigoBarra}</span>
                <span style={{ color: C.muted, fontSize: 15 }}>{clp(p.precioCosto)}</span>
                <span style={{ color: C.accent, fontSize: 15, fontWeight: 600 }}>{p.porcentajeGanancia}%</span>
                <span style={{ color: C.text, fontSize: 16, fontWeight: 600 }}>{clp(p.precioVenta)}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => open(p)} style={{ ...btnSmall }}><Edit2 size={13} color={C.muted} /></button>
                  <button onClick={() => del(p.id)} style={{ ...btnSmall, background: "#2d1515" }}><Trash2 size={13} color={C.red} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: 400, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h3 style={{ color: C.text, margin: 0, fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700 }}>
                {modal === "new" ? "Nuevo Producto" : "Editar Producto"}
              </h3>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}>
                <X size={20} />
              </button>
            </div>

            {[
              { label: "Código de Barra", key: "codigoBarra", placeholder: "Ej: 7801234567890" },
              { label: "Nombre del Producto", key: "nombre", placeholder: "Ej: Coca-Cola 500ml" },
              { label: "Precio de Costo ($)", key: "precioCosto", placeholder: "Ej: 850", type: "number" },
              { label: "% de Ganancia", key: "porcentaje", placeholder: "Ej: 30", type: "number" },
            ].map(({ label, key, placeholder, type = "text" }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ color: C.muted, fontSize: 16, display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", color: C.text, fontSize: 16, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}

            {previewPV !== null && (
              <div style={{ background: C.surface, borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.muted, fontSize: 15 }}>Precio de Venta calculado</span>
                <span style={{ color: C.accent, fontWeight: 700, fontSize: 17 }}>{clp(previewPV)}</span>
              </div>
            )}

            {error && (
              <div style={{ color: C.red, fontSize: 16, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertCircle size={13} /> {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
              <button onClick={save} style={{ ...btnPrimary, flex: 1 }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGE: HISTORIAL ──────────────────────────────────────────────────────────
function PageHistorial({ ventas }) {
  const [expanded, setExpanded] = useState(null);
  const sorted = [...ventas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const fmt = (iso) =>
    new Date(iso).toLocaleString("es-CL", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div style={{ padding: 24, overflowY: "auto", height: "calc(100vh - 48px)", boxSizing: "border-box" }}>
      <h2 style={{ color: C.text, margin: "0 0 20px", fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700 }}>
        Historial de Boletas
      </h2>

      {sorted.length === 0 ? (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 48, textAlign: "center", color: C.muted, fontSize: 16 }}>
          No hay ventas registradas aún.
        </div>
      ) : (
        sorted.map((v) => (
          <div key={v.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
            <div
              onClick={() => setExpanded(expanded === v.id ? null : v.id)}
              style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
            >
              <Receipt size={18} color={C.accent} />
              <div style={{ flex: 1 }}>
                <div style={{ color: C.text, fontSize: 16, fontWeight: 500 }}>{fmt(v.fecha)}</div>
                <div style={{ color: C.muted, fontSize: 16 }}>{v.items.length} producto(s)</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: C.accent, fontWeight: 700, fontSize: 16 }}>{clp(v.total)}</div>
                <div style={{ color: C.green, fontSize: 16 }}>+{clp(v.ganancia)} ganancia</div>
              </div>
              <span style={{ color: C.muted, fontSize: 16 }}>{expanded === v.id ? "▲" : "▼"}</span>
            </div>

            {expanded === v.id && (
              <div style={{ borderTop: `1px solid ${C.border}`, padding: "16px 20px", background: C.surface }}>
                {v.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 15 }}>
                    <span style={{ color: C.muted }}>{item.cantidad}× {item.nombre}</span>
                    <span style={{ color: C.text }}>{clp(item.subtotal)}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
                {[["Neto", v.neto, C.text], ["IVA (19%)", v.iva, C.text], ["Total", v.total, C.accent], ["Ganancia", v.ganancia, C.green]].map(([label, val, color]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: label === "Total" ? 15 : 13, fontWeight: label === "Total" ? 700 : 400, marginBottom: 6 }}>
                    <span style={{ color: C.muted }}>{label}</span>
                    <span style={{ color, fontWeight: label === "Ganancia" || label === "Total" ? 700 : 400 }}>{clp(val)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ─── PAGE: REPORTES ───────────────────────────────────────────────────────────
function PageReportes({ ventas }) {
  const [view, setView] = useState("day");

  const today = todayStr();
  const month = today.slice(0, 7);

  const sum = (vs) => ({
    total:    vs.reduce((s, v) => s + v.total, 0),
    ganancia: vs.reduce((s, v) => s + v.ganancia, 0),
    iva:      vs.reduce((s, v) => s + v.iva, 0),
    count:    vs.length,
  });

  const dayStats   = sum(ventas.filter((v) => v.fecha.slice(0, 10) === today));
  const monthStats = sum(ventas.filter((v) => v.fecha.slice(0, 7)  === month));
  const stats = view === "day" ? dayStats : monthStats;

  const chartData = (() => {
    if (view === "day") {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const ds = d.toISOString().slice(0, 10);
        const vs = ventas.filter((v) => v.fecha.slice(0, 10) === ds);
        return {
          name: d.toLocaleDateString("es-CL", { weekday: "short" }),
          ventas:   Math.round(vs.reduce((s, v) => s + v.total, 0)),
          ganancia: Math.round(vs.reduce((s, v) => s + v.ganancia, 0)),
        };
      });
    }
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const ms = d.toISOString().slice(0, 7);
      const vs = ventas.filter((v) => v.fecha.slice(0, 7) === ms);
      return {
        name:     d.toLocaleDateString("es-CL", { month: "short" }),
        ventas:   Math.round(vs.reduce((s, v) => s + v.total, 0)),
        ganancia: Math.round(vs.reduce((s, v) => s + v.ganancia, 0)),
      };
    });
  })();

  const StatCard = ({ label, value, sub, color }) => (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, flex: 1 }}>
      <div style={{ color: C.muted, fontSize: 15, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 10 }}>{label}</div>
      <div style={{ color: color || C.text, fontSize: 32, fontWeight: 400, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px", marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 16 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ padding: 24, overflowY: "auto", height: "calc(100vh - 48px)", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Toggle */}
      <div style={{ display: "flex", background: C.card, borderRadius: 9, padding: 4, alignSelf: "flex-start", border: `1px solid ${C.border}`, gap: 2 }}>
        {[{ id: "day", label: "Hoy" }, { id: "month", label: "Este Mes" }].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            style={{
              padding: "7px 22px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              background: view === id ? C.accent : "transparent",
              color: view === id ? "#18140f" : C.muted,
              fontWeight: view === id ? 700 : 400,
              fontSize: 15,
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 16 }}>
        <StatCard label="VENTAS TOTALES" value={clp(stats.total)} sub={`${stats.count} transacción${stats.count !== 1 ? "es" : ""}`} color={C.accent} />
        <StatCard label="GANANCIA NETA" value={clp(stats.ganancia)} sub={stats.total > 0 ? `${Math.round((stats.ganancia / stats.total) * 100)}% sobre ventas` : "Sin ventas"} color={C.green} />
        <StatCard label="IVA ACUMULADO" value={clp(stats.iva)} sub="19% incluido en ventas" color={C.red} />
        <StatCard label="COSTO DE LO VENDIDO" value={clp(stats.total - stats.ganancia)} color={C.text} />
      </div>

      {/* Chart */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 20px 12px" }}>
        <div style={{ color: C.muted, fontSize: 15, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 18 }}>
          {view === "day" ? "VENTAS Y GANANCIA — ÚLTIMOS 7 DÍAS" : "VENTAS Y GANANCIA — ÚLTIMOS 6 MESES"}
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={chartData} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 16 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: C.muted, fontSize: 15 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`)}
            />
            <Tooltip
              contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 16 }}
              formatter={(v, name) => [clp(v), name === "ventas" ? "Ventas" : "Ganancia"]}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="ventas"   fill={C.accentMuted} radius={[4, 4, 0, 0]} />
            <Bar dataKey="ganancia" fill={C.accent}      radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 20, paddingTop: 4 }}>
          {[["Ventas totales", C.accentMuted], ["Ganancia", C.accent]].map(([label, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, color: C.muted }}>
              <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState("venta");
  const [productos, setProductos] = useLS("productos_v1", []);
  const [ventas, setVentas]     = useLS("ventas_v1", []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600&family=Bebas+Neue&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);

    const link2 = document.createElement("link");
    link2.href = "https://api.fontshare.com/v2/css?f[]=comico@400&display=swap";
    link2.rel = "stylesheet";
    document.head.appendChild(link2);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "DM Sans, sans-serif", color: C.text }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        {page === "venta"      && <PageVenta      productos={productos} addVenta={(v) => setVentas((p) => [...p, v])} />}
        {page === "inventario" && <PageInventario productos={productos} setProductos={setProductos} />}
        {page === "historial"  && <PageHistorial  ventas={ventas} />}
        {page === "reportes"   && <PageReportes   ventas={ventas} />}
      </div>
    </div>
  );
}
