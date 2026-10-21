# EventNet 2.4.4 · Revisión local

Fecha: 20 de octubre de 2026 (Ciudad de México).
Repositorio: https://github.com/joshmch07-bit/EVENTNET
Base: `cbece1e05ba8c5c5ece0c2268c8d0b75c54d3650` (rama remota main al descargar).
Rama local: `review/eventnet-2.4.4`.
Estado: código preparado para revisión; sin push, sin despliegue en Vercel y sin cambios en producción.

## Qué cambia

- Portada: **Internet para eventos. Cada experiencia, conectada.** El título conserva el alcance de toda la empresa.
- Cuatro accesos principales al inicio: Internet, Wi-Fi por zonas, EventNet Bond y Streaming & Broadcast.
- Broadcast visible en navegación de inicio, CTA y sección fotográfica inmediatamente después de portada.
- “EventNet en cada experiencia” contiene seis tarjetas: registro/POS; transmisiones y Broadcast (segunda tarjeta); activaciones; Wi-Fi; masivos; interacción multipunto.
- Siete diagramas propios en inicio y diagramas contextuales en las siete páginas de servicio correspondientes. Se conservan las demás soluciones y el esquema Core + Bond original.
- Topologías diferenciadas: WAN y distribución local; AP por zonas; VLAN para registro/POS/expositores; backbone por sectores; dos enlaces satelitales más otras WAN hacia Core, túnel y endpoint; contribución de video a distribución; servidor de medios y sedes bidireccionales.
- Comparación explícita entre agregación por paquetes con endpoint compatible, conmutación de respaldo y reparto de sesiones. No se prometen sumas exactas de Mbps ni ausencia de cortes.
- Texto y caption junto a cada arquitectura explican alcance, factibilidad y límites técnicos. La representación móvil agrupa componentes por etapa y conecta las etapas, evitando reducir el texto SVG a un tamaño ilegible.
- SVG inline + CSS, IntersectionObserver, pausa manual, pausa al ocultarse la página y soporte de movimiento reducido. Sin nueva dependencia de ejecución, imágenes externas o librerías de animación.
- Mejoras de título SEO y enlaces internos; se conservan canonical, sitemap, Organization, WebSite y datos estructurados existentes.

## Referencia UX y autoría

Referencia consultada: https://www.peplink.com/es/solutions/starlink-solutions-page/

Lo útil es explicar el recorrido desde las fuentes de conectividad al extremo de agregación y luego a las aplicaciones, apoyándose en movimiento para comunicar el flujo. Esta iteración adopta ese principio explicativo. Los SVG, las rutas, las composiciones y el CSS son nuevos; no se descargó ni incorporó código, imágenes, diagramas o logotipos de Peplink.

No se trasladaron sus cifras comerciales de capacidad ni sus afirmaciones de continuidad. Se distingue contribución de video de distribución por CDN y de interacción bidireccional; Bond requiere los dos extremos y el servicio compatible.

## Conservación comprobada

73 archivos protegidos existentes permanecen idénticos a la base: assets originales, API, herramientas, feedback, cotización, blog y recursos. Esto incluye logotipo, fotografías del Mundial/estadio/Expo/activaciones/Broadcast, scripts de calculadoras, Speed Test y WhatsApp. Los dos archivos nuevos de arquitectura son adicionales.

No se enviaron formularios comerciales ni feedback de prueba. La integración con correo/servicios de formularios en Vercel no se ejecutó en producción.

## Verificación

