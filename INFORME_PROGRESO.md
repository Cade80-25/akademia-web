# INFORME DE PROGRESO — AkademiaUniversalis

## Contexto inicial (estado encontrado)

**Fecha de inicio:** 2026-10-20, 17:26 UY (UTC-03)

**Repositorio:** `Cade80-25/akademia-web` en GitHub, servido por GitHub Pages en https://akademiauniversalis.com

**Estado encontrado:** Landing estática mínima — un solo `index.html` con CSS embebido que dice "En reconstrucción — nueva plataforma en camino". Sin navegación interna, sin autenticación, sin páginas de materias, aula, biblioteca, mapas, astronomía, comunidad, certificados, portal profesor, institución ni precios. Solo incluye: CNAME, favicon, manifest PWA, service worker, workbox, robots.txt, sitemap.xml, og-image.

**Visión completa (según `llms.txt` del repo):**
- Centro educativo virtual con tutores IA adaptativos
- 37 disciplinas en 7 categorías, niveles desde inicial (3-5 años) hasta universitario/técnico
- 70+ tutores históricos y técnicos (Sócrates, Hipatia, Comenio, Curie, Einstein, Turing, etc.)
- Páginas: Inicio, Materias, Aula virtual (voz+pizarra+multimedia), Rutas de aprendizaje, Biblioteca (PDFs hasta 1.5 GB), Mapas (40+ interactivos), Astronomía (planetario, Sistema Solar 3D, catálogo Messier), Comunidad, Logros (17 insignias), Mis certificados (PDF verificables AU-CERT-XXXX), Portal profesor, Mis tareas, Institución (multi-tenant con códigos INV-XXX), Precios, Instalar (PWA)
- Precios: USD 10 estudiante / 12 profesor / 18 dual, pago único sin suscripciones, PayPal (invitado)
- Enfoque: aprendizaje, entretenido para alumno, útil para profesor

**Objetivo del usuario:** Hacerla lo más interactiva posible, entretenida para el alumno, útil para el profesor, eje en el aprendizaje. Agregar imágenes. Informe actualizado al terminar cada fase.

---

## Fases planificadas

| Fase | Objetivo | Estado |
|---|---|---|
| Fase 1 | Landing interactiva completa: todas las páginas estáticas con navegación real, diseño atractivo, PWA, imágenes, CTA de precios | COMPLETADA |
| 2 | Autenticación: login, registro, recuperación de contraseña | Pendiente |
| 3 | Materias: catálogo de 37 disciplinas en 7 categorías con filtros y búsqueda | Pendiente |
| 4 | Aula virtual: estructura de sesiones en vivo con tutores IA, pizarra, multimedia | Pendiente |
| 5 | Rutas de aprendizaje: secuencias de lecciones con seguimiento de progreso | Pendiente |
| 6 | Biblioteca: sesiones pasadas, PDFs, materiales personales | Pendiente |
| 7 | Mapas y Astronomía: atlas interactivo, planetario, Sistema Solar 3D | Pendiente |
| 8 | Comunidad: grupos públicos/privados con chat en tiempo real | Pendiente |
| 9 | Logros y Certificados: 17 insignias, certificados PDF verificables | Pendiente |
| 10 | Portal profesor: planificación, evaluaciones, corrección IA, grupos | Pendiente |
| 11 | Institución: multi-tenant con códigos INV-XXX | Pendiente |
| 12 | Precios: planes $10/$12/$18 con PayPal, volumen institucional | Pendiente |

---

## Registro de cambios

- **2026-10-20 17:26** — Inicio del proyecto. Revisión de repo `akademia-web` y `llms.txt`. Se identifica que el sitio actual es solo una landing mínima "En reconstrucción". Se define plan de 12 fases.
- **2026-10-20 17:45** — Fase 1 completada: landing interactiva con 11 páginas (index, materias, aula, rutas, biblioteca, mapas, astronomía, comunidad, logros, profesor, institución, precios, auth), CSS base responsivo, JS con menú móvil, scroll, animaciones y contador de stats, favicon SVG, apple-touch-icon, manifest PWA, y 2 imágenes SVG placeholder. Sitio servible directamente desde GitHub Pages o cualquier servidor estático.

---

## Próximo paso

Comenzar Fase 1: crear estructura de carpetas, CSS base, imágenes, y todas las páginas HTML estáticas interactivas.
