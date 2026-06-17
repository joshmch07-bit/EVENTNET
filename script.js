const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const tabs = document.querySelectorAll("[data-tab]");

const solutions = {
  connect: {
    kicker: "EventNet Connect",
    title: "WiFi de alta densidad para asistentes, staff y operación.",
    copy:
      "Redes WiFi diseñadas por densidad, zonas, interferencia, capacidad y experiencia de uso. Ideal para congresos, convenciones, exposiciones y eventos corporativos.",
    list: [
      "Access points empresariales por zona y aforo.",
      "Redes separadas para asistentes, staff y producción.",
      "Monitoreo de consumo, saturación y disponibilidad.",
    ],
    cta: "Diseñar red WiFi",
  },
  broadcast: {
    kicker: "EventNet Broadcast",
    title: "Internet dedicado, bonding y redundancia para streaming en vivo.",
    copy:
      "Arquitectura de conectividad para transmisiones, eventos híbridos, prensa, cabinas de producción y audiencias remotas.",
    list: [
      "Upload dedicado y priorizado para video.",
      "Bonding inteligente entre múltiples enlaces.",
      "Failover para mantener la transmisión activa.",
    ],
    cta: "Proteger transmisión",
  },
  expo: {
    kicker: "EventNet Expo",
    title: "Redes para exposiciones, stands, demos y expositores.",
    copy:
      "Conectividad segmentada para organizadores, expositores, asistentes, lead retrieval, puntos de venta, demos interactivas y operación.",
    list: [
      "Redes independientes por zona o tipo de usuario.",
      "Soporte para stands interactivos y puntos de venta.",
      "Capacidad planeada por plano, flujo y densidad.",
    ],
    cta: "Cotizar expo",
  },
  engage: {
    kicker: "EventNet Engage",
    title: "WiFi inteligente para experiencia, datos y activaciones.",
    copy:
      "Convierte el acceso a la red en una capa de engagement para asistentes, marcas, patrocinadores y equipos comerciales.",
    list: [
      "Portal cautivo y experiencias de acceso.",
      "Métricas de uso, zonas y comportamiento.",
      "Datos accionables para marketing y operación.",
    ],
    cta: "Activar WiFi inteligente",
  },
  mission: {
    kicker: "EventNet Mission Critical",
    title: "Redundancia, failover y monitoreo para eventos que no pueden fallar.",
    copy:
      "Diseñamos continuidad operativa con fibra temporal, satélite, 4G/5G, microonda, bonding, soporte en sitio y monitoreo 24/7.",
    list: [
      "Arquitectura multi-enlace con rutas de respaldo.",
      "Monitoreo durante montaje, showtime y desmontaje.",
      "Plan técnico para áreas de mayor criticidad.",
    ],
    cta: "Diseñar plan de contingencia",
  },
};

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState);

menuButton.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => document.body.classList.remove("menu-open"));
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    const data = solutions[tab.dataset.tab];
    document.querySelector("[data-solution-kicker]").textContent = data.kicker;
    document.querySelector("[data-solution-title]").textContent = data.title;
    document.querySelector("[data-solution-copy]").textContent = data.copy;
    document.querySelector("[data-solution-cta]").textContent = data.cta;
    document.querySelector("[data-solution-list]").innerHTML = data.list
      .map((item) => `<li>${item}</li>`)
      .join("");
  });
});

const bandwidthForm = document.querySelector("[data-bandwidth-form]");
const wifiForm = document.querySelector("[data-wifi-form]");
const speedButton = document.querySelector("[data-speed-button]");

const updateBandwidth = () => {
  const attendees = Number(document.querySelector("[data-attendees]").value || 0);
  const usage = Number(document.querySelector("[data-usage]").value || 0);
  const streams = Number(document.querySelector("[data-streams]").value || 0);
  const base = attendees * usage;
  const streaming = streams * 12;
  const overhead = (base + streaming) * 0.28;
  const recommendation = Math.max(50, Math.ceil((base + streaming + overhead) / 10) * 10);
  document.querySelector("[data-bandwidth-result]").textContent = `${recommendation} Mbps`;
};

const updateWifi = () => {
  const concurrent = Number(document.querySelector("[data-concurrent]").value || 0);
  const zones = Number(document.querySelector("[data-zones]").value || 1);
  const density = Number(document.querySelector("[data-density]").value || 55);
  const apsByDensity = Math.ceil(concurrent / density);
  const apsByZones = Math.ceil(zones * 1.4);
  const recommendation = Math.max(apsByDensity, apsByZones);
  document.querySelector("[data-wifi-result]").textContent = `${recommendation} APs`;
};

