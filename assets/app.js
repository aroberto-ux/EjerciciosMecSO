/* Banco de problemas · Mecánica de Sólidos
 * Página estática. Carga el banco base desde data/problemas.json,
 * permite agregar problemas subiendo archivos JSON (se guardan en
 * localStorage) y exportar el conjunto combinado a un archivo JSON.
 */

const STORAGE_KEY = "banco-problemas-subidos";
const DIFICULTADES = ["baja", "media", "alta"];

const estado = {
  base: [],      // problemas del repo (data/problemas.json)
  subidos: [],   // problemas subidos por el usuario (localStorage)
};

const el = {
  lista: document.getElementById("lista"),
  contador: document.getElementById("contador"),
  buscador: document.getElementById("buscador"),
  filtroTema: document.getElementById("filtro-tema"),
  filtroDificultad: document.getElementById("filtro-dificultad"),
  dropzone: document.getElementById("dropzone"),
  fileInput: document.getElementById("file-input"),
  btnExportar: document.getElementById("btn-exportar"),
  btnLimpiar: document.getElementById("btn-limpiar"),
  mensaje: document.getElementById("mensaje"),
  tpl: document.getElementById("tpl-problema"),
};

/* ---------- Carga inicial ---------- */

async function cargarBase() {
  try {
    const res = await fetch("data/problemas.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const datos = await res.json();
    estado.base = normalizarLista(datos);
  } catch (err) {
    console.warn("No se pudo cargar data/problemas.json:", err);
    estado.base = [];
  }
}

function cargarSubidos() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    estado.subidos = guardado ? normalizarLista(JSON.parse(guardado)) : [];
  } catch {
    estado.subidos = [];
  }
}

function guardarSubidos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estado.subidos));
}

/* ---------- Normalización y validación ---------- */

function normalizarLista(datos) {
  const arr = Array.isArray(datos) ? datos : [datos];
  return arr
    .filter((p) => p && typeof p === "object")
    .map(normalizarProblema)
    .filter((p) => p.enunciado); // descarta entradas sin enunciado
}

function normalizarProblema(p) {
  const tema = (p.tema ?? "General").toString().trim() || "General";
  const nivel = (p.dificultad ?? "").toString().trim().toLowerCase();
  return {
    id: (p.id ?? "").toString().trim() || generarId(p),
    tema,
    dificultad: DIFICULTADES.includes(nivel) ? nivel : "",
    enunciado: (p.enunciado ?? "").toString().trim(),
    respuesta: (p.respuesta ?? "").toString().trim(),
    fuente: (p.fuente ?? "").toString().trim(),
  };
}

function generarId(p) {
  const semilla = (p.enunciado ?? "") + (p.tema ?? "");
  let h = 0;
  for (let i = 0; i < semilla.length; i++) {
    h = (h * 31 + semilla.charCodeAt(i)) | 0;
  }
  return "p-" + Math.abs(h).toString(36);
}

/* ---------- Combinar y renderizar ---------- */

function todos() {
  // Los subidos sobrescriben a la base si comparten id.
  const mapa = new Map();
  for (const p of estado.base) mapa.set(p.id, p);
  for (const p of estado.subidos) mapa.set(p.id, p);
  return [...mapa.values()];
}

function aplicarFiltros(lista) {
  const q = el.buscador.value.trim().toLowerCase();
  const tema = el.filtroTema.value;
  const dif = el.filtroDificultad.value;
  return lista.filter((p) => {
    if (tema && p.tema !== tema) return false;
    if (dif && p.dificultad !== dif) return false;
    if (q) {
      const texto = `${p.enunciado} ${p.tema} ${p.fuente} ${p.respuesta}`.toLowerCase();
      if (!texto.includes(q)) return false;
    }
    return true;
  });
}

function render() {
  const lista = aplicarFiltros(todos());
  el.lista.innerHTML = "";

  if (lista.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "vacio";
    vacio.textContent = "No hay problemas que coincidan. Sube un archivo JSON para empezar.";
    el.lista.appendChild(vacio);
  } else {
    for (const p of lista) el.lista.appendChild(crearTarjeta(p));
  }

  const total = todos().length;
  el.contador.textContent =
    `Mostrando ${lista.length} de ${total} problema(s) · ${estado.subidos.length} subido(s) en este navegador.`;
}