- 30 páginas HTML, 731 referencias locales: destinos existentes; sin IDs duplicados ni imágenes sin alt. Las páginas modificadas pasan la comprobación de anidación. Blog conserva su redirección a /recursos/ y por eso no necesita H1.
- Sintaxis de architecture.js y revisión de whitespace del diff: correctas.
- Escritorio 1440 × 900 y móvil 390 × 844 / 360 × 800: sin desbordamiento horizontal. En 360 × 800 los cuatro accesos terminan aproximadamente en y=776, antes de las fotos.
- Menú móvil: apertura y estado aria-expanded comprobados.
- Animación de Bond visible: running; al pulsar pausa: paused. Los siete diagramas fuera de pantalla: paused.
- Movimiento reducido: reglas CSS y listener de cambios implementados e inspeccionados; no se cambió la preferencia del sistema durante la prueba. El botón informa cuando el sistema solicita movimiento reducido.
- Calculadora: 1,000 asistentes, concurrencia por defecto 35%, perfil mixto y 2 streams → 487 Mbps orientativos. Wi-Fi: 400 concurrentes, 40/AP y 12 zonas → 12 AP.
- Speed Test real: PRUEBA FINALIZADA; latencia 143 ms, descarga 33.0 Mbps, subida 34.8 Mbps en esta ejecución. Son datos del entorno de prueba y no capacidad comercial de EventNet.

### Rendimiento y límites

CSS nuevo: 9,182 bytes / 2,521 gzip. JS nuevo: 2,196 bytes / 1,040 gzip. Carga adicional de estilos y comportamiento: aproximadamente 3.5 KiB comprimidos, más los SVG incluidos en HTML. Inicio completo: 55,355 bytes / 12,688 gzip. El servidor/CDN debe habilitar compresión para obtener esos tamaños de transferencia.

Las observaciones locales registraron LCP aproximado entre 116 y 196 ms, CLS 0 y cero long tasks en las capturas de diagnóstico. Son medidas locales, sin limitación de red/CPU, con caché potencialmente caliente y sin comparación formal de laboratorio contra la base. No equivalen a Lighthouse móvil, INP de campo, PageSpeed o CrUX y no se presenta una garantía de rendimiento.

El objeto `window.EventNetPerformance` permite inspeccionar LCP/CLS/Event Timing/long tasks si el navegador los soporta. Solo localhost registra un resumen en consola; no se agrega un servicio de telemetría ni se envían estas métricas fuera del navegador. Event Timing es un indicador parcial de interacción, no una implementación de INP de campo.

## Archivos cambiados

`index.html`; `bonding/index.html`; `internet-para-eventos/index.html`; `wifi-eventos-masivos/index.html`; `exposiciones/index.html`; `eventos-masivos/index.html`; `streaming/index.html`; `experiencias-multipunto/index.html`.

Nuevos: `assets/architecture.css`, `assets/architecture.js`, este informe.

## Cómo llevarlo a GitHub sin publicar producción

El ZIP contiene una copia completa del sitio, sin .git. El parche contiene únicamente esta revisión, contra el commit base indicado. No reemplazar el código más reciente a ciegas si main cambió después de esta descarga.

En una copia del repositorio con Git instalado:

```sh
git fetch origin
git switch -c review/eventnet-2.4.4 cbece1e05ba8c5c5ece0c2268c8d0b75c54d3650
git apply --check /ruta/eventnet-2.4.4.patch
git apply /ruta/eventnet-2.4.4.patch
git diff --check
git add index.html bonding/index.html internet-para-eventos/index.html wifi-eventos-masivos/index.html exposiciones/index.html eventos-masivos/index.html streaming/index.html experiencias-multipunto/index.html assets/architecture.css assets/architecture.js REVISION-2.4.4.md
git commit -m "Improve EventNet service visibility and technical diagrams"
git push -u origin review/eventnet-2.4.4
```

Abrir un Pull Request de revisión hacia main. Antes de subir la rama, comprobar que la rama de producción configurada en Vercel sea main y que esta rama solo genere Preview. No fusionar el PR ni ejecutar un despliegue de producción hasta aprobar la revisión. El parche debe volver a aplicarse o integrarse con los cambios nuevos si la base remota avanzó.

Para revisar el ZIP localmente, extraerlo y servir su raíz con un servidor HTTP, por ejemplo `python3 -m http.server 8765`. Las rutas empiezan en `/`, así que abrir index.html como archivo no sustituye una vista previa HTTP.

## Pendiente fuera del alcance local

Revisión visual del cliente, Preview de Vercel y validación final del dominio/configuración de producción. No se dispone aquí de una sesión autenticada de Vercel ni se ha publicado ningún cambio. Las mediciones de campo solo podrán verificarse en una URL de preview o tras un despliegue aprobado.