bandwidthForm.addEventListener("input", updateBandwidth);
wifiForm.addEventListener("input", updateWifi);
updateBandwidth();
updateWifi();

const formatMbps = (value) => `${value.toFixed(value >= 100 ? 0 : 1)} Mbps`;

const usecaseRules = {
  streaming: {
    label: "Streaming",
    ready: ({ up, ping }) => up >= 20 && ping <= 80,
    caution: ({ up, ping }) => up >= 8 && ping <= 130,
  },
  activaciones: {
    label: "Activaciones",
    ready: ({ down, up, ping }) => down >= 40 && up >= 10 && ping <= 100,
    caution: ({ down, up, ping }) => down >= 18 && up >= 5 && ping <= 160,
  },
  expos: {
    label: "Expos",
    ready: ({ down, up, ping }) => down >= 80 && up >= 20 && ping <= 100,
    caution: ({ down, up, ping }) => down >= 35 && up >= 8 && ping <= 160,
  },
  descargas: {
    label: "Descarga de información",
    ready: ({ down }) => down >= 50,
    caution: ({ down }) => down >= 20,
  },
};

function setUsecaseState(key, state) {
  const card = document.querySelector(`[data-usecase="${key}"]`);
  const strong = card.querySelector("strong");
  card.classList.remove("pending", "ready", "caution", "not-ready");
  card.classList.add(state);
  strong.textContent =
    state === "pending"
      ? "Pendiente"
      : state === "ready"
        ? "Apto"
        : state === "caution"
          ? "Con reserva"
          : "Requiere refuerzo";
}

function updateSpeedDiagnosis({ ping, down, up }) {
  let readyCount = 0;
  let cautionCount = 0;

  Object.entries(usecaseRules).forEach(([key, rule]) => {
    if (rule.ready({ ping, down, up })) {
      readyCount += 1;
      setUsecaseState(key, "ready");
    } else if (rule.caution({ ping, down, up })) {
      cautionCount += 1;
      setUsecaseState(key, "caution");
    } else {
      setUsecaseState(key, "not-ready");
    }
  });

  const score = Math.round(((readyCount * 25) + (cautionCount * 12)) / 100 * 100);
  const scoreEl = document.querySelector("[data-speed-score]");
  const verdictEl = document.querySelector("[data-speed-verdict]");
  const adviceEl = document.querySelector("[data-speed-advice]");
  scoreEl.textContent = score;
  scoreEl.style.background = `radial-gradient(circle at center, #07111f 0 52%, transparent 53%), conic-gradient(var(--cyan) ${score * 3.6}deg, rgba(255, 255, 255, 0.12) 0deg)`;

  if (score >= 80) {
    verdictEl.textContent = "Conexión sólida para usos exigentes.";
    adviceEl.textContent =
      "Buen punto de partida. Para eventos con streaming, expos o operación crítica, EventNet validaría redundancia, cobertura y separación de redes.";
  } else if (score >= 45) {
    verdictEl.textContent = "Conexión útil, pero requiere planeación.";
    adviceEl.textContent =
      "Puede funcionar para ciertos usos, pero conviene revisar zonas críticas, concurrencia, subida disponible y respaldo antes del evento.";
  } else {
    verdictEl.textContent = "Conexión de riesgo para un evento profesional.";
    adviceEl.textContent =
      "Recomendamos evaluar un enlace dedicado, bonding, failover o refuerzo WiFi para evitar fallas en showtime.";
  }
}

