# Banco de problemas · Mecánica de Sólidos

Página web estática (GitHub Pages) con un banco de problemas de **Mecánica de Sólidos** y sus respuestas, pensada para estudiar. Desde la propia página puedes **agregar problemas subiendo archivos JSON**.

## Cómo usarla

1. Abre la página publicada en GitHub Pages.
2. Navega, busca y filtra los problemas por tema o dificultad.
3. Pulsa **Mostrar respuesta** para revelar la solución de cada problema.

## Agregar problemas subiendo JSON

En la sección **Agregar problemas** puedes arrastrar (o seleccionar) uno o varios archivos `.json`:

- Los problemas subidos aparecen al instante y se guardan en **tu navegador** (localStorage), así los conservas entre visitas.
- Como GitHub Pages solo sirve archivos estáticos, la página **no puede escribir en el repositorio**.

### Hacer los problemas permanentes (visibles para todos)

1. Sube tus JSON en la página.
2. Pulsa **Exportar JSON** para descargar `problemas.json` con el banco completo (base + lo que subiste).
3. Reemplaza [`data/problemas.json`](data/problemas.json) en el repositorio con ese archivo (commit + push).

Al recargar la página, esos problemas ya forman parte del banco para cualquiera que la visite.

## Formato del JSON

Cada archivo es una **lista** de problemas. También se acepta un único objeto. Campos:

| Campo         | Requerido | Descripción                                           |
|---------------|-----------|-------------------------------------------------------|
| `id`          | No        | Identificador único. Si falta, se genera automáticamente. Mismo `id` = sobrescribe. |
| `tema`        | No        | Tema del problema (p. ej. `Torsión`). Por defecto `General`. |
| `dificultad`  | No        | `baja`, `media` o `alta`.                             |
| `enunciado`   | **Sí**    | Texto del problema.                                   |
| `respuesta`   | No        | Solución. Si falta, no se muestra el botón.           |
| `fuente`      | No        | Libro o referencia.                                   |

Ejemplo:

```json
[
  {
    "id": "torsion-01",
    "tema": "Torsión",
    "dificultad": "alta",
    "enunciado": "Un eje circular macizo de diámetro d = 50 mm transmite un par torsor T = 1.2 kN·m. Determine el esfuerzo cortante máximo.",
    "respuesta": "J = π·d⁴/32 = 6.136×10⁻⁷ m⁴; c = 0.025 m; τ_max = T·c/J ≈ 48.9 MPa.",
    "fuente": "Hibbeler, Mecánica de Materiales"
  }
]
```

Hay una plantilla lista para copiar en [`data/plantilla.json`](data/plantilla.json).

## Generar los JSON con una IA

¿Tienes los problemas en texto y quieres que una IA te arme el JSON? Usa el prompt reutilizable de [`PROMPT_IA.md`](PROMPT_IA.md): lo copias en ChatGPT/Claude/Gemini, pegas tus problemas al final y la IA devuelve el JSON listo para subir a la página.

## Estructura del proyecto

```
.
├── index.html            # Página principal
├── assets/
│   ├── app.js            # Lógica: carga, subida, filtros, exportación
│   └── styles.css        # Estilos
└── data/
    ├── problemas.json    # Banco base (editable vía PR)
    └── plantilla.json    # Ejemplo de formato
```

## Desarrollo local

Al abrir `index.html` con `file://` el navegador bloquea `fetch` del JSON. Levanta un servidor estático:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicar en GitHub Pages

En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
