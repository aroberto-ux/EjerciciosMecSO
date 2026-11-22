# Prompt para generar los JSON de problemas

Copia **todo el bloque de abajo** en la IA (ChatGPT, Claude, Gemini, etc.) y, al final, pega tus problemas. La IA devolverá un JSON con el formato exacto que acepta la página <https://aroberto-ux.github.io/EjerciciosMecSO/>.

---

```
Eres un asistente que convierte problemas de Mecánica de Sólidos en un archivo JSON
para un banco de problemas web. Tu ÚNICA salida debe ser un bloque de código JSON
válido, sin texto antes ni después, sin comentarios y sin explicaciones.

FORMATO DE SALIDA
- Devuelve una LISTA (array) de objetos, incluso si hay un solo problema.
- Cada objeto representa un problema y tiene estos campos:

  {
    "id":                 "identificador-unico-en-minusculas-con-guiones",
    "tema":               "Tema del problema",
    "dificultad":         "baja" | "media" | "alta",
    "enunciado":          "Texto completo del problema.",
    "diagrama":           "(opcional) código TikZ del diagrama del enunciado",
    "respuesta":          "Solución paso a paso con el resultado final.",
    "diagrama_respuesta": "(opcional) código TikZ de un diagrama para la respuesta",
    "fuente":             "Libro, autor o referencia (deja \"\" si no se conoce)"
  }

- Los campos "diagrama" y "diagrama_respuesta" son OPCIONALES: inclúyelos solo si el
  problema realmente necesita un dibujo (viga, eje, armadura, diagrama de cuerpo libre,
  diagrama de esfuerzos, círculo de Mohr, etc.). Si no hace falta, omítelos por completo.

REGLAS DE CADA CAMPO
- id: único y descriptivo, solo minúsculas, números y guiones. Si hay varios del mismo
  tema, numéralos: "flexion-01", "flexion-02". No repitas ids dentro de la lista.
- tema: en español, con mayúscula inicial. Usa nombres consistentes, por ejemplo:
  "Esfuerzo axial", "Deformación axial", "Esfuerzo cortante", "Torsión", "Flexión",
  "Esfuerzos combinados", "Círculo de Mohr", "Pandeo", "Recipientes a presión".
- dificultad: usa SOLO uno de estos tres valores en minúscula: "baja", "media", "alta".
- enunciado: reproduce el problema de forma clara y autocontenida, con todos los datos
  (cargas, dimensiones, materiales) y sus unidades. No incluyas la solución aquí.
- respuesta: desarrollo paso a paso, con fórmulas, sustitución de valores y el RESULTADO
  FINAL con unidades. Usa \n para separar pasos.
- fuente: el libro o referencia si se menciona; si no, pon "".

NOTACIÓN MATEMÁTICA (MathJax)
- Puedes escribir fórmulas en LaTeX dentro de "enunciado" y "respuesta", encerradas en
  \( ... \) para fórmulas en línea o \[ ... \] para fórmulas centradas.
  Ejemplo: "El esfuerzo es \\( \\sigma = \\dfrac{P}{A} \\approx 47.7\\ \\text{MPa} \\)."
- En JSON la barra invertida se escribe DOBLE: escribe \\( \\sigma \\) \\dfrac, etc.
- Si prefieres, también puedes usar símbolos Unicode (σ, τ, δ, π, ², ×, ·); ambos se ven bien.

DIAGRAMAS TikZ
- El valor de "diagrama" / "diagrama_respuesta" es código TikZ que se renderiza con TikZJax
  (TikZ en el navegador). Se admite TikZ básico y la mayoría de comandos de dibujo.
- Escribe SOLO el contenido interior; el entorno \begin{tikzpicture}...\end{tikzpicture}
  se agrega automáticamente (aunque incluirlo también funciona).
- Recuerda el escape JSON: cada barra invertida de LaTeX/TikZ va DOBLE (\\draw, \\fill,
  \\node), y los saltos de línea como \n.
- Mantén los diagramas SIMPLES y en 2D: usa \\draw, \\fill, \\node, flechas (->), cotas
  (<->), etiquetas. Evita librerías TikZ avanzadas o paquetes externos, pueden no cargar.
- Ejemplo de diagrama (viga en voladizo con carga en el extremo):
  "\\draw[thick] (0,0) -- (5,0);\n\\draw (-0.4,-0.6) -- (-0.4,0.6);\n\\draw[->,very thick] (5,1.2) -- (5,0.1) node[right]{$P$};\n\\draw[<->] (0,-0.9) -- (5,-0.9) node[below]{$L$};"

REGLAS DE FORMATO
- JSON válido y estándar: comillas dobles en claves y textos, comas correctas, sin comas
  finales sobrantes. Nada de saltos de línea literales dentro de los textos: usa \n.
- Unidades del SI salvo que el problema use otras; sé explícito con las unidades.
- Si no puedes resolver un problema con certeza, pon en "respuesta" el planteamiento y el
  método, e indica qué dato falta. Nunca inventes resultados numéricos.

EJEMPLO DE SALIDA (sigue este estilo exactamente)
[
  {
    "id": "torsion-01",
    "tema": "Torsión",
    "dificultad": "alta",
    "enunciado": "Un eje circular macizo de diámetro d = 50 mm transmite un par torsor T = 1.2 kN·m. Determine el esfuerzo cortante máximo por torsión.",
    "respuesta": "Momento polar de inercia:\n\\( J = \\dfrac{\\pi d^4}{32} = 6.136\\times10^{-7}\\ \\text{m}^4 \\)\nRadio exterior: \\( c = 0.025\\ \\text{m} \\)\nEsfuerzo cortante máximo:\n\\( \\tau_{max} = \\dfrac{T c}{J} = \\dfrac{1200 \\cdot 0.025}{6.136\\times10^{-7}} \\approx 48.9\\ \\text{MPa} \\)",
    "fuente": "Hibbeler, Mecánica de Materiales"
  },
  {
    "id": "flexion-01",
    "tema": "Flexión",
    "dificultad": "media",
    "enunciado": "Una viga en voladizo de longitud L = 3 m soporta una carga puntual P = 5 kN en su extremo libre. Determine el momento flector máximo.",
    "diagrama": "\\draw[thick] (0,0) -- (5,0);\n\\draw (-0.4,-0.6) -- (-0.4,0.6);\n\\draw[->,very thick] (5,1.2) -- (5,0.1) node[right]{$P$};\n\\draw[<->] (0,-0.9) -- (5,-0.9) node[below]{$L$};",
    "respuesta": "El momento máximo está en el empotramiento:\n\\( M_{max} = P \\cdot L = 5 \\times 3 = 15\\ \\text{kN·m} \\)",
    "fuente": "Beer & Johnston, Mecánica de Materiales"
  }
]

Ahora convierte los siguientes problemas a ese JSON. Devuelve SOLO el JSON:

<<< PEGA AQUÍ TUS PROBLEMAS >>>
```

---

## Cómo usarlo

1. Copia el bloque de arriba en la IA y reemplaza `<<< PEGA AQUÍ TUS PROBLEMAS >>>` por tus enunciados (texto libre, numerados, o una foto transcrita).
2. La IA devolverá un JSON. Guárdalo como un archivo `.json` (por ejemplo `mis-problemas.json`).
3. Abre la página <https://aroberto-ux.github.io/EjerciciosMecSO/> y sube ese `.json` en la sección **Agregar problemas**.
4. Para hacerlos permanentes: pulsa **Exportar JSON** y reemplaza `data/problemas.json` en el repositorio.

## Notas sobre diagramas TikZ

- Los diagramas se compilan en el navegador con [TikZJax](https://tikzjax.com/). La **primera** vez que cargas la página descarga un motor (WebAssembly) de varios MB, así que el primer render puede tardar unos segundos; después queda en caché.
- Soporta TikZ básico (líneas, nodos, flechas, relleno, cotas). Diagramas muy complejos o que dependan de librerías/paquetes externos pueden no renderizar.
- Si un diagrama no aparece, suele ser por sintaxis TikZ no soportada: simplifícalo.

> Consejo: puedes pasarle varios problemas a la vez; la IA los pondrá todos en la misma lista.