async function timedFetch(url, options = {}) {
  const start = performance.now();
  const response = await fetch(url, {
    cache: "no-store",
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  const elapsed = (performance.now() - start) / 1000;
  return { bytes: buffer.byteLength, elapsed };
}

async function runSpeedTest() {
  const pingEl = document.querySelector("[data-speed-ping]");
  const downEl = document.querySelector("[data-speed-down]");
  const upEl = document.querySelector("[data-speed-up]");
  const statusEl = document.querySelector("[data-speed-status]");

  if (location.protocol === "file:") {
    statusEl.textContent = "Abre el sitio publicado para correr la prueba real.";
    return;
  }

  speedButton.disabled = true;
  speedButton.textContent = "Midiendo...";
  statusEl.textContent = "Midiendo latencia...";
  pingEl.textContent = "-- ms";
  downEl.textContent = "-- Mbps";
  upEl.textContent = "-- Mbps";
  document.querySelector("[data-speed-score]").textContent = "--";
  document.querySelector("[data-speed-score]").style.background =
    "radial-gradient(circle at center, #07111f 0 52%, transparent 53%), conic-gradient(var(--cyan) 0deg, rgba(255, 255, 255, 0.12) 0deg)";
  document.querySelector("[data-speed-verdict]").textContent =
    "Ejecuta la prueba para conocer tu nivel de preparación.";
  document.querySelector("[data-speed-advice]").textContent =
    "El resultado es una referencia inicial. Para eventos críticos validamos cobertura, redundancia, interferencia, aforo y zonas.";
  Object.keys(usecaseRules).forEach((key) => setUsecaseState(key, "pending"));

  try {
    const pingStart = performance.now();
    await fetch(`/api/speed-download?bytes=1024&t=${Date.now()}`, { cache: "no-store" });
    const ping = Math.round(performance.now() - pingStart);
    pingEl.textContent = `${ping} ms`;

    statusEl.textContent = "Midiendo descarga...";
    const download = await timedFetch(`/api/speed-download?bytes=8000000&t=${Date.now()}`);
    const downMbps = (download.bytes * 8) / download.elapsed / 1000000;
    downEl.textContent = formatMbps(downMbps);

    statusEl.textContent = "Midiendo subida...";
    const uploadBytes = 4000000;
    const payload = new Uint8Array(uploadBytes);
    const uploadStart = performance.now();
    const uploadResponse = await fetch(`/api/speed-upload?t=${Date.now()}`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/octet-stream" },
      body: payload,
    });
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }
    await uploadResponse.json();
    const uploadElapsed = (performance.now() - uploadStart) / 1000;
    const upMbps = (uploadBytes * 8) / uploadElapsed / 1000000;
    upEl.textContent = formatMbps(upMbps);
    updateSpeedDiagnosis({ ping, down: downMbps, up: upMbps });

    statusEl.textContent = "Prueba completada. Resultado referencial sujeto a WiFi, equipo, navegador y ruta de red.";
  } catch (error) {
    statusEl.textContent = "No pudimos correr la prueba. Intenta de nuevo desde el sitio publicado.";
  } finally {
    speedButton.disabled = false;
    speedButton.textContent = "Iniciar prueba";
  }
}

speedButton.addEventListener("click", runSpeedTest);

document.querySelector("[data-quote-form]").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const name = formData.get("name") || "Gracias";
  const eventType = formData.get("eventType");
  const status = document.querySelector("[data-form-status]");
  const button = form.querySelector('button[type="submit"]');

  status.textContent = "Enviando solicitud...";
  button.disabled = true;
  button.textContent = "Enviando...";

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Formspree submission failed");
    }

    status.textContent = `${name}, recibimos tu solicitud para ${eventType}. El siguiente paso es un diagnóstico técnico.`;
    form.reset();
  } catch (error) {
    status.innerHTML =
      'No pudimos enviar la solicitud. Escríbenos por <a href="https://wa.me/525572036146?text=Hola%20EventNet%2C%20tengo%20un%20evento%20urgente%20y%20necesito%20apoyo%20con%20conectividad." target="_blank" rel="noopener">WhatsApp</a>.';
  } finally {
    button.disabled = false;
    button.textContent = "Solicitar diagnóstico";
  }
});

const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
const nodes = [
  { x: 0.5, y: 0.5, r: 9, core: true },
  { x: 0.78, y: 0.2, r: 6 },
  { x: 0.18, y: 0.32, r: 6 },
  { x: 0.68, y: 0.72, r: 6 },
  { x: 0.26, y: 0.78, r: 6 },
  { x: 0.52, y: 0.18, r: 5 },
  { x: 0.84, y: 0.52, r: 5 },
  { x: 0.14, y: 0.58, r: 5 },
];

function drawNetwork(time) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  ctx.clearRect(0, 0, width, height);

  const gridColor = "rgba(255,255,255,0.055)";
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const points = nodes.map((node) => ({
    ...node,
    px: node.x * width,
    py: node.y * height,
  }));
  const core = points[0];

  points.slice(1).forEach((node, index) => {
    ctx.beginPath();
    ctx.moveTo(core.px, core.py);
    ctx.lineTo(node.px, node.py);
    ctx.strokeStyle = "rgba(20,184,201,0.28)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const progress = (time / 1200 + index * 0.18) % 1;
    const px = core.px + (node.px - core.px) * progress;
    const py = core.py + (node.py - core.py) * progress;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();
  });

  points.forEach((node) => {
    const pulse = Math.sin(time / 550 + node.x * 4) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(node.px, node.py, node.r + pulse * 8, 0, Math.PI * 2);
    ctx.fillStyle = node.core ? "rgba(20,115,230,0.18)" : "rgba(20,184,201,0.12)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.px, node.py, node.r, 0, Math.PI * 2);
    ctx.fillStyle = node.core ? "#1473e6" : "#14b8c9";
    ctx.fill();
  });

  requestAnimationFrame(drawNetwork);
}

requestAnimationFrame(drawNetwork);
