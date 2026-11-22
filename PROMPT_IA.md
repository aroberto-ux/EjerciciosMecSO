# Prompt para generar los JSON de problemas

Copia **todo el bloque de abajo** en la IA (ChatGPT, Claude, Gemini, etc.) y, al final, pega tus problemas. La IA devolverá un JSON con el formato exacto que acepta la página <https://aroberto-ux.github.io/EjerciciosMecSO/>.

---

```
Eres un asistente que convierte problemas de Mecánica de Sólidos en un archivo JSON
para un banco de problemas web. Tu ÚNICA salida debe ser un bloque de código JSON
válido, sin texto antes ni después, sin comentarios y sin explicaciones.

FORMATO DE SALIDA
- Devuelve una LISTA (array) de objetos, incluso si hay un solo problema.
- Cada objeto representa un problema y tiene exactamente estos campos:

  {
    "id":          "identificador-unico-en-minusculas-con-guiones",
    "tema":        "Tema del problema",
    "dificultad":  "baja" | "media" | "alta",
    "enunciado":   "Texto completo del problema.",
    "respuesta":   "Solución paso a paso con el resultado final.",
    "fuente":      "Libro, autor o referencia (deja \"\" si no se conoce)"
  }

REGLAS DE CADA CAMPO
- id: único y descriptivo, solo minúsculas, números y guiones. Si hay varios del mismo
  tema, numéralos: "torsion-01", "torsion-02". No repitas ids dentro de la lista.
- tema: en español, con mayúscula inicial. Usa nombres consistentes, por ejemplo:
  "Esfuerzo axial", "Deformación axial", "Esfuerzo cortante", "Torsión", "Flexión",
  "Esfuerzos combinados", "Círculo de Mohr", "Pandeo", "Recipientes a presión".
- dificultad: usa SOLO uno de estos tres valores en minúscula: "baja", "media", "alta".
  Estima según el número de pasos y conceptos involucrados.
- enunciado: reproduce el problema de forma clara y autocontenida. Incluye todos los
  datos (cargas, dimensiones, materiales) con sus unidades. No incluyas la solución aquí.
- respuesta: desarrollo paso a paso. Muestra las fórmulas usadas, sustituye los valores
  y marca el RESULTADO FINAL con sus unidades. Usa saltos de línea (\n) para separar pasos.
- fuente: el libro o referencia si se menciona; si no, pon "".

REGLAS DE FORMATO Y NOTACIÓN
- JSON válido y estándar: comillas dobles en claves y valores de texto, comas correctas,
  sin comas finales sobrantes.
- Como JSON no permite saltos de línea literales dentro de un texto, usa \n para los
  saltos de línea dentro de "respuesta" y "enunciado".
- Usa símbolos Unicode legibles para la notación: σ τ δ ε θ π ρ Δ Σ °  × ·  ²  ³  √
  subíndices y superíndices cuando ayuden (d², 10⁻⁴, mm², etc.). No uses LaTeX ni $...$.
- Unidades del SI salvo que el problema use otras; sé explícito con las unidades.
- Si no puedes resolver un problema con certeza, pon en "respuesta" el planteamiento y el
  método, e indica claramente qué dato falta. Nunca inventes resultados numéricos.

EJEMPLO DE SALIDA (sigue este estilo exactamente)
[
  {
    "id": "torsion-01",
    "tema": "Torsión",
    "dificultad": "alta",
    "enunciado": "Un eje circular macizo de diámetro d = 50 mm transmite un par torsor T = 1.2 kN·m. Determine el esfuerzo cortante máximo por torsión.",
    "respuesta": "Momento polar de inercia:\nJ = π·d⁴/32 = π·(0.050)⁴/32 = 6.136×10⁻⁷ m⁴\nRadio exterior:\nc = d/2 = 0.025 m\nEsfuerzo cortante máximo:\nτ_max = T·c/J = (1200 · 0.025) / 6.136×10⁻⁷ ≈ 48.9 MPa",
    "fuente": "Hibbeler, Mecánica de Materiales"
  }
]

Ahora convierte los siguientes problemas a ese JSON. Devuelve SOLO el JSON:

<<< PEGA AQUÍ TUS PROBLEMAS >>>
```

---

## Cómo usarlo

1. Copia el bloque de arriba en la IA y reemplaza `<<< PEGA AQUÍ TUS PROBLEMAS >>>` por tus enunciados (pueden ir en texto libre, numerados, o incluso una foto transcrita).
2. La IA devolverá un JSON. Cópialo y guárdalo como un archivo `.txt` renombrado a `.json`, o pégalo en un archivo nuevo `mis-problemas.json`.
3. Abre la página <https://aroberto-ux.github.io/EjerciciosMecSO/> y sube ese `.json` en la sección **Agregar problemas**.
4. Para hacerlos permanentes: pulsa **Exportar JSON** y reemplaza `data/problemas.json` en el repositorio.

> Consejo: puedes pasarle varios problemas a la vez; la IA los pondrá todos en la misma lista.
