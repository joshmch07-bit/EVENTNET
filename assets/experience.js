// EventNet 2.4 - interaction, calculators, cursor trail and speed test interpretation.
(()=>{
const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!mq.matches && window.matchMedia('(pointer:fine)').matches){
  const halo=document.createElement('div'),dot=document.createElement('div');halo.className='en-trail';dot.className='en-trail-dot';document.body.append(halo,dot);
  let pos={x:-100,y:-100},dest={x:-100,y:-100},raf=false;
  function tick(){pos.x+=(dest.x-pos.x)*.2;pos.y+=(dest.y-pos.y)*.2;halo.style.transform=`translate3d(${pos.x-15}px,${pos.y-15}px,0)`;raf=false;if(Math.abs(pos.x-dest.x)>.4||Math.abs(pos.y-dest.y)>.4)request()}
  function request(){if(!raf){raf=true;requestAnimationFrame(tick)}}
  document.addEventListener('pointermove',e=>{dest.x=e.clientX;dest.y=e.clientY;dot.style.transform=`translate3d(${dest.x-2.5}px,${dest.y-2.5}px,0)`;request()},{passive:true});
  document.addEventListener('pointerover',e=>{halo.classList.toggle('active',!!e.target.closest('a,button,.card,.quick-tool-card,.hero-card-mini'))});
  document.addEventListener('pointerleave',()=>{halo.style.opacity='0';dot.style.opacity='0'});document.addEventListener('pointerenter',()=>{halo.style.opacity='1';dot.style.opacity='1'});
}
function setText(id,v){const x=document.getElementById(id);if(x)x.textContent=v}
function get(id){return document.getElementById(id)}
function assessConnection({down,ping,up}){
  const upKnown=Number.isFinite(up);
  const assessments=[];
  let headline='Tu conexión requiere evaluación adicional.';
  let summary='El Speed Test es una referencia de una sola ubicación y momento. Para operaciones críticas se necesitan pruebas de estabilidad, redundancia y carga.';
  if(down>=3 && ping<=120){
    assessments.push('Registro / check-in y navegación básica: posible en baja concurrencia, sujeto a estabilidad y disponibilidad del servicio.');
    headline='Posible para operaciones ligeras.';
  } else {
    assessments.push('Registro / check-in: no recomendamos confiar en esta medición como único enlace.');
  }
  if(down>=4 && ping<=110){
    assessments.push('Terminales POS: posible como referencia, pero necesitan segmentación, estabilidad y un respaldo independiente.');
  } else {
    assessments.push('Terminales POS: conviene una ruta dedicada o de respaldo, con prueba real del sistema de pago.');
  }
  if(upKnown){
    if(up>=3 && ping<=100){
      assessments.push('Videollamadas / Teams / Zoom: podría funcionar para una sesión HD ligera si la subida se sostiene y el jitter es bajo.');
    } else {
      assessments.push('Videollamadas: subir video en HD puede ser inestable; revisa la capacidad real de subida.');
    }
    if(up>=8 && ping<=90){
      assessments.push('Streaming HD: hay margen inicial para un stream moderado, pero requiere prueba prolongada, bitrate configurado y redundancia.');
      headline='Base prometedora para transmisión en vivo.';
    } else {
      assessments.push('Streaming HD: no se puede recomendar como enlace principal con esta subida de referencia; evalúa enlace dedicado o bonding.');
    }
    if(up>=25 && down>=40 && ping<=70){
      assessments.push('Transmisión multicámara: puede existir capacidad de subida, pero no se valida sin conocer número de encoders, bitrates y carga simultánea.');
    }
  } else {
    assessments.push('Streaming y videollamadas: no es posible valorar su aptitud porque no se pudo medir la subida. Usa la prueba alternativa y valida estabilidad.');
  }
  if(down>=20 && ping<=80)summary='La descarga y latencia muestran una base prometedora para algunas aplicaciones. La aptitud final depende de subida sostenida, jitter, concurrencia, enlaces redundantes y pruebas de cada sistema.';
  assessments.push('Operación de misión crítica: ninguna prueba aislada permite declararla apta sin redundancia, SLA y ensayo de fallas.');
  return {headline,summary,assessments};
}
function renderAssessment(result){
  const box=get('speed-assessment'); if(!box) return;
  box.hidden=false;
  const data=assessConnection(result);
  const list=data.assessments.map(item=>`<li>${item}</li>`).join('');
  box.innerHTML=`<strong>${data.headline}</strong><p>${data.summary}</p><ul>${list}</ul>`;
}
function initViews(){
 if('IntersectionObserver' in window&&!mq.matches){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{rootMargin:'0px 0px -35px 0px',threshold:.05});document.querySelectorAll('.section-head,.photo-mosaic,.ops-image,.service-proof,.calc-panel,.expo-spotlight-wrap,.speed-panel,.tools-side').forEach(x=>{x.classList.add('en-reveal');observer.observe(x)})}
 const att=get('calc-attendees');if(att){let fn=()=>{const n=Math.max(1,+att.value||0),pct=+get('calc-share').value/100,u=+get('calc-profile').value,s=Math.max(0,+get('calc-streams').value||0);setText('calc-share-v',Math.round(pct*100)+'%');setText('calc-mbps',Math.ceil((n*pct*u+s*12)*1.3))};['calc-attendees','calc-share','calc-profile','calc-streams'].forEach(id=>get(id)?.addEventListener('input',fn));fn()}
 if(get('wifi-users')){let fn=()=>{const u=Math.max(1,+get('wifi-users').value||0),cap=Math.max(1,+get('wifi-density').value||0),zones=Math.max(1,+get('wifi-zones').value||0);setText('calc-aps',Math.max(Math.ceil(u/cap),zones))};['wifi-users','wifi-density','wifi-zones'].forEach(id=>get(id)?.addEventListener('input',fn));fn()}
 const btn=get('run-speedtest');if(btn)btn.addEventListener('click',async()=>{
   btn.disabled=true;
   setText('speed-status','EJECUTANDO');setText('speed-message','Midiendo transferencia aproximada desde este navegador. Puede consumir algunos MB de datos.');
   setText('metric-ping','—');setText('metric-down','—');setText('metric-up','—');setText('speed-primary','…');
   const assessment=get('speed-assessment'); if(assessment){assessment.hidden=true;assessment.innerHTML='';}
   const controller=new AbortController(),timer=window.setTimeout(()=>controller.abort(),18000);
   const url='https://speed.cloudflare.com';const now=()=>performance.now();
   try{
     let st=now();let q=await fetch(url+'/__down?bytes=1000&cache='+Date.now(),{cache:'no-store',mode:'cors',signal:controller.signal});if(!q.ok)throw Error('Servidor de prueba no disponible');await q.arrayBuffer();const ping=+(now()-st).toFixed(0);setText('metric-ping',ping);
     st=now();q=await fetch(url+'/__down?bytes=2000000&cache='+Date.now(),{cache:'no-store',mode:'cors',signal:controller.signal});if(!q.ok)throw Error('No fue posible medir descarga');let blob=await q.arrayBuffer();let down=8*blob.byteLength/((now()-st)/1000)/1e6;down=+down.toFixed(1);setText('metric-down',down.toFixed(1));setText('speed-primary',down.toFixed(1));setText('speed-gauge-label','MBPS · DESCARGA');
     let upKnown=false,measuredUp=null;
     try{const payload=new Uint8Array(600000);st=now();q=await fetch(url+'/__up',{method:'POST',body:payload,mode:'cors',signal:controller.signal});if(!q.ok)throw Error('Upload endpoint unavailable');const up=8*payload.byteLength/((now()-st)/1000)/1e6;setText('metric-up',up.toFixed(1));measuredUp=+up.toFixed(1);upKnown=true;setText('speed-status','PRUEBA FINALIZADA');setText('speed-message','Medición indicativa completada. Recomendamos validar estos resultados bajo carga y con rutas redundantes.');}catch(e){setText('metric-up','N/D');setText('speed-status','PRUEBA PARCIAL');setText('speed-message','Descarga y latencia medidas; la prueba de subida no estuvo disponible.');}
     renderAssessment({down,ping,up:measuredUp});
   }catch(e){setText('speed-status','SIN RESULTADO');setText('speed-primary','—');setText('speed-message','El navegador no pudo acceder al servidor de medición (red, privacidad o CORS). Abre la prueba alternativa independiente.');}
   finally{clearTimeout(timer);btn.disabled=false}
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initViews);else initViews();
window.EventNetInitViews=initViews;
})();