function crearTarjeta(p) {
  const nodo = el.tpl.content.cloneNode(true);
  nodo.querySelector(".chip-tema").textContent = p.tema;

  const chipDif = nodo.querySelector(".chip-dificultad");
  if (p.dificultad) {
    chipDif.textContent = "Dificultad: " + p.dificultad;
    chipDif.dataset.nivel = p.dificultad;
  } else {
    chipDif.remove();
  }

  nodo.querySelector(".problema-enunciado").textContent = p.enunciado;

  const resp = nodo.querySelector(".problema-respuesta");
  const btn = nodo.querySelector(".btn-revelar");
  if (p.respuesta) {
    resp.textContent = p.respuesta;
    btn.addEventListener("click", () => {
      const oculto = resp.hasAttribute("hidden");
      if (oculto) {
        resp.removeAttribute("hidden");
        btn.textContent = "Ocultar respuesta";
      } else {
        resp.setAttribute("hidden", "");
        btn.textContent = "Mostrar respuesta";
      }
    });
  } else {
    btn.disabled = true;
    btn.textContent = "Sin respuesta";
    resp.remove();
  }

  nodo.querySelector(".problema-fuente").textContent = p.fuente ? "Fuente: " + p.fuente : "";
  return nodo;
}

function refrescarTemas() {
  const temas = [...new Set(todos().map((p) => p.tema))].sort((a, b) => a.localeCompare(b));
  const actual = el.filtroTema.value;
  el.filtroTema.innerHTML = '<option value="">Todos los temas</option>';
  for (const t of temas) {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    el.filtroTema.appendChild(opt);
  }
  if (temas.includes(actual)) el.filtroTema.value = actual;
}

/* ---------- Subida de archivos ---------- */

async function manejarArchivos(fileList) {
  const archivos = [...fileList].filter((f) => /\.json$/i.test(f.name) || f.type.includes("json"));
  if (archivos.length === 0) {
    mostrarMensaje("Solo se aceptan archivos .json.", "error");
    return;
  }

  let agregados = 0;
  const errores = [];

  for (const archivo of archivos) {
    try {
      const texto = await archivo.text();
      const datos = JSON.parse(texto);
      const nuevos = normalizarLista(datos);
      if (nuevos.length === 0) {
        errores.push(`${archivo.name}: sin problemas válidos`);
        continue;
      }
      for (const p of nuevos) {
        const i = estado.subidos.findIndex((x) => x.id === p.id);
        if (i >= 0) estado.subidos[i] = p;
        else estado.subidos.push(p);
        agregados++;
      }
    } catch (err) {
      errores.push(`${archivo.name}: JSON inválido`);
    }
  }

  if (agregados > 0) {
    guardarSubidos();
    refrescarTemas();
    render();
  }

  if (errores.length) {
    mostrarMensaje(
      `Se agregaron ${agregados} problema(s). Problemas con: ${errores.join("; ")}.`,
      agregados ? "ok" : "error"
    );
  } else {
    mostrarMensaje(`Se agregaron ${agregados} problema(s) correctamente.`, "ok");
  }
}

function mostrarMensaje(texto, tipo) {
  el.mensaje.textContent = texto;
  el.mensaje.className = "mensaje " + (tipo || "");
}

/* ---------- Exportar / limpiar ---------- */

function exportar() {
  const datos = todos();
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "problemas.json";
  a.click();
  URL.revokeObjectURL(url);
  mostrarMensaje(
    `Exportados ${datos.length} problema(s). Sube este archivo a data/problemas.json en el repo para hacerlos permanentes.`,
    "ok"
  );
}

function limpiarSubidos() {
  if (estado.subidos.length === 0) {
    mostrarMensaje("No hay problemas subidos en este navegador.", "");
    return;
  }
  if (!confirm("¿Quitar todos los problemas que subiste en este navegador? El banco del repositorio no se modifica.")) return;
  estado.subidos = [];
  guardarSubidos();
  refrescarTemas();
  render();
  mostrarMensaje("Se quitaron los problemas subidos.", "ok");
}

/* ---------- Eventos ---------- */

function enlazarEventos() {
  el.buscador.addEventListener("input", render);
  el.filtroTema.addEventListener("change", render);
  el.filtroDificultad.addEventListener("change", render);

  el.dropzone.addEventListener("click", () => el.fileInput.click());
  el.dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.fileInput.click();
    }
  });
  el.fileInput.addEventListener("change", (e) => {
    manejarArchivos(e.target.files);
    el.fileInput.value = "";
  });

  ["dragenter", "dragover"].forEach((ev) =>
    el.dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      el.dropzone.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    el.dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      el.dropzone.classList.remove("dragover");
    })
  );
  el.dropzone.addEventListener("drop", (e) => {
    if (e.dataTransfer?.files?.length) manejarArchivos(e.dataTransfer.files);
  });

  el.btnExportar.addEventListener("click", exportar);
  el.btnLimpiar.addEventListener("click", limpiarSubidos);
}

/* ---------- Arranque ---------- */

async function iniciar() {
  cargarSubidos();
  await cargarBase();
  refrescarTemas();
  render();
  enlazarEventos();
}

iniciar();
